import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${ handlerPath(__dirname) }/handler.deleteProduct`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'products/{id}',
        cors: true,
      }
    }
  ]
};
