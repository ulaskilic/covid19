import apisauce from 'apisauce'

const client = apisauce.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

const makeRequest = async (path, method, data = {}, isAuth = false) => {
  const headers = {};
  let response = null;
  try {
    response = await client[method.toLowerCase()](path, data, { headers: headers })
  } catch (e) {
    response = e
  }
  return response
};

const restClient = {
  get: async (path, isAuth = false) => {
    return makeRequest(path, 'GET', {}, isAuth)
  },
  post: async (path, data, isAuth = false) => {
    return makeRequest(path, 'POST', data, isAuth)
  },
  put: async (path, data, isAuth = false) => {
    return makeRequest(path, 'PUT', data, isAuth)
  },
  delete: async (path, isAuth = false) => {
    return makeRequest(path, 'DELETE', {}, isAuth)
  }
};

export { restClient }

