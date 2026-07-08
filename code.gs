/****************************************************
 * PURCHASING SPAREPART MANAGEMENT SYSTEM
 * Backend Google Apps Script
 ****************************************************/


// ===============================
// CONFIGURATION
// ===============================

const SPREADSHEET_ID = "105Nu5SMT1VGhXapEoz2WEu4Diov5Yhf6m_YqfSCsTXk";


const SHEET = {

  PURCHASING : "Purchasing",

  DANA : "Dana_Masuk",

  ITEM : "Master_Item",

  VENDOR : "Master_Vendor",

  MERK : "Master_Merk"

};



// ===============================
// WEB APP ROUTER
// ===============================


function doGet(){

  return HtmlService
  .createTemplateFromFile("index")
  .evaluate()
  .setTitle("Purchasing Sparepart")
  .setXFrameOptionsMode(
    HtmlService.XFrameOptionsMode.ALLOWALL
  );

}



// INCLUDE HTML

function include(filename){

  return HtmlService
  .createHtmlOutputFromFile(filename)
  .getContent();

}

// ===============================
// ROUTER HALAMAN (Tambahan)
// ===============================

function getPageContent(pageName) {
  try {
    // Mencari file html sesuai nama yang dikirim (misal: 'dashboard')
    // evaluate() digunakan agar script <?!= include() ?> di dalam halaman juga ikut terender
    return HtmlService.createTemplateFromFile(pageName).evaluate().getContent();
  } catch (error) {
    // Jika file HTML (misal 'dana.html') belum dibuat, tampilkan pesan error ini di halaman
    return '<div class="alert alert-danger m-4"><h4>Error 404</h4><p>Halaman <b>' + pageName + '.html</b> belum dibuat di Apps Script.</p></div>';
  }
}


// ===============================
// DATABASE CONNECTION
// ===============================


function getSS(){

  return SpreadsheetApp
  .openById(SPREADSHEET_ID);

}



function getSheet(name){

  return getSS()
  .getSheetByName(name);

}



// ===============================
// GENERAL FUNCTION
// ===============================


function formatDate(date){

  if(!date) return "";

  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );

}



function generateID(){

 return Utilities
 .getUuid();

}



// ==================================================
// PURCHASING
// ==================================================



function getPurchasing(){


 const sheet =
 getSheet(SHEET.PURCHASING);


 const data =
 sheet
 .getDataRange()
 .getValues();


 data.shift();


 return data.map(row=>{


 return {

 id:row[0],

 date:formatDate(row[1]),

 item:row[2],

 part:row[3],

 merk:row[4],

 unit:row[5],

 vendor:row[6],

 satuan:row[7],

 qty:row[8],

 price:row[9],

 total:row[10],

 inv:row[11],

 pic:row[12],

 job:row[13]


 };


 });


}





function savePurchasing(data){



 const sheet =
 getSheet(SHEET.PURCHASING);



 let total =
 Number(data.qty) *
 Number(data.price);



 sheet.appendRow([


 generateID(),


 new Date(data.date),


 data.item,


 data.part,


 data.merk,


 data.unit,


 data.vendor,


 data.satuan,


 Number(data.qty),


 Number(data.price),


 total,


 data.inv,


 data.pic,


 data.job



 ]);



 return {

 status:true,

 message:"Purchasing berhasil disimpan"

 };


}







function deletePurchasing(id){


 const sheet =
 getSheet(SHEET.PURCHASING);


 const data =
 sheet.getDataRange()
 .getValues();



 for(let i=1;i<data.length;i++){


   if(data[i][0]==id){


     sheet.deleteRow(i+1);

     return true;

   }


 }


 return false;


}






function updatePurchasing(data){


const sheet =
getSheet(SHEET.PURCHASING);


const rows =
sheet.getDataRange()
.getValues();



for(let i=1;i<rows.length;i++){


if(rows[i][0]==data.id){



let total =
Number(data.qty) *
Number(data.price);



sheet.getRange(i+1,1,1,14)
.setValues([[


data.id,

new Date(data.date),

data.item,

data.part,

data.merk,

data.unit,

data.vendor,

data.satuan,

Number(data.qty),

Number(data.price),

total,

data.inv,

data.pic,

data.job



]]);



return true;


}



}



return false;


}





