import { combineReducers } from "redux"

import usersReducer from "./usersReducer"
import workersReducer from './workersReducer'
import siteReducers from './siteReducers'
import weekEndingReducers from './weekEndingReducers'

const rootReducer = combineReducers({ usersReducer, workersReducer, siteReducers, weekEndingReducers })

export default rootReducer
