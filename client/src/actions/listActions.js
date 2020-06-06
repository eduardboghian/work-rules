import { listTypes } from './actionTypes'

export const loadData = sites => {
  return {
    type: listTypes.LOAD_DATA,
    payload: sites
  }
}

export const addWr = (siteId, worker) => {
  return {
    type: listTypes.ADD_WR,
    payload: {
      siteId,
      worker
    }
  }
}

export const removeWr = (siteId, workerId) => {
  return {
    type: listTypes.REMOVE_WR,
    payload: {
      siteId,
      workerId
    }
  }
}