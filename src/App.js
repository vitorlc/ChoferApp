import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers'
import Main from './pages/Main'

const store = createStore(rootReducer)

const App = () => (
  <Provider store={store}>
    <Main></Main>
  </Provider>
)

export default App;
