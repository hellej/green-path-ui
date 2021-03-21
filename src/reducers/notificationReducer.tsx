import { Action } from 'redux'

const initialNotification: NotificationReducer = {
  text: null,
  look: null,
}
let rmNotifTimeout: any

interface NotificationAction extends Action {
  text: string
  look: string
}

const notificationReducer = (
  store: NotificationReducer = initialNotification,
  action: NotificationAction,
): NotificationReducer => {
  switch (action.type) {
    case 'SHOWNOTIF':
      return { text: action.text, look: action.look }

    // hide tooltip on how to set the destination when popup is opened
    case 'SET_POPUP': {
      if (store.text != null && store.text.includes('Click on the map')) {
        rmNotification()
        return initialNotification
      }
      return store
    }
    case 'SET_SHORTEST_PATH':
    case 'RMNOTIF':
      return initialNotification

    default:
      return store
  }
}

export const showNotification = (text: string, look: string, notifTime: number) => {
  return async (dispatch: any) => {
    if (rmNotifTimeout) {
      // wait for the current notification to get removed before showing the new one
      rmNotification()
      await new Promise(resolve => {
        rmNotifTimeout = setTimeout(() => {
          dispatch(rmNotification())
          resolve()
        }, 1500)
      })
    }

    // show new notification after removing the old one
    dispatch({ type: 'SHOWNOTIF', text, look })

    await new Promise(resolve => {
      rmNotifTimeout = setTimeout(() => {
        dispatch(rmNotification())
        resolve()
      }, notifTime * 1000)
    })
  }
}

const rmNotification = () => {
  clearTimeout(rmNotifTimeout)
  rmNotifTimeout = null
  return { type: 'RMNOTIF' }
}

export default notificationReducer
