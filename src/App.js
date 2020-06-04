import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ToastAndroid,
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Icon,
  Button,
  Header,
} from 'react-native-elements'

import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic';

import Padrao from './styles/default'

import PIDS from './services/pids';
import bluetooth from './services/bluetooth';
import obd from './services/obd';


const Device = ({ device, onPress, style }) => {
  let bgColor = device.connected
    ? '#0f0'
    : '#ccc';
  return (
    <TouchableOpacity
      key={device.id}
      style={[styles.button, style]}
      onPress={onPress}>
      <View
        style={[styles.connectionStatus, { backgroundColor: bgColor }]}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text>{device.address}</Text>
      </View>
    </TouchableOpacity>
  )
}

const App = () => {
  const [deviceList, setDeviceList] = useState([])
  const [device, setDevice] = useState(null)
  const [listEnable, setListEnable] = useState(false)
  const [readValue, setReadValue] = useState([{name: '', vale: ''}]);


  let lastIndex = 0;
  let total = PIDS.length - 1;
  let subs = []

  useEffect(() => {
    return (() => {
      this.onRead.remove();
      clearInterval(this.poll);
      RNBluetoothClassic.disconnect();
    })
  }, [])

  pollForData = async () => {
    let available = 0;
    do {
      available = await bluetooth.avaible()

      if (available > 0) {
        let data = await bluetooth.read()

        let reply = obd.parse(data)
        console.log("\n=== DATA ===")
        console.log(reply);
        setReadValue([{...reply}])
      }
    } while (available > 0);
  };

  function writeValue(type) {
    this.onRead = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this,
    )
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
    } else {


      setInterval(() => {

        bluetooth.write(PIDS[lastIndex].pid)

        if (lastIndex == total) {
          lastIndex = 0;
        } else {
          lastIndex = lastIndex + 1;
        }
      }, 1000)

      // setInterval( ()=> bluetooth.write('010C'), 1500)

      this.poll = setInterval(() => this.pollForData(), 500);
    }
  }

  async function listUnpairedDevices() {
    console.log("\n=== LISTANDO DISPOSITIVOS NÃO PAREADOS===")
    try {
      let deviceList = await bluetooth.listUnpairedDevices()
      if(deviceList){
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
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.body}>
      <Header
        placement="left"
        centerComponent={{ text: 'Chofer App', style: { color: Padrao.color_1.color, fontWeight: 'bold', fontSize: 30 } }}
        rightComponent={
          <View>
            <Icon name='rowing' color='#fff' onPress={() => listUnpairedDevices()} />
            <Icon name='bluetooth' color='#fff' onPress={() => listDevices()} />
          </View>
        }
        containerStyle={{
          height: 70,
          backgroundColor: '#78bc6d',
          justifyContent: 'space-around',
        }}
      />
      <View style={styles.container}>
        {listEnable ? (
          <View>
            <FlatList
              data={deviceList}
              renderItem={({ item }) =>
                <Device
                  device={item}
                  onPress={() => selectDevice(item)}
                />}
              keyExtractor={item => item.id}

            />
          </View>
        ) : null}
        {device ? (
          <View>
            <Button
              onPress={() => writeValue(null)}
              title="COMEÇAR LEITURA"
            ></Button>

            {
              readValue.map((value, index)=> {
              console.log("value", value)
                return (
                  <Text key={index}>{value.name} : {value.value} </Text>
                )
              })
            }
          </View>

        ) : null}
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
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 10
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  deviceName: {
    fontSize: 16,
  },
  connectionStatus: {
    width: 8,
    backgroundColor: '#ccc',
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
  }
});

export default App;
