import type { AWS } from '@serverless/typescript';
import * as functions from '@app/functions';
import { pg_db_config } from './db_config';
import { GLOBAL_INFO } from '@app/constants';

const serverlessConfiguration: AWS = {
  service: 'get-products-list',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      ...pg_db_config,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: 'catalogItemsQueue',
      },
      SNS_ARN: {
        Ref: 'createProductTopic',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': [ 'catalogItemsQueue', 'Arn' ],
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'createProductTopic'
        }
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: `${GLOBAL_INFO.PRODUCT_SERVICE}-queue`
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: `${GLOBAL_INFO.PRODUCT_SERVICE}-topic`
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'maxnovbel@mail.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          }
        }
      }
    },
  },
  functions,
};

module.exports = serverlessConfiguration;
