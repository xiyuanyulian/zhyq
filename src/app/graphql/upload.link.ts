import { createUploadLink as createLink } from 'apollo-upload-client';

import { environment } from '../../environments/environment';

const UPLOAD_API_ENDPOINT = environment['GRAPHQL_UPLOAD_ENDPOIN'];
const UPLOAD_URI = `//${window.location.host}${environment['GRAPHQL_PATH']}`;

const createUploadLink = (options?) => {
  const _options = {
    uri: UPLOAD_API_ENDPOINT || UPLOAD_URI || '/graphql'
  };
  Object.assign(_options, options || {});
  return createLink(_options);
};

const isFile = value =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob) ||
  (typeof FileList !== 'undefined' && value instanceof FileList);

const isUpload = ({ variables }) => Object.values(variables).some(isFile);

export { createUploadLink, isFile, isUpload };
