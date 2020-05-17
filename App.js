import React, {useState, useEffect, Component} from 'react';
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
  const [listDisabled, setListDisabled] = useState(false)
  
  async function initialize() {
    try {
      let deviceList = await RNBluetoothClassic.list();
      console.log("deviceList ->", deviceList)
      setDeviceList(deviceList)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function selectDevice(){
    try {
      let connectedDevice = await RNBluetoothClassic.connect(deviceId);
      console.log("connectedDevice ->", connectedDevice)
      setDevice({connectedDevice});
    } catch (error) {
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

        <Button
          onPress={initialize}
          title="Listar Dispositivos"
        >
        </Button>
        <FlatList
          data={deviceList}
          renderItem={({ item }) => <Device title={item.name} />}
          keyExtractor={item => item.id}
          onPress={() => selectDevice(item)}
          />
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
  item: {
    paddingTop: 5
  }
});

export default App;
