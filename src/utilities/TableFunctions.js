/*
This document only contains the examples of the database functions. None of these are exported.
The user of table functions can be seen in calling utils.
*/

import {
    connectionString,
    accountName,
} from "../components/TableEnvironment/environment";
const azure = require("azure-storage");
//table service tools.
var tableservice = azure.createTableService(accountName, connectionString);
var entGen = azure.TableUtilities.entityGenerator;

//takes name of the table to create as a string
function createTable(Tablename) {
    tableservice.createTableIfNotExists(
        Tablename,
        function (error, result, response) {
            if (!error) {
                //result says true if table created, false if table exists.
            }
        }
    );
}

//all inputs are strings.
function searchKiosk(TableName, PartitionKey, RowKey) {
    tableservice.retrieveEntity(
        TableName,
        PartitionKey,
        RowKey,
        function (error, result, response) {
            if (!error) {
                // result contains the entity
            }
        }
    );
}

//inputs are lowercase to differentiate between them and entities on the table.
function saveToken(Tablename, partitionkey, rowkey, token, userid, expiration) {
    //unique partitionkey needed.
    //entity can be modified.
    var entity = {
        PartitionKey: entGen.String(partitionkey),
        RowKey: entGen.String(rowkey),
        Token: entGen.String(token),
        Userid: entGen.String(userid),
        Expiration: entGen.DateTime(expiration),
    };

    tableservice.insertEntity(
        Tablename,
        entity,
        function (error, result, response) {
            if (!error) {
                // result contains the ETag for the new entity
            }
        }
    );
}

function getuserid(partitionkey) {
    const Tablename = "KioskToken";
    const rowkey = "1";
    const ret = tableservice.retrieveEntity(
        Tablename,
        partitionkey,
        rowkey,
        function (error, result, response) {
            if (!error) {
                // result contains the entity
            }
            //values on table must be called inside this scope using result.{name of item}.
        }
    );
    console.log(ret);
    return ret;
}

export { searchKiosk, saveToken, createTable, getuserid, tableservice };
