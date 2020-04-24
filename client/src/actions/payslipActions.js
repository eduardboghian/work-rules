import { payslipTypes, siteTypes } from './actionTypes'

export const loadWorkers = (list) => {
    return {
        type: payslipTypes.LOAD_WORKERS,
        payload: list
    }
}

export const addWorker = (siteId, worker) => {
    return {
        type: payslipTypes.ADD_WORKER,
        payload: {
            worker
        }
    }
}

export const removeWorker = (siteId, workerId) => {
    return {
        type: payslipTypes.REMOVE_WORKER,
        payload: {
            workerId
        }
    }
}