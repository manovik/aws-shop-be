import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${ handlerPath(__dirname) }/handler.postProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
      }
    }
  ]
};
