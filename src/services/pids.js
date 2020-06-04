const PIDS = [
    
    {
        //RPM
        pid: "010C", 
        name: "rpm", 
        parse(raw) {
            if(!raw.value) {
                return {name: "rpm", value: 'No Value'};
            }
            let a = raw.value.split(' ');
            let rpm = ((parseInt(a[2], 16) * 256) + parseInt(a[3], 16)) / 4;
            return {name: "rpm", value: rpm}
        }
    },
    {
        pid: '0104',
        name: 'engineLoad',
        parse: (raw) => {
            if(!raw.value) {
                return {name: "engineLoad", value: 'No Value'};
            }

            let load = Math.round(parseInt(raw.value.split(' ')[2], 16) * (100 / 255));
            return {name: "engineLoad", value: load}

        }
    },
    {
        pid: '0105',
        name: 'coolant',
        parse: (raw) => {
            if(!raw.value) {
                return {name: "coolant", value: 'No Value'};
            }
            let coolant = Math.round(parseInt(raw.value.split(' ')[2], 16))
            console.log(coolant)
            return {name: "coolant", value: coolant}
        }
    }
   
];

export default PIDS;