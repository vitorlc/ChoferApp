import PIDS from './pids.js'
// let receivedData = ""
const obd = {
    parse(raw) {
        let lines = this.rawLines(raw);

        if(!lines) return;
    
        if(lines.value == 'STOPPED' || lines.value == 'NO DATA' || lines.value == 'SEARCHING...') lines.value = false;
    
        for(let pid of PIDS) {
            if(pid.pid == lines.key)  return pid.parse(lines);
        };
    },
    rawLines(raw) {
        let split = raw.split(/\r\n|\r|\n/g);

        if(split.length == 1) return false;

        try{
            return {
                key: split[0].trim(),
                value: split[1].trim()
            }
        }
        catch(e){
            return false;
        }
    }
}

export default obd