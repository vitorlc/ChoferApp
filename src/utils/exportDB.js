const firestoreService = require('firestore-export-import');
const fs = require('fs')
const moment = require('moment')
const Excel = require('exceljs')

var serviceAccount = require("./chofer-app-f5510-firebase-adminsdk-skx0a-f9dac2d8d4.json")
const appName = '[DEFAULT]'
const myArgs = process.argv.slice(2);
;(async () => {
  firestoreService.initializeApp(serviceAccount, 'chofer-app-f5510', appName);
  
  let raceObject = {}
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

  worksheet1.columns = [
    {header: 'Date', key: 'date', width: 40},
    {header: 'Value', key: 'value', width: 40},
  ]
  worksheet2.columns = [
    {header: 'Date', key: 'date', width: 40},
    {header: 'Value', key: 'value', width: 40},
  ]
  worksheet3.columns = [
    {header: 'Date', key: 'date', width: 40},
    {header: 'Value', key: 'value', width: 40},
  ]
  worksheet4.columns = [
    {header: 'Date', key: 'date', width: 40},
    {header: 'Value', key: 'value', width: 40},
  ]

  let raceFiltered = Object.values(raceObject.races)
    .filter(race => moment(race.race_start.toDate()).format("DD/MM/YYYY") == moment(myArgs, 'DD/MM/YYYY').format("DD/MM/YYYY"))
    .sort((a,b) => new Date(b.race_start.toDate()) -  new Date(a.race_start.toDate()))[0]
  
  raceFiltered.speed_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
    worksheet1.addRow(data)
  })
  raceFiltered.rpm_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
    worksheet2.addRow(data)
  })
  raceFiltered.maf_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
    worksheet3.addRow(data)
  })
  raceFiltered.consume_data.forEach(data => {
    data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
    worksheet4.addRow(data)
  })
  
  workbook.xlsx.writeFile(`./EXPORT-DB-${moment().format('DD-MM-YYYY')}.xls`).then(() => {
    console.log("\n=============================================================")
    console.log('PLANILHA CRIADA')
  })
})()

