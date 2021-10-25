import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },  
  resources: {
    Outputs: {
      basicAuthorizerLambdaArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn']
        },
        Export: {
          Name: 'basicAuthorizerArn'
        }
      }
    }
  },
  functions,
};

module.exports = serverlessConfiguration;
