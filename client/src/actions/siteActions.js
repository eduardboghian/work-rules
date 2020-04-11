import { siteTypes } from './actionTypes'

export const addSites = (sites) => {
    return {
        type: siteTypes.ADD_SITES,
        payload: sites
    }
}

export const updateSites = (id, sites) => {
    return {
        type: siteTypes.UPDATE_SITES,
        payload: {
            _id: id,
            sites
        }
    }
}