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
  where stocks.count > 0 and
  deleted_at is null`;

export const getProductByIdSQL = (): string =>
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
  where stocks.product_id = $1`;

export const postProductSQL = (): string => {  
  return `with prod as (
    insert into products (title, description, price) values
    ($1, $2, $3)
    returning id
    ), stock as (
      insert into stocks (product_id, count) values
      ((select id from prod), $4)
      )	
      insert into images (image_id, image_link) values
      ((select id from prod), $5)
    returning (select id from prod);`;
  
};

export const updateProductSQL = {
  upd_Products: (): string => `update products
    set title =  $1,
    description = $2,
    price = $3
    where id = $4`,
  upd_Stocks: (): string => `
    update stocks 
    set count = $1
    where product_id = $2
    `,
  upd_Images: (): string => `
  update images
  set image_link = $1
  where image_id = $2`
};

export const deleteProductSQL = (): string => {
  return 'update products set deleted_at = $1 where id = $2';
};
