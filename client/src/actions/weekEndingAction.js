import { weekEnding } from './actionTypes'

export const setWeekEnding = (payload) => {
    return {
        type: weekEnding.SET_WEEK_ENDING,
        payload
    }
}