const convertRPM = (byteA, byteB) => {
    return ((parseInt(byteA, 16) * 256) + parseInt(byteB, 16)) / 4;
}

const PIDS = [
    
    {mode: "01", pid: "0C", bytes: 2, name: "rpm", description: "Engine RPM", min: 0, max: 16383.75, unit: "rev/min", convertToUseful: convertRPM},
   
];

export default PIDS;