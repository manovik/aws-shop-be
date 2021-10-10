export enum STATUS {
  SUCCESS = 200,
  DELETED = 204,
  INVALID = 400,
  NOT_FOUND = 404,
  SERV_ERR = 500
}

export enum GLOBAL_INFO {
  IMPORT_SERVICE = 'import-service',
  PRODUCT_SERVICE = 'product-service',
  REGION = 'eu-west-1',
  CSV_BUCKET = 'csv-bucket-eu-west-1-pinapple-shop',
  UPLOADED = 'uploaded',
  PARSED = 'parsed'
}
