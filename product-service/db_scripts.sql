-- ### # TABLE CREATION

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
   description text,
   price int
)

create table stocks (
	product_id uuid,
   count integer,
   foreign key ("product_id") references "products" ("id")
)

create table images (
	image_id uuid,
   image_link text,
   foreign key ("image_id") references "products" ("id")
)

-- ### # MANUALY POST SEVERAL PRODUCTS INTO /products/ TABLE

insert into products (title, description, price) values
	('Puma Cali Sport', 'Кроссовки Puma Cali Sport (373871-02)', 299),
	('Reebok Classic Leather Lux PW', 'Кроссовки Reebok Classic Leather Lux PW (V68685)', 389),
	('Puma BWM MMS RS-Connect', 'Кроссовки Puma BWM MMS RS-Connect (306941-01)', 369),
	('Puma RS-Z Leather', 'Кроссовки Puma RS-Z Leather (383232-02)', 349),
	('Puma Ferrari RS-Fast', 'Кроссовки Puma Ferrari RS-Fast (306980-01)', 369)

-- ### # POST ONE PRODUCT INTO SEVERAL TABLES WITH ALL PARAMS PROVIDED
-- ### # NOTE: id is generated in DB, then it will be passed to other tables

with prod as (
    insert into products (title, description, price) values
      ('${title}', '${description}', ${price})
      returning id
  ), stock as (
    insert into stocks (product_id, count) values
      ((select id from prod), ${count})
  )	
  insert into images (image_id, image_link) values
    ((select id from prod), '${img}')
  returning (select id from prod);

-- ### # SELECT ALL PRODUCTS WITH ALL PROPS FROM ALL TABLES where stocks.count > 0

select
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
where stocks.count > 0

-- ### # OTHER STUFF

drop table products, stocks, images cascade

select id from products where title like '%Cali%'

create extension if not exists "uuid-ossp";