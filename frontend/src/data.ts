// import { copyObject } from "./utilities";
// import Fuse from 'fuse.js';

export async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    if (response.ok) {
      const data: T = await response.json();
      return data;
    } else {
      throw new Error('Error: ' + response.status);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
