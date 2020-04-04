import { combineReducers } from "redux";

import usersReducer from "./usersReducer";
import workersReducer from './workersReducer'

const rootReducer = combineReducers({ usersReducer, workersReducer });

export default rootReducer;
