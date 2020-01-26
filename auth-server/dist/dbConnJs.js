"use strict";
var ConnectionPool = require('tedious-connection-pool');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var mysql = require('mysql');
/*
let DATABASE = {
    userName: 'hoodsadmin@hoodscapstone',
    password: 'admin666!',
    server: 'hoodscapstone.mysql.database.azure.com',
    options: {
        database: 'capstonedb', // prod
        port: '3306',
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        connectTimeout: 360000,
        requestTimeout: 360000
    }
};

var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

//create the pool
var pool = new ConnectionPool(poolConfig, DATABASE);

pool.on('error', function(err) {
    console.error(err);
});

//acquire a connection
pool.acquire(function (err, connection) {
    if (err) {
        console.error(err);
        return;
    }

    //use the connection as normal
    var request = new Request('SELECT * FROM Users', function(err, rowCount) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('rowCount: ' + rowCount);

        //release the connection back to the pool when finished
        connection.release();
    });

    request.on('row', function(columns) {
        console.log('value: ' + columns[0].value);
    });

    connection.execSql(request);
});
*/
var config = {
    server: 'hoodscapstone.mysql.database.azure.com',
    authentication: {
        type: 'default',
        options: {
            userName: 'hoodsadmin@hoodscapstone',
            password: 'admin666!' //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'capstonedb' //update me
    }
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.  
    if (err)
        console.log(err.message);
    else {
        console.log("Connected");
        executeStatement();
    }
});
function executeStatement() {
    request = new Request("SELECT * FROM Users", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            }
            else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });
    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}
/*
let connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3308',
    user: 'root',
    password: 'capstone',
    database: 'capstonedb',
    insecureAuth : true
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
   
    console.log('Connected to the MySQL server.');
  });


*/
/*
var config =
{
    host: 'hoodscapstone.mysql.database.azure.com',
    user: 'hoodsadmin@hoodscapstone',
    password: 'admin666!',
    database: 'capstonedb',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) {
    if (err) {
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
    }
});
*/
