import type { AWS } from '@serverless/typescript';
import * as functions from '@app/functions';
import { pg_db_config } from './db_config';
import { GLOBAL_INFO } from '@app/constants';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
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
          QueueName: `${ GLOBAL_INFO.PRODUCT_SERVICE }-queue`
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: `${ GLOBAL_INFO.PRODUCT_SERVICE }-topic`
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'maxnovbet@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
        }
      },
      SNSSubscription2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'maxnovbel@mail.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            price: [
              { 'numeric': ['>=', 350] }
            ]
          }
        }
      },
    },
    Outputs: {
      catalogItemsQueueRef: {
        Value: {
          Ref: 'catalogItemsQueue'
        },
        Export: {
          Name: { 'Fn::Sub': '${AWS::StackName}-${AWS::Region}-catalogQueueLink' }
        },
        Description: 'Export link to catalog queue',
      },
      catalogItemsQueueArn: {
        Value: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
        },
        Export: {
          Name: { 'Fn::Sub': '${AWS::StackName}-${AWS::Region}-catalogQueueArn' }
        },
        Description: 'Export arn to catalog queue',
      },
    }
  },
  functions,
};

module.exports = serverlessConfiguration;
