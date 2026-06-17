import {Alert, Linking, Platform, Share} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

const BASE_URL = 'https://uat-backend-hrms.ezcompliance.in/';
// const BASE_URL = 'https://hrmsapi.ezcompliance.in/';
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|heic)$/i;

const sanitizeFileName = name =>
  String(name || 'document.pdf').replace(/[^\w.-]/g, '_');

export const payrollFileNameFromUrl = url => {
  if (!url) return 'document';
  try {
    const clean = String(url).split('?')[0];
    return decodeURIComponent(clean.split('/').pop() || 'document');
  } catch {
    return 'document';
  }
};

export const resolvePayrollFileUrl = url => {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('file://')) {
    return trimmed;
  }
  return `${BASE_URL}${trimmed.replace(/^\//, '')}`;
};

const isExternalFileUrl = url => {
  const lower = String(url).toLowerCase();
  return (
    lower.includes('amazonaws.com') ||
    lower.includes('cloudfront.net') ||
    lower.includes('googleusercontent.com') ||
    lower.includes('blob.core.windows.net')
  );
};

const isImageFile = (url, fileName) =>
  IMAGE_EXT.test(String(fileName || '')) || IMAGE_EXT.test(String(url || '').split('?')[0]);

const getAuthHeaders = async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) return null;
  return {
    Authorization: `Bearer ${authToken}`,
    ...(orgId ? {org_uuid: orgId} : {}),
  };
};

const getCacheDestination = fileName => {
  const safeName = `${Date.now()}_${sanitizeFileName(fileName)}`;
  return `${RNFS.CachesDirectoryPath}/${safeName}`;
};

const downloadToCache = async ({url, fileName, useAuth = true}) => {
  const fullUrl = resolvePayrollFileUrl(url);
  const destPath = getCacheDestination(fileName);
  const headers = useAuth ? (await getAuthHeaders()) || {} : {};

  const result = await RNFS.downloadFile({
    fromUrl: fullUrl,
    toFile: destPath,
    headers,
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error(`Unable to download file (${result.statusCode}).`);
  }

  return destPath;
};

const openDownloadedFile = async (filePath, fileName) => {
  const fileUri = `file://${filePath}`;
  try {
    await Share.share({
      url: fileUri,
      title: fileName,
      message: Platform.OS === 'android' ? fileName : undefined,
    });
    return;
  } catch (_) {
    // Share cancelled or unavailable — try opening directly.
  }

  try {
    const canOpen = await Linking.canOpenURL(fileUri);
    if (canOpen) {
      await Linking.openURL(fileUri);
      return;
    }
  } catch (_) {
    // fall through
  }

  Alert.alert('File ready', `File saved at:\n${filePath}`);
};

const ensureDirectory = async dirPath => {
  const exists = await RNFS.exists(dirPath);
  if (!exists) {
    await RNFS.mkdir(dirPath);
  }
};

export const getDownloadDestination = fileName => {
  const safeName = sanitizeFileName(fileName);
  return `${RNFS.DocumentDirectoryPath}/${safeName}`;
};

const getPublicDownloadPath = fileName =>
  `${RNFS.DownloadDirectoryPath}/${sanitizeFileName(fileName)}`;

const ensureAndroidDownloadPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version >= 33) {
    return true;
  }

  const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  const status = await check(permission);
  if (status === RESULTS.GRANTED) {
    return true;
  }

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const showDownloadSuccess = (filePath, fileName, inDownloads = false) => {
  const name = fileName || filePath.split('/').pop();
  if (Platform.OS === 'android' && inDownloads) {
    Alert.alert('Download complete', `File saved to Downloads/${name}`);
    return;
  }
  Alert.alert('Download complete', `File saved as ${name}`);
};

export const downloadAuthenticatedFile = async ({url, fileName}) => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) {
    throw new Error('Please login again.');
  }

  const safeName = sanitizeFileName(fileName);
  await ensureDirectory(RNFS.DocumentDirectoryPath);
  const destPath = getDownloadDestination(safeName);
  const fullUrl = resolvePayrollFileUrl(url);

  const result = await RNFS.downloadFile({
    fromUrl: fullUrl,
    toFile: destPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(orgId ? {org_uuid: orgId} : {}),
    },
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error(`Unable to download file (${result.statusCode}).`);
  }

  const exists = await RNFS.exists(destPath);
  if (!exists) {
    throw new Error('Download failed — file was not saved.');
  }

  const stat = await RNFS.stat(destPath);
  if (Number(stat.size) <= 0) {
    await RNFS.unlink(destPath).catch(() => {});
    throw new Error('Download failed — empty file received.');
  }

  let savedPath = destPath;
  let savedToDownloads = false;

  if (Platform.OS === 'android') {
    try {
      const hasPermission = await ensureAndroidDownloadPermission();
      if (hasPermission) {
        const publicPath = getPublicDownloadPath(safeName);
        await ensureDirectory(RNFS.DownloadDirectoryPath);
        await RNFS.copyFile(destPath, publicPath);
        const publicExists = await RNFS.exists(publicPath);
        if (publicExists) {
          savedPath = publicPath;
          savedToDownloads = true;
          try {
            await RNFS.scanFile(publicPath);
          } catch (_) {
            // scanFile is best-effort only
          }
        }
      }
    } catch (_) {
      // Keep private app copy when public Downloads is unavailable.
    }
  }

  showDownloadSuccess(savedPath, safeName, savedToDownloads);
  return savedPath;
};

export const viewPayrollFile = async ({url, fileName, onPreview}) => {
  if (!url) {
    throw new Error('No file to view.');
  }

  const fullUrl = resolvePayrollFileUrl(url);
  const name = payrollFileNameFromUrl(fileName || url);
  const imageFile = isImageFile(fullUrl, name);

  if (fullUrl.startsWith('file://')) {
    if (imageFile && onPreview) {
      onPreview({uri: fullUrl, title: name});
      return;
    }
    await openDownloadedFile(fullUrl.replace('file://', ''), name);
    return;
  }

  if (isExternalFileUrl(fullUrl)) {
    try {
      await Linking.openURL(fullUrl);
      return;
    } catch (_) {
      const path = await downloadToCache({
        url: fullUrl,
        fileName: name,
        useAuth: false,
      });
      if (imageFile && onPreview) {
        onPreview({uri: `file://${path}`, title: name});
        return;
      }
      await openDownloadedFile(path, name);
      return;
    }
  }

  let cachedPath;
  try {
    cachedPath = await downloadToCache({url: fullUrl, fileName: name, useAuth: true});
  } catch (authError) {
    try {
      cachedPath = await downloadToCache({
        url: fullUrl,
        fileName: name,
        useAuth: false,
      });
    } catch (fallbackError) {
      if (imageFile && onPreview) {
        const headers = await getAuthHeaders();
        onPreview({
          uri: fullUrl,
          headers: headers || undefined,
          title: name,
        });
        return;
      }
      throw authError;
    }
  }

  if (imageFile && onPreview) {
    onPreview({uri: `file://${cachedPath}`, title: name});
    return;
  }

  await openDownloadedFile(cachedPath, name);
};
