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


//getdistinct branchversion
router.get('/dbranchversion',function(req,res){
    pool.getConnection(function(err,connection){
    connection.query(`Select distinct(branchVersion) from regression_run.TestRun  order by branchVersion desc;`, function(err,rows) {
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    var resultJson = rows.map(function(val) {
                        return val.branchVersion;
                          });
                      var newresult ={};
                      newresult['branchVersion'] = resultJson;
                      res.json(newresult);

                }  
                else {  
                    console.error("From /dbranchversion:" + err);         
                    res.json(err);  
                    }  
                 });      
                });
});


//get distinct runs of latest releases //limit 5 // count 5
router.get('/latestruns',function(req,res){
    pool.getConnection(function(err,connection){
    connection.query(`SELECT t.branchName,t.branchVersion,t.totalCases,t.totalPass,
        t.totalFail,t.type,t.createdON FROM (select DISTINCT(branchName) from regression_run.TestRun  LIMIT 5)
         as b JOIN regression_run.TestRun as t ON t.branchName=b.branchName AND t.id >= COALESCE(
         (SELECT ti.id FROM regression_run.TestRun AS ti WHERE ti.id = t.id LIMIT 1 OFFSET 4), -2147483647) ORDER BY t.branchName;`, function(err,rows) {
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    // var resultJson = JSON.stringify(rows);
                    // resultJson =  JSON.parse(resultJson);
                    // res.json(resultJson);
           var newDict = {};

           Object.values(rows).map(function(s,e){
           newDict[s.branchName]=[];//push(s);
           });

           Object.values(rows).map(function(s,e){
           newDict[s.branchName].push(s);
            });

           console.log(newDict);
           res.json(newDict);

                }  
                else {  
                    console.error("From /latestruns:" + err);         
                    res.json(err);  
                    }  
                 });      
                });
});


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
                    console.error("From / :" + err);         
                    res.json(err);  
                    }
               }); 
            });    
    });



//get all failed test %
router.get('/failedPerc',function(req,res){
    pool.getConnection(function(err,connection){
    connection.query(`SELECT * FROM(Select  (SUM( CASE WHEN STATUS='false' Then 1 ELSE 0 END)/COUNT(*))*100 as 'FailPerc',scenarioName from ScenarioRun group by scenarioName order BY FailPerc DESC) as FailScenarioTable where FailPerc >0;`, function(err,rows) {
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    var resultJson = JSON.stringify(rows);
                    resultJson =  JSON.parse(resultJson);
                    res.json(resultJson); 
                }  
                else {  
                    console.error("From /failedPerc :" + err);         
                    res.json(err);  
                    }  
                 });      
                });
});



//latets runs by branchVersion
router.get('/latestrun/:version',function(req,res){
    var version = req.params.version;
     if (!version) {
        return res.status(400).send({ error:true, message: 'Please provide version' });
    }
    pool.getConnection(function(err,connection){
    connection.query(`Select t.branchName,t.branchVersion,t.totalCases,t.totalPass,t.totalFail,t.type,t.createdON FROM  regression_run.TestRun as t where t.branchVersion=? order by createdON limit 5;`,[ version ],function(error,rows){
    console.log(pool._freeConnections.indexOf(connection)); // -1
    connection.release();
    console.log(pool._freeConnections.indexOf(connection)); // 0 
                if(!err) {  
                    var resultJson = JSON.stringify(rows);
                    resultJson =  JSON.parse(resultJson);
                    return res.json(resultJson); 
                }  
                else {  
                    console.error("From /latestruns/:branchverison' :" + err);         
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
                    console.error("From /:id' :" + err);         
                    res.json(err);  
                    }  
                 });     
    });
});

