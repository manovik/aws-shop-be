
import { GLOBAL_INFO } from '@app/constants';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: GLOBAL_INFO.CSV_BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded'
          },
        ],
        existing: true
      }
    }
  ]
}
