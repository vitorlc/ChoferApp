import { changeCoolant, changeLoad, changeRpm, changeSpeed } from "../store/actions";

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

            store.dispatch(changeRpm(rpm))
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

            store.dispatch(changeSpeed(speed))
        }
    }

];

export default PIDS;