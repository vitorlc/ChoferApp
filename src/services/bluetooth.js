import RNBluetoothClassic, {
    BTEvents,
    BTCharsets,
} from 'react-native-bluetooth-classic';

var self = this;
var connected = false;
var receivedData = "";
var protocol = '0';

const bluetooth = {

    async listDevices() {
        try {
            // await RNBluetoothClassic.setEncoding(); // TESTAR MUDANÇA
            // BTCharsets: {
            //     LATIN,
            //     ASCII,
            //     UTF8,
            //     UTF16
            //   }
            const deviceList = await RNBluetoothClassic.list();
            return deviceList
        } catch (err) {
            console.log(err.message)
        }
    },

    async connectDevice(deviceId) {
        const result = await RNBluetoothClassic.connect(deviceId)
        return result
    },

    async write(message) {
        await RNBluetoothClassic.write(message+ '\r')
    },

    async read() {
        const data = await RNBluetoothClassic.readFromDevice();
        return data
    },

    async avaible() {
        const avaible = await RNBluetoothClassic.available();
        return avaible
    },

    async disconnectDevice() {
        this.onRead.remove();
        RNBluetoothClassic.disconnect();
    }


}
export default bluetooth