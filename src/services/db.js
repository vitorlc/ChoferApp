import firestore from '@react-native-firebase/firestore'

const db = {
  async addRace(data) {
    let raceRef = await firestore().collection('races')
      .add({
        fuel: data.fuel,
        race_start: firestore.FieldValue.serverTimestamp(),
        speed_data: [],
        maf_data: [],
        rpm_data: [],
        consume_data: [],
        note: data.note
      }).catch( error => console.log(error) )
    return raceRef
  },
  async stopRace(store) {
    if(!!store.raceRef) {
      await store.raceRef.update({
        race_end: firestore.FieldValue.serverTimestamp() 
      }).catch( error => console.log(error) )
    }
  },
  async getSensors() {
    let sensorList = []
    let snapshot = await firestore().collection('races')
      .orderBy('race_start')
      .get()
    snapshot.forEach( doc => sensorList.push(doc.data()) )
    return sensorList
  }  
}

export default db