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
  async getRaces() {
    let racesList = []
    let snapshot = await firestore().collection('races')
      .orderBy('race_start', 'desc')
      .limit(6)
      .get()
    snapshot.forEach( doc => racesList.push( doc.data()))
    return racesList
  },
  async getRace(uid) {
    let query = await firestore().collection('races')
      .doc(uid)
      .get()
      .then((doc) => doc.data())
    return query
  }    
}

export default db