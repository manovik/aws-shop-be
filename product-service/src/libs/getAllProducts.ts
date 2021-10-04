import { Sneaker } from "src/types/types";
import https from 'https';

const productsUrl =
  'https://shop-manual-deploy.s3.eu-west-1.amazonaws.com/sneakers.json';

export const getAllProducts = async (): Promise<Sneaker[]> => {
  return new Promise((resolve, reject) => {
    https
      .get(productsUrl, (res) => {
        let body = '';
  
        res.on('data', (chunk) => (body += chunk));
  
        res.on('end', async () => {
          
          resolve(JSON.parse(body) as Sneaker[])
        }
      );
    })
    .on('error', (err) => {
      console.error(
        '#23 ###### Something went wrong!\n',
        err,
        '\n#############################'
      );
      reject(null)
    });
  })
}