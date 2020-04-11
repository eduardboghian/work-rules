import { siteTypes } from '../actions/actionTypes'

let stateInit = { sites: [] }

const sitesReducer = (state= stateInit, action) => {
    switch(action.type) {
        case siteTypes.ADD_SITES:
            return { ...state, sites: action.payload }

        case siteTypes.UPDATE_SITES: 
            let sites = [...state.sites]
            
            let site = site.find(item => item._id === action.payload._id)
            let index = state.sites.indexOf(site)

            sites[index] = action.payload.sites
            return { ...state, sites }

        default:
            return state;
    }
}

export default sitesReducer