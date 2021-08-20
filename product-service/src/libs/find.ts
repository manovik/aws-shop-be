import { Sneaker } from "src/types/types";

export const find = (arr: Sneaker[], id: string) => {
  for (let i = 0; i < arr.length; i++ ) {    
    if( arr[i].id === id ) {
      return arr[i];
    }
  }
  return null;
}