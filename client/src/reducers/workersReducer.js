import { workersTypes } from '../actions/actionTypes'

let stateInit = { workers: [] }

const workersReducer = (state= stateInit, action) => {
    switch (action.type) {
        case workersTypes.ADD_WORKERS:
            return { ...state, workers: action.payload };
        default:
            return state;    
    }
};


export default workersReducer;