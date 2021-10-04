import { PostSneaker } from '@app/types/types';
import { logger } from '@app/utils/logger';

export const getAllProductsSQL = (): string =>
  `select
    id,
    title,
    description,
    price,
    image_link,
    count
  from stocks
  left join products
  on stocks.product_id = products.id
  left join images
  on stocks.product_id = images.image_id
  where stocks.count > 0`;

export const getProductByIdSQL = (id: string): string =>
  `select
    id,
    title,
    description,
    price,
    image_link,
    count
  from stocks
  left join products
  on stocks.product_id = products.id
  left join images
  on stocks.product_id = images.image_id
  where stocks.product_id = '${ id }'`;

export const postProductSQL = ({
  count,
  img,
  price,
  description,
  title
}: PostSneaker): string => {
  logger.info(
    'LOG FROM postProductSQL',
    {
      count,
      img,
      price,
      description,
      title
    }
  );
  
  return `with prod as (
    insert into products (title, description, price) values
    ('${ title }', '${ description }', ${ price })
    returning id
    ), stock as (
      insert into stocks (product_id, count) values
      ((select id from prod), ${ count })
      )	
      insert into images (image_id, image_link) values
      ((select id from prod), '${ img }');`;
  
};
