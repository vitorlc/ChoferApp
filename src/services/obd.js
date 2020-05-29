import PIDS from './odbinfo.js'
let receivedData = ""
const obd = {
    handleData(data) {

        var currentString, arrayOfCommands;
        currentString = receivedData + data.toString('utf8'); // making sure it's a utf8 string

        arrayOfCommands = currentString.split('>');

        var forString;
        if (arrayOfCommands.length < 2) {
            receivedData = arrayOfCommands[0];
        } else {
            for (var commandNumber = 0; commandNumber < arrayOfCommands.length; commandNumber++) {
                forString = arrayOfCommands[commandNumber];
                if (forString === '') {
                    continue;
                }

                var multipleMessages = forString.split('\r');
                for (var messageNumber = 0; messageNumber < multipleMessages.length; messageNumber++) {
                    var messageString = multipleMessages[messageNumber];
                    if (messageString === '') {
                        continue;
                    }
                    var reply;
                    reply = this.parseOBDCommand(messageString);
                    console.log(">>", reply )
                    receivedData = '';
                }
            }
        }
    },
    parseOBDCommand(hexString) {
        var reply,
            byteNumber,
            valueArray; //New object
    
        reply = {};
        if (hexString === "NO DATA" || hexString === "OK" || hexString === "?" || hexString === "UNABLE TO CONNECT" || hexString === "SEARCHING...") {
            //No data or OK is the response, return directly.
            reply.value = hexString;
            return reply;
        }
    
        hexString = hexString.replace(/ /g, ''); //Whitespace trimming //Probably not needed anymore?
        valueArray = [];
    
        for (byteNumber = 0; byteNumber < hexString.length; byteNumber += 2) {
            valueArray.push(hexString.substr(byteNumber, 2));
        }
    
        if (valueArray[0] === "41") {
            reply.mode = valueArray[0];
            reply.pid = valueArray[1];
            for (var i = 0; i < PIDS.length; i++) {
                if (PIDS[i].pid == reply.pid) {
                    var numberOfBytes = PIDS[i].bytes;
                    reply.name = PIDS[i].name;
                    switch (numberOfBytes) {
                        case 1:
                            reply.value = PIDS[i].convertToUseful(valueArray[2]);
                            break;
                        case 2:
                            reply.value = PIDS[i].convertToUseful(valueArray[2], valueArray[3]);
                            break;
                        case 4:
                            reply.value = PIDS[i].convertToUseful(valueArray[2], valueArray[3], valueArray[4], valueArray[5]);
                            break;
                        case 8:
                            reply.value = PIDS[i].convertToUseful(valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6], valueArray[7], valueArray[8], valueArray[9]);
                            break;
                    }
                    break; //Value is converted, break out the for loop.
                }
            }
        } else if (valueArray[0] === "43") {
            reply.mode = valueArray[0];
            for (var i = 0; i < PIDS.length; i++) {
                if (PIDS[i].mode == "03") {
                    reply.name = PIDS[i].name;
                    reply.value = PIDS[i].convertToUseful(valueArray[1], valueArray[2], valueArray[3], valueArray[4], valueArray[5], valueArray[6]);
                }
            }
        }
        return reply;
    }
}

export default obd