// ==================================================
// DANA MASUK
// ==================================================



function getDana(){


const sheet =
getSheet(SHEET.DANA);


let data =
sheet.getDataRange()
.getValues();



data.shift();



return data.map(r=>{


return {


id:r[0],

date:formatDate(r[1]),

sumber:r[2],

tujuan:r[3],

nominal:r[4],

via:r[5]


}



});


}






function saveDana(data){


const sheet =
getSheet(SHEET.DANA);



sheet.appendRow([


generateID(),


new Date(data.date),


data.sumber,


data.tujuan,


Number(data.nominal),


data.via


]);



return true;


}







function deleteDana(id){


const sheet =
getSheet(SHEET.DANA);



let data =
sheet.getDataRange()
.getValues();



for(let i=1;i<data.length;i++){


if(data[i][0]==id){


sheet.deleteRow(i+1);


return true;


}


}


return false;


}





// ==================================================
// MASTER ITEM
// ==================================================



function getMasterItem(){


const sheet =
getSheet(SHEET.ITEM);



let data =
sheet.getDataRange()
.getValues();



data.shift();



return data.map(r=>{


return {


item:r[0],

part:r[1],

persamaan1:r[2],

persamaan2:r[3]


};


});


}







// ==================================================
// MASTER VENDOR
// ==================================================



function getVendor(){


const sheet =
getSheet(SHEET.VENDOR);



let data =
sheet.getDataRange()
.getValues();



data.shift();



return data.map(r=>{


return {


nama:r[0],

telp:r[1],

alamat:r[2]


};


});


}





// ==================================================
// MASTER MERK
// ==================================================



function getMerk(){


const sheet =
getSheet(SHEET.MERK);



let data =
sheet.getDataRange()
.getValues();



data.shift();



return data.flat();


}





// ==================================================
// DASHBOARD SUMMARY
// ==================================================



function getDashboard(){



let purchase =
getPurchasing();



let dana =
getDana();



let totalPurchase =

purchase.reduce(
(a,b)=>a+Number(b.total||0),
0
);



let totalDana =

dana.reduce(
(a,b)=>a+Number(b.nominal||0),
0
);



return {


purchaseCount:
purchase.length,


totalPurchase:
totalPurchase,


totalDana:
totalDana,


balance:
totalDana-totalPurchase



};



}







// ==================================================
// FILTER REPORT
// ==================================================



function getReport(start,end){



let data =
getPurchasing();



let result =
data.filter(x=>{


let d =
new Date(x.date);



return (

d >= new Date(start)

&&

d <= new Date(end)

);


});



return result;


}




// =================================================
// EXPORT PDF
// =================================================


function createPDF(data){


let doc =
DocumentApp.create(
"Purchasing_Report"
);



let body =
doc.getBody();



body.appendParagraph(
"PURCHASING SPAREPART REPORT"
)
.setHeading(
DocumentApp.ParagraphHeading.HEADING1
);



body.appendParagraph(
"Generated : "+
new Date()
);



let table=[];


table.push([

"DATE",
"ITEM",
"PART",
"VENDOR",
"QTY",
"TOTAL"

]);



data.forEach(x=>{


table.push([

x.date,

x.item,

x.part,

x.vendor,

String(x.qty),

String(x.total)

]);


});



body.appendTable(table);



doc.saveAndClose();




let pdf =
DriveApp
.getFileById(doc.getId())
.getAs("application/pdf");



let file =
DriveApp
.createFile(pdf);



return file.getUrl();


}






// =================================================
// EXPORT EXCEL
// =================================================


function createExcel(data){



let ss =
SpreadsheetApp.create(
"Purchasing_Report"
);



let sheet =
ss.getActiveSheet();



sheet.appendRow([

"DATE",
"ITEM",
"PART",
"VENDOR",
"QTY",
"TOTAL"

]);



data.forEach(x=>{


sheet.appendRow([

x.date,

x.item,

x.part,

x.vendor,

x.qty,

x.total


]);


});




return ss.getUrl();



}

// ==================================================
// TEST CONNECTION
// ==================================================



function test(){


return "Database Connected";


}
