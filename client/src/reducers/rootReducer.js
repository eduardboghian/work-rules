import { combineReducers } from "redux";

import usersReducer from "./usersReducer";
import workersReducer from './workersReducer'
import siteReducers from './siteReducers'
import weekEndingReducers from './weekEndingReducers'
import payslipReducers from './payslipReducers'

const rootReducer = combineReducers({ usersReducer, workersReducer, siteReducers, weekEndingReducers, payslipReducers });

export default rootReducer;
