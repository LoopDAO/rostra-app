import axios from 'axios';

axios.defaults.timeout = 3000;

axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          console.log('400 error request');
          break;
        case 401:
          console.log('401 error unauthorized');
          break;
        case 422:
          console.log('422 error unprocessable Entity');
          break;
        case 500:
          console.log('500 server error');
          break;
        default:
          console.log(`error connection ${error.response.status}`);
      }
    } else {
      console.log('error connection to server');
    }
    return Promise.reject(error);
  }
);

export function get(url: string, headers = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function post(url: string, data = {}, headers = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, { headers })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        resolve(error);
      });
  });
}
