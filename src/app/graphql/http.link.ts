import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const HTTP_API_ENDPOINT = environment['GRAPHQL_ENDPOIN'];
const HTTP_URI = `${environment.GRAPHQL_PATH}`;

const createHttpLink = (httpLink, option?) => {
  const _option = {
    uri: HTTP_API_ENDPOINT || HTTP_URI || '/graphql',
    includeExtensions: true,
    headers: new HttpHeaders({
      'X-Custom-Header': 'custom-value',
      'Authorization': 'Link'
    }),
  };
  Object.assign(_option, option || {});

  return httpLink.create(_option);
};

export { createHttpLink };
