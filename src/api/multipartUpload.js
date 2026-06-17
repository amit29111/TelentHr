import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://uat-backend-hrms.ezcompliance.in/';
// export const API_BASE_URL = 'https://hrmsapi.ezcompliance.in/';

const ALLOWED_EXTENSIONS = new Set([
  'xlsx',
  'csv',
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'gif',
]);

const EXT_TO_MIME = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const MIME_TO_EXT = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'text/csv': 'csv',
  'text/comma-separated-values': 'csv',
  'application/vnd.ms-excel': 'xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

export const UPLOAD_ALLOWED_MESSAGE =
  'Only .xlsx, .csv, .pdf, .jpg, .png, .gif files are allowed.';

const normalizeExtension = ext => {
  const lower = String(ext || '').toLowerCase();
  if (lower === 'jpeg') return 'jpg';
  return lower;
};

const extensionFromName = name => {
  if (!name || !String(name).includes('.')) return '';
  return normalizeExtension(String(name).split('.').pop());
};

const extensionFromMime = mime => {
  if (!mime) return '';
  const clean = String(mime).toLowerCase().split(';')[0].trim();
  if (clean === 'image/heic' || clean === 'image/heif') return 'heic';
  return MIME_TO_EXT[clean] || '';
};

export const toUploadFilePart = (asset, fallbackName = 'upload.jpg') => {
  if (!asset?.uri) {
    throw new Error('Could not read selected file.');
  }

  let name =
    asset.fileName ||
    asset.name ||
    String(asset.uri).split('/').pop()?.split('?')[0] ||
    fallbackName;

  let ext = extensionFromName(name) || extensionFromMime(asset.type);

  if (ext === 'heic') {
    throw new Error(
      `${UPLOAD_ALLOWED_MESSAGE} Please select JPG or PNG instead of HEIC.`,
    );
  }

  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    if (String(asset.type || '').startsWith('image/')) {
      ext = 'jpg';
    } else if (String(asset.type || '').includes('pdf')) {
      ext = 'pdf';
    } else {
      throw new Error(UPLOAD_ALLOWED_MESSAGE);
    }
  }

  ext = normalizeExtension(ext);
  const baseName = String(name).includes('.')
    ? String(name).replace(/\.[^.]+$/, '')
    : `proof_${Date.now()}`;
  name = `${baseName}.${ext}`;
  const type = EXT_TO_MIME[ext] || asset.type || 'image/jpeg';

  return {
    uri: asset.uri,
    type,
    name,
  };
};

const extractReadableError = (text, data) => {
  const raw = String(text || '');
  const preMatch = raw.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch) {
    const pre = preMatch[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
    const errMatch = pre.match(/Error:\s*(.+?)(?:\n|at\s)/);
    if (errMatch) return errMatch[1].trim();
    return pre.split('\n')[0].replace(/^Error:\s*/i, '').trim();
  }

  if (raw.includes('Invalid file type')) {
    const match = raw.match(/Invalid file type[^<\n"]+/i);
    if (match) return match[0].trim();
    return UPLOAD_ALLOWED_MESSAGE;
  }

  if (typeof data?.message === 'string' && !data.message.includes('<html')) {
    return data.message;
  }

  return data?.error || data?.statusName || 'Upload failed.';
};

const parseResponseBody = async response => {
  const text = await response.text();
  if (!text) return {message: 'Upload failed.'};
  try {
    const json = JSON.parse(text);
    return {
      ...json,
      message: json?.message || extractReadableError(text, json),
    };
  } catch {
    return {message: extractReadableError(text, {})};
  }
};

export const multipartPut = async (endpointPath, formData) => {
  const authToken = await AsyncStorage.getItem('authToken');
  const orgId = await AsyncStorage.getItem('orgId');
  if (!authToken) {
    throw new Error('Please login again.');
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    Accept: 'application/json',
  };
  if (orgId) {
    headers.org_uuid = orgId;
  }

  const path = String(endpointPath).replace(/^\//, '');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  const data = await parseResponseBody(response);
  if (!response.ok) {
    const message = data?.message || 'Upload failed.';
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const multipartPutWithFallback = async (paths, formData) => {
  let lastError;
  for (const path of paths) {
    try {
      return await multipartPut(path, formData);
    } catch (error) {
      lastError = error;
      if (error?.status && error.status !== 404) {
        throw error;
      }
    }
  }
  throw lastError || new Error('Upload failed.');
};
