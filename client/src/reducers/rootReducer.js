import { combineReducers } from "redux";

import usersReducer from "./usersReducer";
import workersReducer from './workersReducer'
import siteReducers from './siteReducers'

const rootReducer = combineReducers({ usersReducer, workersReducer, siteReducers });

export default rootReducer;
