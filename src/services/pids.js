import { changeCoolant, changeLoad, changeRpm } from "../store/actions";

const PIDS = [

    {
        //RPM
        pid: "010C",
        name: "rpm",
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
        pid: '0104',
        name: 'engineLoad',
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
        pid: '0105',
        name: 'coolant',
        parse: (raw, store) => {
            if (!raw.value) {
                store.dispatch(changeCoolant(0))
                return
            }

            let coolant = Math.round(parseInt(raw.value.split(' ')[2], 16))

            store.dispatch(changeCoolant(coolant))
        }
    }

];

export default PIDS;