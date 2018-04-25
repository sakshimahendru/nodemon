var mysql = require('mysql');
    port = process.env.PORT || 3000;

// prod server details
var connection = mysql.createPool({
connectionLimit : 100,
host: '10.20.0.10',
user: 'root',
password: 'hike',
database : 'regression_run'
//insecureAuth : true
});


connection.getConnection((err) => {
  if (err) throw err;
  console.log('Connected!');
  connection.release;
});

module.exports=connection;

