const firestoreService = require('firestore-export-import');
const fs = require('fs')
const moment = require('moment')
const Excel = require('exceljs')

var serviceAccount = require("./chofer-app-f5510-firebase-adminsdk-skx0a-f9dac2d8d4.json")
const appName = '[DEFAULT]'
const myArgs = process.argv.slice(2);
;(async () => {
  firestoreService.initializeApp(serviceAccount, 'chofer-app-f5510', appName);
  
  let arrayData = []
  let raceObject = {}
  const fuelInformation = [
    {
      fuel: 'Etanol',
      afr: 9,
      d: 789
    },
    {
      fuel: 'Gasolina',
      afr: 14.7,
      d: 737
    },
    {
      fuel: 'Diesel',
      afr: 14.6,
      d: 850
    }
  ]

  let collections = await firestoreService
  .backup('races')

  fs.writeFileSync('DB_DATA.json', JSON.stringify(collections))
  raceObject = collections 
  // console.log("raceObject", raceObject)

  const workbook = new Excel.Workbook();
  let worksheet1 = workbook.addWorksheet("Speed")
  let worksheet2 = workbook.addWorksheet("Rpm")
  let worksheet3 = workbook.addWorksheet("MAF")
  let worksheet4 = workbook.addWorksheet("Consumption")
  let worksheet5 = workbook.addWorksheet("Consumption Calculated")
  let worksheet6 = workbook.addWorksheet("Fuel Information")

  worksheet1.columns = [
    {header: 'Date', key: 'date', width: 10},
    {header: 'Value', key: 'value', width: 10},
  ]
  worksheet2.columns = [
    {header: 'Date', key: 'date', width: 10},
    {header: 'Value', key: 'value', width: 10},
  ]
  worksheet3.columns = [
    {header: 'Date', key: 'date', width: 10},
    {header: 'Value', key: 'value', width: 10},
  ]
  worksheet4.columns = [
    {header: 'Date', key: 'date', width: 10},
    {header: 'Value', key: 'value', width: 10},
  ]
  worksheet5.columns = [
    {header: 'Date', key: 'date', width: 15},
    {header: 'Speed', key: 'speed_value', width: 10},
    {header: 'RPM', key: 'rpm_value', width: 10},
    {header: 'MAF', key: 'maf_value', width: 10},
    {header: 'Consume', key: 'consume_value', width: 10},
    {width: 20},
    {header: 'Consume Calculated', width: 20}
  ]
  worksheet6.columns = [
    {header: 'Fuel', key: 'fuel', width: 15},
    {header: 'AFR', key: 'afr', width: 10},
    {header: 'D', key: 'd', width: 10},
  ]

  let raceFiltered = Object.values(raceObject.races)
    .filter(race => moment(race.race_start.toDate()).format("DD/MM/YYYY") == moment(myArgs, 'DD/MM/YYYY').format("DD/MM/YYYY"))
    .sort((a,b) => new Date(b.race_start.toDate()) -  new Date(a.race_start.toDate()))[0]
  
  raceFiltered.speed_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("HH:mm:ss")
    worksheet1.addRow(data)
    arrayData.push({date: data.date, speed_value: data.value})
  })
  raceFiltered.rpm_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("HH:mm:ss")
    worksheet2.addRow(data)
    arrayData.push({date: data.date, rpm_value: data.value})
  })
  raceFiltered.maf_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("HH:mm:ss")
    worksheet3.addRow(data)
    arrayData.push({date: data.date, maf_value: data.value})
  })
  raceFiltered.consume_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("HH:mm:ss")
    worksheet4.addRow(data)
    arrayData.push({date: data.date, consume_value: data.value})
  })

  const sortedArray = arrayData
    .sort((a,b) => {
      let dateA = a.date.split(':')
      let dateB = b.date.split(':')
      if (dateA[0] < dateB[0]) return -1;
      if (dateA[0] > dateB[0]) return 1;
      if (dateA[1] < dateB[1]) return -1;
      if (dateA[1] > dateB[1]) return 1;
      if (dateA[2] < dateB[2]) return -1;
      if (dateA[2] > dateB[2]) return 1;
      return 0;
    })
    .reduce((acc, current) => {
      let found = acc.find(item => item.date === current.date)
      if(found) found = Object.assign(found, current)
      else acc.push(current)
      return acc
    }, [])

  for(let obj of sortedArray){
    worksheet5.addRow(obj)
  }

  for(let obj of fuelInformation){
    worksheet6.addRow(obj)
  }

  workbook.xlsx.writeFile(`./EXPORT-DB-${moment().format('DD-MM-YYYY')}.xls`).then(() => {
    console.log("\n=============================================================")
    console.log('PLANILHA CRIADA')
  })
})()

