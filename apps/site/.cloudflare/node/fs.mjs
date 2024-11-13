import { files } from '../../next.helpers.mjs';

export function readdir(params, cb) {
  console.log('fs#readdir', params);
  cb(null, []);
}

export function exists(path, cb) {
  console.log('fs#exists', path, files.includes(path));
  cb(files.includes(path));
}

// export function createReadStream(path) {
//   return env.ASSETS.fetch(path).then(response => response.body);
// }

export default {
  readdir,
  exists,
};
