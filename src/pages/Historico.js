import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import {
  Icon,
  Header,
  ListItem,
  Text
} from 'react-native-elements'
import Padrao from '../styles/default'
import db from '../services/db'
import moment from 'moment'

const ModalRace = ({visible, changeModalVisible, data}) =>  {
  const velocidadeMedia = (speed_data) => {
    if (speed_data) {
      let media = speed_data.reduce((acc, cur) => { return ( acc + cur.value ) }, 0) / speed_data.length
      return media.toFixed(2)
    }
  }

  const consumoMedio = (consume_data) => {
    if (consume_data) {
      let media = consume_data.reduce((acc, cur) => { return ( acc + parseFloat(cur.value) ) }, 0) / consume_data.length
      return media.toFixed(2)
    }
  }
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.modalView}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Informações da Corrida:</Text>
        <Text style={{ fontSize: 18, paddingTop: 5 }}>Início: {data.race_start} </Text>
        <Text style={{ fontSize: 18, paddingTop: 5 }}>Fim: {data.race_end} </Text>
        <Text style={{ fontSize: 18, paddingTop: 5 }}>Velocidade Média: {velocidadeMedia(data.speed_data)} km/h</Text>
        <Text style={{ fontSize: 18, paddingTop: 5 }}>Consumo Instantâneo Médio: {consumoMedio(data.consume_data)} L/Km</Text>
        <Text style={{ fontSize: 18, paddingTop: 5 }}>Nota: {data.note} </Text>
        

        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
          onPress={changeModalVisible}
          >
          <Text style={styles.textStyle}>Voltar</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  ) 
}

const Historico = ({navigation}) => {
  const [historico, setHistorico] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedRace, setSelectedRace] = useState({})

  const fetchHistorico =  useCallback(async () => {
    let historicoFetch = await (await db.getRaces()).map(race => {
      return { 
        ...race,
        fuel: race.fuel,
        race_start: moment(race.race_start.toDate()).format("DD/MM/YYYY HH:mm:ss"),
        race_end: race.race_end ? moment(race.race_end.toDate()).format("DD/MM/YYYY HH:mm:ss") : '-',
      }
    })
    setHistorico(historicoFetch)
  }, [])


  const fetchRace = async (race) => {
    setSelectedRace(race)
    setShowModal(true)
  }

  useEffect(() => { 
    fetchHistorico()
  }, [fetchHistorico])
  
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
      <ScrollView>
        <View>
        <ModalRace visible={showModal} data={selectedRace} changeModalVisible={()=>setShowModal(false)} />
        {
          historico.length > 0 ? 
          historico.map((l, i) => (
            <ListItem key={i} bottomDivider onPress={() => fetchRace(l)}>
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
      </ScrollView>
      <Text style={{alignSelf: 'flex-end'}}>
        * 6 últimas corridas
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
})

export default Historico;