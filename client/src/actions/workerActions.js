import { workersTypes } from './actionTypes'

export const addWorkers = (workers) => {
    return {
        type: workersTypes.ADD_WORKERS,
        payload: workers
    }    
}

export const updateWorkers = (id, workers) => {
    return {
        type: workersTypes.UPDATE_WORKERS,
        payload: {
            _id: id,
            workers
        }
    }    
}