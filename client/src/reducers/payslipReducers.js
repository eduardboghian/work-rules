import { payslipTypes } from '../actions/actionTypes'

const stateInit = { workersList: [] }

const payslipReduces = (state= stateInit, action) => {
    switch(action.type) {
        case payslipTypes.LOAD_WORKERS:
            return { ...state, workersList: action.payload }

        case payslipTypes.ADD_WORKER:
            let list = [...state.workersList]
            list.push(action.payload.worker)
            
            return { ...state, workersList: list }

        case payslipTypes.REMOVE_WORKER:
            let listOfWorkers = [...state.workersList]
            let worker = listOfWorkers.find( worker => worker._id === action.payload.workerId )
            let workerIndex = listOfWorkers.indexOf(worker)

            listOfWorkers.splice(workerIndex, 1)
            
            return { ...state, workersList: listOfWorkers }

        default:
            return state    
    }
}

export default payslipReduces