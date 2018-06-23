var express = require('express');
var router = express.Router();

/* GET users listing. (Commenting out the original generated stuff
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})
 */


//var restClient = require('superagent');
var bodyParser = require('body-parser');
var status = require('http-status');
var Mongoclt = require('mongodb').MongoClient;//new

var config = require('./config');
var remoteUrl = config.remoteUrl; //No longer used for this mongodb based thingy

var mykubermongo = config.mykubermongo; 

var mongo = process.env.VCAP_SERVICES;
var port = process.env.PORT || 3030;// Not sure what is this???

var connStr = "";

//Begin Get mongO URI
if (mykubermongo) { //latest twist added for Kuber, be careful to comment the config file for kuber entry if not using kuber
//Adding userid/password for OpenShift (hope it works also when userid/password not needed)
	connStr = 'mongodb://rranjan:rranjan01@' + mykubermongo + ':27017';
    //connStr = 'mongodb://' + mykubermongo + ':27017';// When not using OpenShift or a secured mongo
	
} else {
if (process.env.myMongoHOST) {  //Trying to make the code docker friendly also
    var theHost = process.env.myMongoHOST;
    connStr = 'mongodb://' + theHost + ':27017';
} else {
if (mongo) {               //Trying to make it CF ready, not tested though
    var env = JSON.parse(mongo);
    if (env['mongodb']) {
        mongo = env['mongodb'][0]['credentials'];
        if (mongo.url) {
            connStr= mongo.url;
        } else {
            console.log("No mongo found");
        }
    } else {
        connStr = 'mongodb://localhost:27017';
    }
} else {
    connStr = 'mongodb://localhost:27017';
}
}
} //The brace added for kuber thingy
//var mongoUrl = connStr + '/myStore';
//The following for openshift version
var mongoUrl = connStr + '/sampledb';

//End Get mongO URI


//New code below
/*
The things to rememeber about this code which is calling Java services:

Looks put and post returns objects whereas delete doesn't retrun anything, and probabably status is okay in each case.
Probably, we are not following all the best practices for HATEOS maturity level.
 */

