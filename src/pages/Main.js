import React, { useState, useEffect, useMemo } from 'react'
import {
  StyleSheet,
  ToastAndroid,
  View,
  Modal,
  TouchableHighlight,
  SafeAreaView,
  FlatList,
} from 'react-native'
import {
  Icon,
  Button,
  Header,
  Text,
  CheckBox
} from 'react-native-elements'
import { useSelector, useDispatch } from "react-redux"
import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic'
import firestore from '@react-native-firebase/firestore'

import Padrao from '../styles/default'

import PIDS from '../services/pids'
import bluetooth from '../services/bluetooth'
import obd from '../services/obd'
import { changeListen, addRaceRef } from "../store/actions"
import db from "../services/db"

const ModalDevice = ({ visible, deviceList, selectDevice, changeModalVisible }) =>
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={() => {
      Alert.alert("Modal has been closed.");
    }}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selecione abaixo</Text>
        <FlatList
          data={deviceList}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Device
              device={item}
              onPress={() => selectDevice(item)}
            />}
        />

        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
          onPress={changeModalVisible}
        >
          <Text style={styles.textStyle}>Voltar</Text>
        </TouchableHighlight>
      </View>
    </View>
  </Modal>

const FuelConsumption = ({ MAF, speed, fuel }) => {
  const store = useSelector(state => state.mainReducer)

  const AFR = {
    'Gasolina': 14.7,
    'Etanol': 9,
    'Diesel': 14.6
  }
  const D = {
    'Gasolina': 737,
    'Etanol': 789,
    'Diesel': 850
  }
  const calculateConsume = (MAF, speed, fuel) => {
    let consumption = (MAF / (AFR[fuel] * D[fuel] * speed)) * 3600
    if (consumption) {
      store.raceRef.update({
        consume_data: firestore.FieldValue.arrayUnion({
          value: consumption,
          date: firestore.Timestamp.fromDate(new Date())
        })
      })
      return consumption
    }
  }
  return (
    <Text style={styles.text}>Consumo de Combustível: {calculateConsume(MAF, speed, fuel)}</Text>
  )
}

