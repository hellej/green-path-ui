import { Action } from 'redux'
import { PathListReducer } from '../types'

const initialPathList: PathListReducer = {
  scrollToPath: '',
  routingId: 0,
}

interface PathListAction extends Action {
  pathId: string
}

const pathListReducer = (
  store: PathListReducer = initialPathList,
  action: PathListAction,
): PathListReducer => {
  switch (action.type) {
    case 'SCROLL_TO_PATH':
      return { ...store, scrollToPath: action.pathId }

    default:
      return store
  }
}

export const scrollToPath = (pathId: string) => {
  return { type: 'SCROLL_TO_PATH', pathId }
}

export default pathListReducer
