import { workersTypes } from './actionTypes'
import axios from 'axios'

export const addWorkers = (workers) => {
    return {
        type: workersTypes.ADD_WORKERS,
        payload: workers
    }    
}