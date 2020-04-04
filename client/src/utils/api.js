const axios = require('axios');

const instance = axios.create({
  baseURL: ''
  // baseURL: 'https://bld-back.herokuapp.com/'
});

const headers = {
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token')
  }
};

export const loginRequest = ({ username, password }) => {
  return instance.post('/user/login', { username, password });
};
export const getAgentsSourcersData = () => {
  return instance.get('/user/agents_sourcers', headers);
};
export const createAgentSourcer = (data, action) => {
  return instance.post('/user/agents_sourcers', { data, action }, headers);
};


export const getClientData = () => {
  return instance.get('/client/get', headers);
};
export const createClient = (data, action) => {
  return instance.post('/client/add', { data, action }, headers);
};


export const getSites = data => {
  return true
  //instance.post('/site/all', data, headers);
};
export const getAllSites = () => {
  return instance.get('/site/get', headers);
};
export const createSite = data => {
  return instance.post('/site/add', { data, action: 'create' }, headers);
};


export const addWorkerToSite = id => {
  return instance.post('/site/add-worker', id, headers);
};
export const getWorkers = () => {
  instance.get('/worker/get', headers).then(res=> console.log('loaded from db', res.data))
  return instance.get('/worker/get', headers);
};
export const createWorker = (data, action) => {
  return instance.post('/worker/add', { data, action }, headers);
};

