import React, { useState, useEffect } from 'react';
import { StyleSheet, ToastAndroid, View, SafeAreaView, Text, FlatList } from 'react-native';
import { Icon, Button, Header } from 'react-native-elements'

import RNBluetoothClassic, { BTEvents, BTCharsets } from 'react-native-bluetooth-classic';
import { Buffer } from 'buffer'

import PIDS from './src/services/odbinfo';

const Device = ({ title, disabled, onPress }) => {
  return (
    <View style={styles.item}>
      <Button disabled={disabled} title={title} onPress={onPress} />
    </View>
  )
}

const MyIconComponent = ({ iconName, onPress }) => {
  console.log("MyIconComponent -> onPress", onPress)
  return (
    <View>
      <Icon
        name={iconName}
        color='#fff'
        onPress={onPress}
      />
    </View>
  )
}

const App = () => {
  const [deviceList, setDeviceList] = useState([])
  const [device, setDevice] = useState(null)
  const [listEnable, setListEnable] = useState(false)
  const [readValue, setReadValue] = useState([]);

  const reset = true
  var queue = [];

  useEffect(() => {


    return (() => {
      this.onRead.remove();
      clearInterval(this.poll);
      RNBluetoothClassic.disconnect();
    })


  }, [])

  pollForData = async () => {
    var available = 0;
    do {
      console.log('Checking for available data');
      available = await RNBluetoothClassic.available();
      console.log(`There are ${available} bytes of data available`);

      if (available > 0) {
        console.log('Attempting to read the next message from the device');
        const data = await RNBluetoothClassic.readFromDevice();

        console.log(data);
        this.handleRead(data);
      }
    } while (available > 0);
  };

  function writeValue(type) {
    if (type == 'reset') {
      write('ATZ');
      //Turns off extra line feed and carriage return
      write('ATL0');
      //This disables spaces in in output, which is faster!
      write('ATS0');
      //Turns off headers and checksum to be sent.
      write('ATH0');
      //Turns off echo.
      write('ATE0');
      //Turn adaptive timing to 2. This is an aggressive learn curve for adjusting the timeout. Will make huge difference on slow systems.
      write('ATAT2');
      //Set timeout to 10 * 4 = 40msec, allows +20 queries per second. This is the maximum wait-time. ATAT will decide if it should wait shorter or not.
      //self.write('ATST0A');
      //http://www.obdtester.com/elm-usb-commands
      write('ATSP0');

    } else {
      this.onRead = RNBluetoothClassic.addListener(
        BTEvents.READ,
        this.handleRead,
        this,
      )

      setInterval(()=> write('010C'), 150)
       //RPM

      this.poll = setInterval(() => this.pollForData(), 1500);
    }
  }

  async function initialize() {
    try {
      let deviceList = await RNBluetoothClassic.list();
      console.log("deviceList ->", deviceList)
      setListEnable(true)
      setDeviceList(deviceList)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function selectDevice(device) {
    try {
      let connectedDevice = await RNBluetoothClassic.connect(device.id);
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
        leftComponent={<MyIconComponent iconName='menu' />}
        centerComponent={{ text: 'Chofer App', style: { color: '#fff', fontWeight: 'bold', fontSize: 30 } }}
        rightComponent={<MyIconComponent iconName='bluetooth' onPress={() => initialize()} />}
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
                  title={item.name}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 40
  },
  warning: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#808080",
  },
  text: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 20
  },
  peso: {
    fontWeight: 'bold',
    fontSize: 40
  },
  item: {
    paddingTop: 5
  }
});

export default App;