const Main = ({ navigation }) => {
  const store = useSelector(state => state.mainReducer)
  const dispatch = useDispatch()

  const [deviceList, setDeviceList] = useState([])
  const [device, setDevice] = useState(null)
  const [listEnable, setListEnable] = useState(false)
  const [fuel, setFuel] = useState('Etanol');


  let lastIndex = 0;
  let total = PIDS.length - 1;
  let pollWrite
  let pollRead

  useEffect(() => {
    return (() => {
      clearInterval(pollWrite)
      clearInterval(pollRead);
      RNBluetoothClassic.disconnect();
    })
  }, [])

  const consumeMemoized = useMemo(() => <FuelConsumption MAF={store.maf} V={store.speed} fuel={fuel} />, [store.maf, store.speed, fuel])

  pollForData = async () => {
    let available = 0;
    do {
      available = await bluetooth.avaible()

      if (available > 0) {
        let data = await bluetooth.read()
        obd.parse(data, { dispatch, ...store })
      }
    } while (available > 0);
  };

  async function writeValue(type) {
    if(!device) return ToastAndroid.show(`Conecte-se ao OBDII`, 3000)
    if (type == 'reset') {

      bluetooth.write('ATZ');
      //Turns off extra line feed and carriage return
      bluetooth.write('ATL0');
      //This disables spaces in in output, which is faster!
      bluetooth.write('ATS0');
      //Turns off headers and checksum to be sent.
      bluetooth.write('ATH0');
      //Turns off echo.
      bluetooth.write('ATE0');
      //Turn adaptive timing to 2. This is an aggressive learn curve for adjusting the timeout. Will make huge difference on slow systems.
      bluetooth.write('ATAT2');
      //Set timeout to 10 * 4 = 40msec, allows +20 queries per second. This is the maximum wait-time. ATAT will decide if it should wait shorter or not.
      //self.write('ATST0A');
      //http://www.obdtester.com/elm-usb-commands
      bluetooth.write('ATSP0'); // AUTOMATIC PROTOCOL DETECTION
      const raceRef = await db.addRace({ fuel: fuel })
      dispatch(addRaceRef(raceRef))
    } else {

      pollWrite = setInterval(() => {
        bluetooth.write(PIDS[lastIndex].pid)
        if (lastIndex == total) {
          lastIndex = 0;
        } else {
          lastIndex = lastIndex + 1;
        }
      }, 1000)

      pollRead = setInterval(() => this.pollForData(), 1000);

      dispatch(changeListen(true))
    }
  }

  async function listUnpairedDevices() {
    console.log("\n=== LISTANDO DISPOSITIVOS NÃO PAREADOS===")
    try {
      let deviceList = await bluetooth.listUnpairedDevices()
      if (deviceList) {
        writeValue('reset')
        setDevice(true)
        setListEnable(false)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async function listDevices() {
    console.log("\n=== LISTANDO DISPOSITIVOS ===")
    try {
      let deviceList = await bluetooth.listDevices()
      console.log("listDevices -> deviceList", deviceList)
      setListEnable(true)
      setDeviceList(deviceList)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function selectDevice(device) {
    console.log("\n=== SELECIONANDO DISPOSITIVO ===")
    console.log(device)
    try {
      let connectedDevice = await bluetooth.connectDevice(device.id);
      ToastAndroid.show(`Conectado ao ${connectedDevice.name} com sucesso!`, 3000)
      setListEnable(false)

      writeValue('reset')
      setDevice(connectedDevice);
    } catch (error) {
      ToastAndroid.show(`Erro ao tentar se conrectar!`, 3000)
    }
  }

  const stop = async () => {
    clearInterval(pollRead)
    clearInterval(pollWrite)
    dispatch(changeListen(false))
    db.stopRace(store)
    dispatch(addRaceRef(null))
  }

  const changeFuel = async (fuelName) => {
    setFuel(fuelName)
    if(store.raceRef)
      await store.raceRef.update({
        fuel: fuelName
      })
  }

  return (
    <SafeAreaView style={styles.body}>
      <Header
        placement="left"
        centerComponent={{ text: 'Chofer App', style: { color: Padrao.color_1.color, fontWeight: 'bold', fontSize: 30 } }}
        leftComponent={
          <Icon name='menu' color='#fff' onPress={()=> navigation.openDrawer()}/>
        }
        rightComponent={
          <Icon name='bluetooth' color='#fff' onPress={() => listDevices()} />
        }
        containerStyle={{
          backgroundColor: '#78bc6d',
        }}
      />
      <View style={styles.container}>
        <ModalDevice visible={listEnable} changeModalVisible={() => setListEnable(false)} deviceList={deviceList} selectDevice={selectDevice} />
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>Combustível: </Text>
          <View style={styles.checkbox}>
            <CheckBox
              title='Gasolina'
              checked={fuel == 'Gasolina'}
              onPress={() => changeFuel('Gasolina')}
            />
            <CheckBox
              title='Etanol'
              checked={fuel == 'Etanol'}
              onPress={() => changeFuel('Etanol')}
            />
            <CheckBox
              title='Diesel'
              checked={fuel == 'Diesel'}
              onPress={() => changeFuel('Diesel')}
            />
          </View>
          <View>
            <Text style={styles.text}>RPM: {store.rpm} rev/min</Text>
            <Text style={styles.text}>Load: {store.load} %</Text>
            <Text style={styles.text}>Coolant: {store.coolant} C</Text>
            <Text style={styles.text}>Speed: {store.speed} km/h</Text>
            <Text style={styles.text}>MAF: {store.maf} g/s</Text>
            {consumeMemoized}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        {
          store.listen ? (
            <Button
              containerStyle={styles.btnContainer}
              buttonStyle={styles.btnCancelar}
              title="PARAR CORRIDA"
              onPress={stop}
            ></Button>
          ) : (
            <Button
              containerStyle={styles.btnContainer}
              buttonStyle={styles.btnSalvar}
              title="INICIAR CORRIDA"
              onPress={writeValue}
            ></Button>
          )
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  footer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  checkbox: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 55
  },
  btnContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  btnCancelar: {
    height: 60,
    backgroundColor: 'rgba(224, 71, 66, 1)',
  },
  btnSalvar: {
    height: 60,
    backgroundColor: '#78BC6D'
  },
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
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default Main;
