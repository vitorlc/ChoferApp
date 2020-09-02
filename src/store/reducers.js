import { CAR_LISTEN, CAR_ENGINE_LOAD, CAR_ENGINE_RPM, CAR_ENGINE_STATUS, CAR_SPEED, CAR_COOLANT, CAR_MAF, RACE_REF } from './actionTypes';

const INITIAL_STATE = {
  status: false,
  listen: false,
  engineLoad: 0,
  rpm: 0,
  load: 0,
  speed: 0,
  coolant: 0,
  maf: 0,
  raceRef: null
}

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CAR_ENGINE_LOAD:
      return { ...state, load: action.value }
    case CAR_ENGINE_RPM:
      return { ...state, rpm: action.value }
    case CAR_ENGINE_STATUS:
      return { ...state, status: action.value }
    case CAR_SPEED:
      return { ...state, speed: action.value }
    case CAR_COOLANT:
      return { ...state, coolant: action.value }
    case CAR_MAF:
      return { ...state, maf: action.value }
    case CAR_LISTEN:
      return { ...state, listen: action.value }
    case RACE_REF: 
      return { ...state, raceRef: action.value }
    default:
      return state
  }
}

export default mainReducer