import { weekEnding } from '../actions/actionTypes'

const stateInit = { weekEnding: '' }

const weekEndingReducers = (state= stateInit, action) => {
    switch(action.type) {
        case weekEnding.SET_WEEK_ENDING: 
            return {...state, weekEnding: action.payload }
        default:
            return state;
    }
    
} 

export default weekEndingReducers