Mongoclt.connect(mongoUrl, function(error, dbhandle){
	
	if (error){
		console.log('Error in MongoDB connection' + error.message);
		
	} else {

        console.log('Most probably, the connection to mongodb successful. ' );
    }
 
router.get('/', function(req, res) {

    /*
    var db = req.db;

    var collection = db.get('userlist');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
    */
	var collection = dbhandle.collection('userlist');
	
	collection.find().toArray(function(error, items) {

        if (error) { //Handle error ASAP

            res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        } else {
            res.status(status.OK).json(items);
        }

	});

	/*
    console.log('remoteUrl = ' + remoteUrl);
    restClient.get(remoteUrl, function(err, resp){

      if (err) { //Return error ASAP

        return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
      }

      if (resp.status == status.INTERNAL_SERVER_ERROR) {

        return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
      }
      //Some more resp.status values can be handled here for a more thorough code

        res.status(status.OK).json(resp.body);


    });
	*/

});

router.get('/:id', function(req, res) {


    var collection = dbhandle.collection('userlist').
                    findOne( {'userid' : parseInt(req.params.id)}, function(error, obj){  //To my utter chagrin, I realized that, most probably, req.params.id is of type string

        if (error) { //Handle error ASAP

            res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        } else if (!obj){

            res.status(status.NOT_FOUND).send('Record is not in the data store');

        } else{
            res.status(status.OK).json(obj);
        }



        }) ;

    /*
    restClient.get(remoteUrl + '/' + req.params.id, function(err, resp){

        if (err) { //Return error ASAP

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }

        if (resp.status == status.INTERNAL_SERVER_ERROR) {

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }
        //Some more resp.status values can be handled here for a more thorough code

        res.status(status.OK).json(resp.body);


    });

    */


});

/*
 * POST to adduser.
 */
router.post('/', function(req, res) {

    var collection = dbhandle.collection('userlist').
    findOne( {'userid' : req.body.userid}, function(error, obj) {

        if (error) { //Handle error ASAP

            res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        } else if (obj) {

            res.status(status.CONFLICT).send('USer with given id in database:  ');

        } else {



        if (!req.body._id) delete req.body._id;


       //dbhandle.collection('userlist').insert(req.body, function (error, insertedObj) {
        dbhandle.collection('userlist').insertOne(req.body, function (error, insertedObj) {

            if (error) { //Handle error ASAP

                res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
            } else {



            //res.status(status.CREATED).send("Create successful: " + insertedObj)
            res.status(status.CREATED).json(insertedObj);

            }
        });

        }

    });

    /*
    restClient.post(remoteUrl).send(req.body).end(function(err, resp){

        if (err) { //Return error ASAP

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }

        if (resp.status == status.INTERNAL_SERVER_ERROR) {

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }
        //Some more resp.status values can be handled here for a more thorough code
        if (resp.status == status.CREATED) { //Don't know whether this will work or not for the current service, need to verify

            return res.status(status.CREATED).send('Apparently Inserted successsful');

        }
        return res.status(status.OK).json(resp.body);//We are using this


    });
    */


});

/*
 * DELETE to deleteuser.
 */
router.delete('/:id', function(req, res) {


    var collection = dbhandle.collection('userlist').
    findOne( {'userid' : parseInt(req.params.id)}, function(error, obj) { //To my utter chagrin, I realized that, most probably, req.params.id is of type string

        if (error) { //Handle error ASAP

            res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        } else  if (!obj) {

            res.status(status.NOT_FOUND).send('USer with given id is not found ');

        } else {

          dbhandle.collection('userlist').remove({'userid' : parseInt(req.params.id)}, function (error, deletedObj) {
        //dbhandle.collection('userlist').deleteOne({'userid' : parseInt(req.params.id)}, function (error, deletedObj) { //Somehow, this new api not working and above deprecated one working, will debug later.
            if (error) { //Handle error ASAP

                res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
            } else {
                res.status(status.OK).send("The ojbect is no more" );
            }

        });

        }

    });


    /*
    restClient.delete(remoteUrl + '/' + req.params.id, function(err, resp){

        if (err) { //Return error ASAP

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }

        if (resp.status == status.INTERNAL_SERVER_ERROR) {

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }
        //Some more resp.status values can be handled here for a more thorough code

        res.status(status.OK).send('The record probably deleted');


    });
    */

});


/*
 * PUT to modifyuser.
 */

//id is in 2 places, probably a code quality issue. The 2 values are assumed same (one in url, the other in payload)

router.put('/:id', function(req, res) {

    var collection = dbhandle.collection('userlist').
    findOne( {'userid' : parseInt(req.params.id)}, function(error, obj) { //To my utter chagrin, I realized that, most probably, req.params.id is of type string

        if (error) { //Handle error ASAP

            res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        } else if (!obj) {

            res.status(status.NOT_FOUND).send('USer with given id is not found ');

        } else {




        // dbhandle.collection('userlist').update({'userid' : req.params.id}, req.body, function (error, updatedObj) {
        dbhandle.collection('userlist').replaceOne({'userid' : parseInt(req.params.id)}, req.body, function (error, updatedObj) {
            if (error) { //Handle error ASAP

                res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
            } else {
                //res.status(status.OK).send("Update successful : " +  updatedObj);
                res.status(status.OK).json(updatedObj);

            }


        });

        }

    });

    /*
    restClient.put(remoteUrl + '/' + req.params.id).send(req.body).end(function(err, resp){

        if (err) { //Return error ASAP

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }

        if (resp.status == status.INTERNAL_SERVER_ERROR) {

            return res.status(status.INTERNAL_SERVER_ERROR).json({err: err.toString()});
        }
        //Some more resp.status values can be handled here for a more thorough code
        if (resp.status == status.CREATED) { //Don't know whether this will work or not for the current service, need to verify

            return res.status(status.CREATED).send('Update successsful');
        }

        return res.status(status.OK).json(resp.body);//We are using this

    });
    */

});
    //Begin experimental code
    /*
    var redis = require("redis");

    var publisher = null;

    var redisPort = process.env.REDIS_PORT || 6379;
    var redisHost = process.env.REDIS_HOST || 'localhost';

    //publisher = redis.createClient(credentials.port, credentials.host);
    publisher = redis.createClient(redisPort, redisHost);

    publisher.on('error', function(err){

        console.error('There was an error with the publisher:' + err.message);

    });


    app.post('/solicitrates', function (req, res) {

        console.log('Received message from http:' + req.body.message);

        if (publisher) {

            publisher.publish('brokerservices', req.body.message);

        }

        res.end('The message successfully published to the myriad polyglot clients');


    });
    */

    //End experimental code

//module.exports = router;

}); //end of MongoClient code

module.exports = router;//Did a gamble moving this here. Looks it paid off.

