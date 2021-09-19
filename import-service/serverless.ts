import type { AWS } from '@serverless/typescript';
import * as functions from '@app/functions';
import { GLOBAL_INFO } from '@app/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
    runtime: 'nodejs14.x',
    region: GLOBAL_INFO.REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::csv-bucket-eu-west-1-pinapple-shop'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::csv-bucket-eu-west-1-pinapple-shop/*'
      },
    ],
  },
  functions,
};

module.exports = serverlessConfiguration;
