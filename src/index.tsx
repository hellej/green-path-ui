import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Root from './Root'
import store from './store'
import SelectLocationsPopup from './components/Map/SelectLocationsPopup'
import './index.css'

const render = () => {
  ReactDOM.render(<Root store={store} />, document.getElementById('root'))
  // render popup in a separate div created by mapbox
  const popupElement = document.getElementById('popup')
  if (popupElement) {
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <SelectLocationsPopup />
        </div>
      </Provider>,
      popupElement,
    )
  }
}

render()
store.subscribe(render)
