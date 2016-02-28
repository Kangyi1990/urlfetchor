/**
 * Created by dufl on 2/27/2016.
 */
var NODE_ENV=process.env.NODE_ENV;

var db_username='urlfetchor';
var db_password='urlfetchor';
var local_test_db='mongodb://localhost:27017/urlfetchor';

var config={};



if(NODE_ENV==='prod'){
    config.db_url='mongodb://'+db_username+':'+db_password+'@ds019078.mlab.com:19078/urlfetchor';
}
else {
    config.db_url =local_test_db
}



module.exports=config;