import { CAR_LISTEN, CAR_ENGINE_LOAD, CAR_ENGINE_RPM, CAR_ENGINE_STATUS, CAR_SPEED, CAR_COOLANT } from './actionTypes'

export const changeLoad = (value) => ({ type: CAR_ENGINE_LOAD, value })
export const changeRpm = (value) => ({ type: CAR_ENGINE_RPM, value })
export const changeStatus = (value) => ({ type: CAR_ENGINE_STATUS, value })
export const changeSpeed = (value) => ({ type: CAR_SPEED, value })
export const changeCoolant = (value) => ({ type: CAR_COOLANT, value })
export const changeListen = (value) => ({ type: CAR_LISTEN,  value })


