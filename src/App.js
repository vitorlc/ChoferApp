import 'react-native-gesture-handler'
import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'  

import rootReducer from './store'
import Main from './pages/Main'
import Sobre from './pages/Sobre'
import Historico from './pages/Historico'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(120, 188, 109)',
  },
};

const store = createStore(rootReducer)
const Drawer = createDrawerNavigator();

const App = () => (
  <Provider store={store}>
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator>
        <Drawer.Screen options={{headerShown: false}} name="Home" component={Main} />
        <Drawer.Screen options={{headerShown: false}} name="Histórico" component={Historico} />
        <Drawer.Screen options={{headerShown: false}} name="Sobre" component={Sobre} />
      </Drawer.Navigator>
    </NavigationContainer>
  </Provider>
)

export default App;
