import { Sneaker } from "src/types/types";

export const find = (arr: Sneaker[], id: string): Sneaker => {
  try {
    for (let i = 0; i < arr.length; i++ ) {    
      if( arr[i].id === id ) {
        return arr[i];
      }
    }
    return null;
  } catch(err) {
    console.error(
      '#13 ########### Error occured while searching for product!\n',
      err,
    '\n#########################################################');
    return null;
  }
}
