import { restClient } from '../Utils/client'

const queryParam = (q = {}) => {
  return Object.keys(q).length ? `?${Object.keys(q).map(k => `${k}=${q[k]}`).join('&')}` : ''
};
const api = {
  details: async (query = {}) => restClient.get(`covid${queryParam(query)}`),
  detailsTimeSeries: async (query = {}) => restClient.get(`covid/series${queryParam(query)}`),
};

export { api }
