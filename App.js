import React, {useState, useEffect} from 'react';
import { Buffer } from 'buffer'
import {
  StyleSheet,
  ToastAndroid,
  View,
  Text,
  FlatList
} from 'react-native';

import { Button, Header} from 'react-native-elements'

import RNBluetoothClassic, {
  BTEvents,
  BTCharsets,
} from 'react-native-bluetooth-classic';

const Device = ({title, disabled, onPress}) => {
  return (
    <View style={styles.item}>
      <Button disabled={disabled} title={title} onPress={onPress} />
    </View>
  )
}


const App = () => {
  const [deviceList, setDeviceList] = useState([])
  const [device, setDevice] = useState({})
  const [listEnable, setListEnable] = useState(true)
  const [readValue, setReadValue] = useState([]);

  useEffect(()=>{
   

    return (() => {
      this.onRead.remove();
      clearInterval(this.poll);
      RNBluetoothClassic.disconnect();
    })


  },[])

  pollForData = async () => {
    var available = 0;
    if (device){
      write()
    }
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

  handleRead = data => {
    data = data.toString()
    if (data.endsWith(']')) {
      data = data.replace(']','')
      setReadValue(data);
    }
  };

  async function write () {
    
    let buffer = new Buffer('{RW}')
    await RNBluetoothClassic.write(buffer)
  }

  function startRead () {
    this.onRead = RNBluetoothClassic.addListener(
      BTEvents.READ,
      this.handleRead,
      this,
    )
    this.poll = setInterval(() => this.pollForData(), 500);
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

  async function selectDevice(deviceId){
    console.log("selectDevice -> deviceId", deviceId)
    try {
      let connectedDevice = await RNBluetoothClassic.connect(deviceId);
      console.log("connectedDevice ->", connectedDevice)
      ToastAndroid.show(`Conectado ao ${connectedDevice.name} com sucesso!`, 3000)
      setListEnable(false)
      setDevice(connectedDevice);
    } catch (error) {
      ToastAndroid.show(`Erro ao tentar se conectar!`, 3000)
      console.log(error.message);
    }
  }
  
  return (
    <View style={styles.body}>
      <Header
        centerComponent={{ text: 'Chofer App', style: { color: '#fff', fontWeight: 'bold' , fontSize:20} }}
        containerStyle={{
          backgroundColor: '#78bc6d',
          justifyContent: 'space-around',
        }}
      />
      <View style={styles.container}>
        {listEnable ? (
          <View>
            <Button
              onPress={initialize}
              title="Listar Dispositivos"
            >
            </Button>
            <FlatList
              data={deviceList}
              renderItem={({ item }) => 
              <Device 
                title={item.name} 
                onPress={() =>  selectDevice(item.id)}
              />}
              keyExtractor={item => item.id}
              
              />
          </View>
        ) : null}
        {device ? (
          <View>
            <Button
              onPress={startRead}
              title="Começar Leitura"
            ></Button>
            <Text style={styles.peso}>{readValue}</Text>
          </View>
        ): null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#FFF",
  },
  container: {
    justifyContent:'center',
    alignItems:'center'
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
