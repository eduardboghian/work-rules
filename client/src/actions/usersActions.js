import { usersTypes } from './actionTypes';
import { loginRequest, getAgentsSourcersData } from '../utils/api';

const loginSuccess = data => {
  return {
    type: usersTypes.LOGIN_SUCCES,
    payload: data
  };
};
export const loginFail = errorMessage => {
  return {
    type: usersTypes.LOGIN_FAIL,
    payload: errorMessage
  };
};
const setAgentsSourcersData = data => {
  return {
    type: usersTypes.SET_USERS_SOURCERS,
    payload: data
  };
};
export const login = ({ username, password }) => {
  return dispatch => {
    return loginRequest({ username, password })
      .then(res => dispatch(loginSuccess(res.data)))
      .catch(() => dispatch(loginFail(true)));
  };
};
export const getAgentsSourcers = () => {
  return dispatch => {
    return getAgentsSourcersData().then(res => dispatch(setAgentsSourcersData(res.data)));
  };
};
