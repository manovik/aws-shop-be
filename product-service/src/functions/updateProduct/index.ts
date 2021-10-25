import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${ handlerPath(__dirname) }/handler.updateProduct`,
  events: [
    {
      http: {
        method: 'put',
        path: 'products',
        cors: true,
      }
    }
  ]
};
