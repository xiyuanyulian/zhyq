import {WebSocketLink} from '@apollo/client/link/ws';


import { environment } from '../../environments/environment';

const WS_API_ENDPOINT = environment['GRAPHQL_WS_ENDPOIN'];
const WS_PROTOCOL = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
const WS_URI = WS_PROTOCOL + `//${window.location.host}${environment.GRAPHQL_PATH}`;

const createWebSocketLink = (options) => {
  const _options = {
    uri: WS_API_ENDPOINT || WS_URI,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: 'user.authToken',
      },
    }
  };

  Object.assign(_options, options || {});

  return new WebSocketLink(_options);
};

export { createWebSocketLink };
