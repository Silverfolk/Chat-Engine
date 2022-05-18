const { format } = require('express/lib/response');
const moment =require('moment');

function MessageObj(username,text){
    return{
        username,
        text,
        time:moment().format('h:mm a')//hours, minutes ,am or pm 
    }
}

module.exports=MessageObj;