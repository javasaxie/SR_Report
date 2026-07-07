class Utils{

static uuid(){

return Utilities.getUuid();

}

static now(){

return new Date();

}

static response(data){

return ContentService

.createTextOutput(

JSON.stringify(data)

)

.setMimeType(

ContentService.MimeType.JSON

);

}

}
