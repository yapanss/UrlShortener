'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('lodash');
var cors = require('cors');
var dns = require('dns');
var url = require('url');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
 mongoose.connect('mongodb://yapanss:11Braves@ds157901.mlab.com:57901/fcc_mongodb', {
 	useNewUrlParser: true
 }).then(() => {
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
app.get('/api', function(req, res){
  res.json({greeting: 'hello API'});
})

app.get("/api/shorturl/:num", function (req, res) {
  ShortUrl.findOne({shortUrl: req.params.num}, (err, doc) => {
  	if (err) {
  		console.log(err)
  	} else {
  		if (!doc) {
  			res.end("This Number dos not correspond to a vallid url")
  		} else {
  			res.redirect(doc.fullUrl);
  		}
  	}
  })
});

app.post("/api/shorturl/new", (req, res) => {

	var short = new ShortUrl();
	var fullUrl = url.parse(req.body.fullUrl, true);
  	var match = fullUrl.href == req.body.fullUrl;
  	var protoc = /http(s)?/ ;

  	if(!fullUrl.protocol || !(fullUrl.protocol.match(protoc)) && !(fullUrl.slashes)) {
  		res.json({error: "invalid url"});
  	} else {
  		dns.lookup(fullUrl.hostname, function (err, addresses, family) {
	  	if(!addresses) {
	  		res.json({error: "Invalid url"});
		 } else {
	  		ShortUrl.find({}, (err, doc) => {
			if(err) {
				console.log(err)
			} else {
				if(doc.length == 0) {
					short.fullUrl = req.body.fullUrl;
					short.shortUrl = 1;
				} else {
						_.sortBy(doc, ['shortUrl']);
						short.fullUrl = req.body.fullUrl;
						short.shortUrl = doc[doc.length-1].shortUrl + 1;
				  }
			 	short.save((err) => {
					if(err) {
						console.log(err);
					} else res.json({original_url: short.fullUrl, short_url: short.shortUrl})
				})
				}
			});
	 	 }
		});
  	}
	
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});