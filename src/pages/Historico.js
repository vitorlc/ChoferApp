import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  Icon,
  Button,
  Header,
  Text,
  CheckBox
} from 'react-native-elements'
import Padrao from '../styles/default'

const Historico = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        placement="left"
        centerComponent={{ text: 'Chofer App', style: { color: Padrao.color_1.color, fontWeight: 'bold', fontSize: 30 } }}
        leftComponent={
          <Icon name='menu' color='#fff' onPress={()=> navigation.openDrawer()}/>
        }
        containerStyle={{
          height: 60,
          backgroundColor: '#78bc6d',
          paddingTop: 1
        }}
      />
    </SafeAreaView>
  )
}

export default Historico;