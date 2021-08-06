import { async } from 'regenerator-runtime';
import * as config from './config.js';

const timeOut = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, 1000 * s);
  });
};

export const getJSON = async function (url) {
  try {
    const respone = await Promise.race([
      fetch(url),
      timeOut(config.TIMOUT_SEC),
    ]);
    if (!respone.ok)
      throw new Error(`Could not find your recipe, please try another one!`);

    const data = await respone.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const respone = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeOut(config.TIMOUT_SEC),
    ]);
    if (!respone.ok)
      throw new Error(`Could not upload your recipe, please try again!`);

    const data = await respone.json();
    return data;
  } catch (err) {
    throw err;
  }
};
