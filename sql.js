var mysql = require('mysql');
    port = process.env.PORT || 3000;

if(port = 3000){
var connection = mysql.createPool({
connectionLimit : 100,
host: 'localhost',
user: 'root',
database : 'database'
//insecureAuth : true
});
}
else{
// prod server details
var connection = mysql.createPool({
connectionLimit : 100,
host: '10.20.0.10',
user: 'root',
password: 'hike'
database : 'regression_run'
//insecureAuth : true
}

module.exports=connection;

