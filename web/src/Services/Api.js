import { restClient } from '../Utils/client'

const api = {
  total: async () => restClient.get(`covid/total`),
  totalTimeSeries: async () => restClient.get(`covid/totalTimeSeries`),
  totalRegion: async () => restClient.get(`covid/totalRegion`),
  totalRegionTimeSeries: async () => restClient.get(`covid/totalRegionTimeSeries`),
  countryList: async () => restClient.get(`covid/countryList`)
};

export { api }
