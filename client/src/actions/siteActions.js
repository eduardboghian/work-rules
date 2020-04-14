import { siteTypes } from './actionTypes'

export const addSites = (sites) => {
    return {
        type: siteTypes.ADD_SITES,
        payload: sites
    }
}

export const updateSites = (siteId, workerId, value) => {
    return {
        type: siteTypes.UPDATE_AVANS,
        payload: {
            siteId,
            workerId,
            value
        }
    }
}

export const updateRatesAction = (siteId, workerId, rates) => {
    return {
        type: siteTypes.UPDATE_RATES,
        payload: {
            siteId,
            workerId,
            rates
        }
    }
}

export const updateHours = (siteId, workerId, hours, hoursOT) => {
    return {
        type: siteTypes.UPDATE_HOURS,
        payload: {
            siteId,
            workerId,
            hours,
            hoursOT
        }
    }
}