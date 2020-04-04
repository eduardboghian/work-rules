import { usersTypes } from "../actions/actionTypes";

const defaultState = {
  role: "",
  loginError: false,
  agentsSourcers: []
};

const usersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case usersTypes.LOGIN_SUCCES:
      console.log(action.payload);

      return { ...state, role: action.payload };
    case usersTypes.LOGIN_FAIL:
      return { ...state, loginError: action.payload };
    case usersTypes.SET_USERS_SOURCERS:
      return { ...state, agentsSourcers: action.payload };
    default:
      return state;
  }
};

export default usersReducer;
