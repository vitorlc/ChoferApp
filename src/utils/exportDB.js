const firestoreService = require('firestore-export-import');
const fs = require('fs')
const moment = require('moment')
const Excel = require('exceljs')

var serviceAccount = require("./chofer-app-f5510-firebase-adminsdk-skx0a-f9dac2d8d4.json")
const appName = '[DEFAULT]'

;(async () => {
  firestoreService.initializeApp(serviceAccount, 'chofer-app-f5510', appName);
  
  let raceObject = {}
  let collections = await firestoreService
  .backup('races')

  fs.writeFileSync('DB_DATA.json', JSON.stringify(collections))
  raceObject = collections 
  console.log("raceObject", raceObject)

  const workbook = new Excel.Workbook();
  let worksheet1 = workbook.addWorksheet("Speed")
  let worksheet2 = workbook.addWorksheet("Rpm")
  let worksheet3 = workbook.addWorksheet("MAF")
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
    
  for (let id of Object.keys(raceObject.races)) {
    raceObject.races[id].speed_data.forEach(data => {
      data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
      worksheet1.addRow(data)
    })
    raceObject.races[id].rpm_data.forEach(data => {
      data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
      worksheet2.addRow(data)
    })
    raceObject.races[id].maf_data.forEach(data => {
      data.date = moment(data.date.toDate()).format("DD/MM/YYYY HH:mm:ss")
      worksheet3.addRow(data)
    })
    break // SOMENTE A PRIMEIRA CORRIDA POR ENQUANTO
  }
  workbook.xlsx.writeFile(`./EXPORT-DB-${moment().format('DD-MM-YYYY')}.xls`).then(() => {
    console.log("\n=============================================================")
    console.log('PLANILHA CRIADA')
  })
})()

