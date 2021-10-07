export type Sneaker = {
  count: number,
  id: string,
  img: string,
  price: number,
  description: string,
  title: string
}

export type PostSneaker = Omit<Sneaker, 'id'>;

export type FormatJSONResponseType = {
  statusCode: number;
  headers: {
      'Access-Control-Allow-Headers': string;
      'Access-Control-Allow-Origin': string;
      'Access-Control-Allow-Methods': string;
  };
  body: Record<string, Sneaker[]> | string;
}

export type ResponseType = {
  statusCode: number
  product?: Sneaker[]
  message?: string
}
