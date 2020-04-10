import { workersTypes } from '../actions/actionTypes'

let stateInit = { workers: [] }

const workersReducer = (state= stateInit, action) => {
    switch (action.type) {
        case workersTypes.ADD_WORKERS:
            return { ...state, workers: action.payload };

        case workersTypes.UPDATE_WORKERS:
            let workers = [...state.workers]

            let wr = workers.find(item => item._id === action.payload._id)
            let index = state.workers.indexOf(wr)

            workers[index] = action.payload.workers
            return { ...state, workers: workers };    

        default:
            return state;    
    }
};


export default workersReducer;