class Database{

static spreadsheet(){

return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

}

static sheet(name){

return this.spreadsheet().getSheetByName(name);

}

static values(name){

return this.sheet(name)

.getDataRange()

.getValues();

}

static append(name,row){

this.sheet(name)

.appendRow(row);

}

static delete(name,row){

this.sheet(name)

.deleteRow(row);

}

}
