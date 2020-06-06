import { listTypes } from '../actions/actionTypes'

let stateInitial = { list: [] }

const listReducers = (state = stateInitial, action) => {
  switch (action.type) {
    case listTypes.LOAD_DATA:
      return { ...state, list: action.payload }

    case listTypes.ADD_WR:
      let list = [...state.list]

      let site = list.find(item => item._id === action.payload.siteId)
      let siteIndex = list.indexOf(site)

      list[siteIndex].workers.push(action.payload.worker)
      return { ...state, list }

    case listTypes.REMOVE_WR:
      let list2 = [...state.list]

      let site2 = list2.find(item => item._id === action.payload.siteId)
      let siteIndex2 = list2.indexOf(site2)

      let worker = site2.workers.find(item => item.worker.weId === action.payload.workerId)
      let workerIndex = site2.workers.indexOf(worker)

      list2[siteIndex2].workers.splice(workerIndex, 1)
      return { ...state, list: list2 }

    default:
      return state
  }
}

export default listReducers