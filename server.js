'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('lodash');
var cors = require('cors');

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import _ from 'lodash';

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
 mongoose.connect('mongodb://yapanss:11Braves@ds157901.mlab.com:57901/fcc_mongodb')
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
 
var UrlSchema = new mongoose.Schema({
	fullUrl: String,
	shortUrl: Number
})
var ShortUrl = mongoose.model('ShortUrl', UrlSchema);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/:shortUrl", function (req, res) {
  // res.json({greeting: 'hello API'});
  ShortUrl.findOne({shortUrl: Number(req.params.shortUrl)}, (err, doc) => {
  	if (err) {
  		console.log(err)
  	} else {
  		if (!doc) {
  			res.end("Bad Url")
  		} else {
  			let fullUrl = doc.fullUrl;
  			res.redirect(fullUrl);
  		}
  	}
  })
});

app.post("/api/shorturl/new", (req, res) => {
	var short = new ShortUrl();
	var fullUrl = req.body.fullUrl;

	ShortUrl.find({}, (err, doc) => {
		if(err) {
			console.log(err)
		} else {
			// res.json({message :  "Successfully saved", doc: doc});
			if(doc.length == 0) {
				short.fullUrl = fullUrl;
				short.shortUrl = 1;
			} else {
				_.sortBy(doc, ['shortUrl']);
				short.fullUrl = fullUrl;
				short.shortUrl = doc[doc.length-1].shortUrl + 1;
				console.log("le document est : ", doc[doc.length-1]);
				// res.json(doc);
			}
			short.save((err) => {
				if(err) {
					console.log(err);
				} else res.json({message: "document saved", shortUrl: short.shortUrl})
			})
		}
	});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});