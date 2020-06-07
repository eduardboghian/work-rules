import { siteTypes } from '../actions/actionTypes'

let stateInit = { sites: [] }

const sitesReducer = (state = stateInit, action) => {
    let sites, site, siteIndex, worker, workerIndex

    switch (action.type) {
        case siteTypes.ADD_SITES:
            return { ...state, sites: action.payload }

        case siteTypes.UPDATE_AVANS:
            sites = [...state.sites];
            site = state.sites.find(item => item._id === action.payload.siteId);
            siteIndex = state.sites.indexOf(site);

            worker = site.workers.find(item => item.worker._id === action.payload.workerId);
            workerIndex = site.workers.indexOf(worker);

            sites[siteIndex].workers[workerIndex].worker.others = action.payload.value;

            return { ...state, sites };
        case siteTypes.UPDATE_RATES:
            sites = [...state.sites];

            site = state.sites.find(item => item._id === action.payload.siteId);
            siteIndex = state.sites.indexOf(site);

            worker = site.workers.find(item => item.worker._id === action.payload.workerId);
            workerIndex = site.workers.indexOf(worker);

            sites[siteIndex].workers[workerIndex].rates = action.payload.rates;

            return { ...state, sites };

        case siteTypes.UPDATE_HOURS:
            sites = [...state.sites];

            site = state.sites.find(item => item._id === action.payload.siteId);
            siteIndex = state.sites.indexOf(site);
            console.log(action, sites)
            worker = site.workers.find(item => item.worker._id === action.payload.workerId);
            workerIndex = site.workers.indexOf(worker);

            sites[siteIndex].workers[workerIndex].worker.hours = action.payload.hours;
            sites[siteIndex].workers[workerIndex].worker.hoursOT = action.payload.hoursOT;

            return { ...state, sites };
        default:
            return state;
    }
}

export default sitesReducer