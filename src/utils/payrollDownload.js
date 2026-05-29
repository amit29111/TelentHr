import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

const BASE_URL = 'https://uat-backend-hrms.ezcompliance.in/';

const sanitizeFileName = name =>
  String(name || 'document.pdf').replace(/[^\w.-]/g, '_');

export const getDownloadDestination = fileName => {
  const safeName = sanitizeFileName(fileName);
  if (Platform.OS === 'ios') {
    return `${RNFS.DocumentDirectoryPath}/${safeName}`;
  }
  return `${RNFS.DownloadDirectoryPath}/${safeName}`;
};

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

export const showDownloadSuccess = (filePath, fileName) => {
  const name = fileName || filePath.split('/').pop();
  if (Platform.OS === 'android') {
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

  const hasPermission = await ensureAndroidDownloadPermission();
  if (!hasPermission) {
    throw new Error('Storage permission is required to download files.');
  }

  const safeName = sanitizeFileName(fileName);
  const destPath = getDownloadDestination(safeName);
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const result = await RNFS.downloadFile({
    fromUrl: fullUrl,
    toFile: destPath,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(orgId ? {org_uuid: orgId} : {}),
    },
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error('Unable to download file.');
  }

  if (Platform.OS === 'android') {
    try {
      await RNFS.scanFile(destPath);
    } catch (_) {
      // Media scan is best-effort so the file still exists on disk.
    }
  }

  showDownloadSuccess(destPath, safeName);
  return destPath;
};
