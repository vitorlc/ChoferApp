import { changeCoolant, changeLoad, changeRpm, changeSpeed, changeMAF } from "../store/actions";
import firestore from '@react-native-firebase/firestore'

const PIDS = [

    {
        //RPM
        pid: "010C",
        name: "rpm",
        unit: "rev/min",
        parse(raw, store) {
            if (!raw.value) {
                store.dispatch(changeRpm(0))
                return
            }

            let a = raw.value.split(' ')
            let rpm = ((parseInt(a[2], 16) * 256) + parseInt(a[3], 16)) / 4
            if (rpm != ' ' && rpm != undefined && rpm != NaN) {
                store.raceRef.update({
                    rpm_data: firestore.FieldValue.arrayUnion({
                        value: rpm,
                        date: firestore.Timestamp.fromDate(new Date())
                    })
                })
                store.dispatch(changeRpm(rpm))
            }
        }
    },
    {   
        //LOAD Value
        pid: '0104',
        name: 'engineLoad',
        unit: "%",
        parse: (raw, store) => {
            if (!raw.value) {
                store.dispatch(changeLoad(0))
                return
            }

            let load = Math.round(parseInt(raw.value.split(' ')[2], 16) * (100 / 255))

            store.dispatch(changeLoad(load))

        }
    },
    {
        //Engine Coolant Temperature 
        pid: '0105',
        name: 'temp',
        unit: "Celsius",
        parse: (raw, store) => {
            if (!raw.value) {
                store.dispatch(changeCoolant(0))
                return
            }

            let coolant = Math.round(parseInt(raw.value.split(' ')[2], 16))

            store.dispatch(changeCoolant(coolant))
        }
    },
    {
        //Speed Sensor
        pid: "010D",
        name: "speed",
        unit: "km/h",
        parse(raw, store) {
            if (!raw.value) {
                store.dispatch(changeSpeed(0))
                return
            }

            let speed = parseInt(raw.value.split(' ')[2], 16)
            if (speed != ' ' && speed != undefined && speed != NaN) {
                store.raceRef.update({
                    speed_data: firestore.FieldValue.arrayUnion({
                        value: speed,
                        date: firestore.Timestamp.fromDate(new Date())
                    })
                })
                store.dispatch(changeSpeed(speed))
            }
        }
    },
    {
        //MAF (Mass air flow)
        pid: "0110",
        name: "maf",
        unit: "g/s",
        parse(raw, store) {
            if (!raw.value) {
                store.dispatch(changeMAF(0))
                return
            }

            let rawValue = raw.value.split(' ')
            let maf = ((parseInt(rawValue[2], 16) * 256) + parseInt(rawValue[3], 16)) / 100
            if (maf != ' ' && maf != undefined && maf != NaN) {
                store.raceRef.update({
                    maf_data: firestore.FieldValue.arrayUnion({
                        value: maf, 
                        date: firestore.Timestamp.fromDate(new Date())
                    })
                })
                store.dispatch(changeMAF(maf))
            } 
        }
    }
];

export default PIDS;