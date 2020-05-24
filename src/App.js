import React, { useState, useEffect } from 'react';
import { StyleSheet, ToastAndroid, View, SafeAreaView, Text, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Button, Header } from 'react-native-elements'

import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic';

import Padrao from './styles/default'

import PIDS from './services/odbinfo';
import bluetooth from './services/bluetooth';
import obd from './services/obd';


const Device = ({ device, onPress, style}) => {
  let bgColor = device.connected
          ? '#0f0'
          : '#ccc';
  return (
    <TouchableOpacity
      key={device.id}
      style={[styles.button, style]}
      onPress={onPress}>
      <View
        style={[styles.connectionStatus, {backgroundColor: bgColor}]}
      />
      <View style={{flex: 1}}>
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
  const [readValue, setReadValue] = useState([]);

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
      console.log('Checando por resposta...');
      available = bluetooth.avaible()
      console.log(`${available} bytes de data disponivel`);

      if (available > 0) {
        console.log('Lendo do dispositivo...');
        let data = await bluetooth.read()

        console.log(data);
        obd.handleData(data)
      }
    } while (available > 0);
  };

  function writeValue(type) {
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
      bluetooth.write('ATSP0');

    } else {
      this.onRead = RNBluetoothClassic.addListener(
        BTEvents.READ,
        this.handleRead,
        this,
      )

      setInterval(()=> bluetooth.write('010C'), 200) //RPM
      
      this.poll = setInterval(() => this.pollForData(), 1500);
    }
  }

  async function listDevices() {
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
    console.log("selectDevice -> device", device)
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
        rightComponent={<Icon name='bluetooth' color='#fff' onPress={() => listDevices()} />}
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
