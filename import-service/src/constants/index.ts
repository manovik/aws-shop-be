export enum GLOBAL_INFO {
  SERVICE_NAME = 'import-service',
  REGION = 'eu-west-1',
  CSV_BUCKET = 'csv-bucket-eu-west-1-pinapple-shop',
  UPLOADED = 'uploaded',
  PARSED = 'parsed'
}

export enum STATUS {
  SUCCESS = 200,
  INVALID = 400,
  NOT_FOUND = 404,
  SERV_ERR = 500
}
