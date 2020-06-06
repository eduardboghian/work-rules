import { combineReducers } from "redux"

import usersReducer from "./usersReducer"
import workersReducer from './workersReducer'
import siteReducers from './siteReducers'
import weekEndingReducers from './weekEndingReducers'
import listReducers from './listReducers'

const rootReducer = combineReducers({ usersReducer, workersReducer, siteReducers, weekEndingReducers, listReducers })

export default rootReducer
