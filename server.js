// BASE SETUP

// call the packages we need
const express = require('express'); // call express
const app = express();    //defne our app using express
const bodyParser = require('body-parser');

//set json-body
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//start express on a defined port
const server = app.listen(8000, function () {
 var host = server.address().address;
 host = (host === '::' ? 'localhost' : host);
 const port = server.address().port;
console.log('Node is running here at http://%s:%s', host, port);
});

// routes for your API
var router = express.Router(); // get an instance of the express Router

// register our routes
// all routes will be prefied with /rr
app.use('/rr',router);

pool = require('./sql');

//get all regression runs
router.get('/', function (req, res) {  
           pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM TestRun', function (err, rows) {
             console.log(pool._freeConnections.indexOf(connection)); // -1
             connection.release();
             console.log(pool._freeConnections.indexOf(connection)); // 0
                if (!err) {  
                    //make results
                    var resultJson = JSON.stringify(rows);
                    resultJson =  JSON.parse(resultJson);
                    //send JSON to Express
                    res.json(resultJson);
                    //res.json(rows);  
                }  
                else {  
                    console.error("From /rr/getAllRuns :" + err);         
                    res.json(err);  
                    }
               }); 
            });    
    });

//get all failed test %
router.get('/failedPerc',function(req,res){
    pool.getConnection(function(err,connection){
    connection.query(`SELECT * FROM(Select  (SUM( CASE WHEN STATUS='false' Then 1 ELSE 0 END)/COUNT(*))*100 as 'FailPerc',scenarioName from ScenarioRun group by scenarioName order BY FailPerc) as FailScenarioTable where FailPerc >0;`, function(err,rows) {
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    var resultJson = JSON.stringify(rows);
                    resultJson =  JSON.parse(resultJson);
                    res.json(resultJson); 
                }  
                else {  
                    console.error("From /rr/getAllRuns :" + err);         
                    res.json(err);  
                    }  
                 });      
                });
});

//post for id
router.get('/:id',function(req,res){
    let id = req.params.id;
     if (!id) {
        return res.status(400).send({ error:true, message: 'Please provide id' });
    }
    pool.getConnection(function(err,connection){
    connection.query(`SELECT * FROM TestRun WHERE id =?`,[id],function(error,rows){
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    var resultJson = JSON.stringify(rows);
                    resultJson =  JSON.parse(resultJson);
                    return res.json(resultJson); 
                }  
                else {  
                    console.error("From /rr/getAllRuns :" + err);         
                    res.json(err);  
                    }  
                 });     
    });
});






