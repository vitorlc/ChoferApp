import React, { useEffect, useState} from 'react';
import { View, SafeAreaView } from 'react-native';
import {
  Icon,
  Header,
  ListItem,
  Text
} from 'react-native-elements'
import Padrao from '../styles/default'
import db from '../services/db'
import moment from 'moment'

const Historico = ({navigation}) => {
  const [historico, setHistorico] = useState([])
    
  useEffect(async () => {
    ;(async () => {
      let historicoFetch = await (await db.getSensors()).map(race => ({
        fuel: race.fuel,
        race_start: moment(race.race_start.toDate()).format("DD/MM/YYYY HH:mm:ss"),
        race_end: moment(race.race_end.toDate()).format("DD/MM/YYYY HH:mm:ss")
      }))
      setHistorico(historicoFetch)
    })()
  }, [])
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        placement="left"
        centerComponent={{ text: 'Chofer App', style: { color: Padrao.color_1.color, fontWeight: 'bold', fontSize: 30 } }}
        leftComponent={
          <Icon name='menu' color='#fff' onPress={()=> navigation.openDrawer()}/>
        }
        containerStyle={{
          backgroundColor: '#78bc6d',
        }}
      />
      <View>
      {
        historico.length > 0 ? 
          historico.map((l, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}>#{i+1} Corrida</ListItem.Title>
                <ListItem.Subtitle style={{ color: 'black' }}>Início: {l.race_start} </ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: 'black' }}>Fim: {l.race_end}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron color="black" />
            </ListItem>     
          ))
        :
        <Text h4 style={{textAlign: 'center', alignItems: 'center'}}> Sem Corridas </Text>
      }
      </View>
    </SafeAreaView>
  )
}

export default Historico;