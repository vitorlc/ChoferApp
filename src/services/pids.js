const PIDS = [
    
    {
        //RPM
        pid: "010C", 
        name: "rpm", 
        parse(raw) {
            if(!raw.value) {
                return;
            }
            let a = raw.value.split(' ');
            let rpm = ((parseInt(a[2], 16) * 256) + parseInt(a[3], 16)) / 4;
            return {name: this.name, value: rpm}
        }
    },
    {
        pid: '0104',
        name: 'engineLoad',
        parse: (raw) => {

            if(!raw.value) {
                return;
            }

            let load = Math.round(parseInt(raw.value.split(' ')[2], 16) * (100 / 255));
            return {name: this.name, value: load}

        }
    },
    {
        pid: '0105',
        name: 'coolant',
        parse: (raw) => {
            if(!raw.value) {
                return;
            }
            let coolant = Math.round(parseInt(raw.value.split(' ')[2], 16))
            return {name: this.name, value: coolant}
        }
    }
   
];

export default PIDS;