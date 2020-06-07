import PIDS from './pids.js'

const obd = {
    parse(raw, store) {
        let lines = this.rawLines(raw);

        if(!lines) return;
    
        if(lines.value == 'STOPPED' || lines.value == 'NO DATA' || lines.value == 'SEARCHING...') lines.value = false;
    
        for(let pid of PIDS) {
            if(pid.pid == lines.key) pid.parse(lines, store)
        }
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