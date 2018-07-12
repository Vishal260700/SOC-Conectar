const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var phone = '';
var mail = '';
var designation = '';
var present = '';
var tags = '';
var about = '';
var accomplishments = '';
const async=require('async');
var results=[];

app.post('/tagbtn',function(req,res,next){
  var item = {
    tags : req.body.tag
  };
  const v=url;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$addToSet: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

app.post('/tagsearch', function(req, res, next){
  results=[];
  var input = req.body.tag;
  var data;
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db('loginapp');
    dbo.collection('users').find({}, {fields : {'username': 1, '_id' : 0 }}).toArray(function(err, result) {
    if (err) throw err;
    data = result;
    db.close();
    var temp;
    temp = data.map(function (obj) {
      return obj.username;
    });

    async.each(temp,function(usr,callback){
      var abcd=url+usr;
      mongo.connect(abcd,function(err,db2){
        if(err) throw err;
        var db123=db2.db(usr);
        db123.collection(usr).findOne({tags:{$all:[input]}},{fields: {}},function(err,result)
        {
          if (err) throw err;
              try
              {
                results.push({username1 : result.username,about1 : result.about,accomplishments1 : result.accomplishments,designation1 : result.designation,present1 : result.present});
              }
              catch(e){}
              db2.close();
              callback();
        });

      });
    },function(err){
      res.render('search',{searchresults:results,username : input});
    }
  );
   });
  }); 
  
});

app.post('/search', function(req, res, next){
  results=[];
  var input = req.body.searchbar;
  var data;
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db('loginapp');
    dbo.collection('users').find({}, {fields : {'username': 1, '_id' : 0 }}).toArray(function(err, result) {
    if (err) throw err;
    data = result;
    db.close();
    var temp;
    temp = data.map(function (obj) {
      return obj.username;
    });

    async.each(temp,function(usr,callback){
      var abcd=url+usr;
      mongo.connect(abcd,function(err,db2){
        if(err) throw err;
        var db123=db2.db(usr);
        db123.collection(usr).findOne({tags:{$all:[input]}},{fields: {}},function(err,result)
        {
          if (err) throw err;
              try
              {
                results.push({username1 : result.username,about1 : result.about,accomplishments1 : result.accomplishments,designation1 : result.designation,present1 : result.present});
              }
              catch(e){}
              db2.close();
              callback();
        });

      });
    },function(err){
      res.render('search',{searchresults:results,username : input});
    }
  );
   });
  }); 
  
});

var name1 = '';
var username1 = '';
var email1 = '';
app.get('/user',function(req,res,next){
  var input = req.query.search;
  console.log(input);
  MongoClient.connect(url,function(err,db){
    assert.equal(null, err);
    const dbo = db.db('loginapp');
    dbo.collection('users').find({"username": input}).toArray(function(err, result) {
      assert.equal(null, err);
      console.log('Item searched');
      console.log(result[0]['name']);
      console.log(result[0]['username']);
      console.log(result[0]['email']);
      name1 = result[0]['name'];
      username1 = result[0]['username'];
      email1 = result[0]['email'];
      db.close();
      res.render('visitsearch',{name : name1,user : username1,email : email1});
  });
});
});
console.log("Hello");

app.get('/', ensureAuthenticated,function(req, res){
  var v=url+req.user.username;
MongoClient.connect(v, function(err, db) {
  if (err) console.log("error recieved");
  const dbo = db.db(req.user.username);
  dbo.collection(req.user.username).findOne({}, function(err, result) {
    if (err) console.log('Error detected');
    try{
      if(result.phone)phone = result.phone;
    }
    catch(e){};
    try
    {

      if(result.mail)mail = result.mail;
    }
    catch(e){};
    try
    {
      if(result.accomplishments)accomplishments = result.accomplishments;
    }
    catch(e){};
    try
    {
      if(result.designation)designation = result.designation;
    }
    catch(e){};
    try
    {
      if(result.present)present = result.present;
    }
    catch(e){};
    try
    {
      if(result.about)about = result.about;
    }
    catch(e){};
    try{
      tags = result.tags;
    }
    catch(e){};
      res.render('dashboard',{
      title : req.user.username,
      username : req.user.username,
      mail : mail,
      phone : phone,
      designation : designation,
      cc : present,
      about : about,
      accomplishments : accomplishments,
      t1: tags[0],
      t2 : tags[1],
      t3 : tags[2],
      f1 : 'Vipul Shankhpal',
      f2 : 'Ayush Soneria',
      f3 : 'Sudhanshu Bansal',
      f4 : 'Jayesh'
    });
    console.log(result);
    db.close();
  });
});

});
app.get('/user.json', function(req, res, next) {
  res.json({username: req.user.username});
});
app.post('/update', function(req, res, next) {
  var item = {
    phone : req.body.phone,
    mail : req.body.mail,
    designation : req.body.designation,
    present : req.body.cc,
    about : req.body.about,
    accomplishments : req.body.accomplishments
  };
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$set: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.redirect('/');
});
app.post('/update3', function(req, res, next) {
  var item = req.body.del;
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).findOneAndUpdate({$pull : {tags : item}} , function(err, res) {
      assert.equal(null, err);
      console.log('Item Deleted');
      db.close();
    });
  });
  res.redirect('/');
});

app.post('/update2', function(req, res, next) {
  var item = {
    tags : req.body.tag
  };
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$addToSet: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.redirect('/');
});

app.get('/tag',ensureAuthenticated,function(req,res){
  res.render('tagging',{
    username : req.user.username
  });//add the function of inserting data in the database collection following userschema
});
app.get('/team',ensureAuthenticated,function(req,res){
  res.render('team',{
    team : 'Conectar-Family'
  });//add the function of inserting data in the database collection following userschema
});
app.get('/chat', ensureAuthenticated,function (req, res) {
 res.render('chat',{
  username : req.user.username//will add a token/ session here
 });
});
app.get('/contact', ensureAuthenticated,function (req, res) {
  res.render('contact',{
    username : req.user.username,//add the username which will be retrieved after validation by login form
    query : 'Contact Form'
  });
});
app.get('/about', ensureAuthenticated,function (req, res) {
 res.render('about',{
  username : req.user.username,//same reason which we have used
  about : 'Conectar'
 });
});
app.get('/visit', ensureAuthenticated,function (req, res) {
 res.render('visit',{
  username : req.user.username,
  visited : 'PersonName'//we will pass the parameter for the visited person name...
 });
});
app.use(express.static(__dirname + '/public'));


// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.post('/send', (req, res) => {
  const output = `
  <center>
  <div style = "background:#EAFAF1;width:60%;">
  <h3 style="font-size:40px;color: black;padding-top: 20px;">Contact Details</h3>
  <style>
    td{
      padding : 10px;
      width: 5%;
      font-size:20px;
    }
  </style>
<div style="background:#EAFAF1;">
  <table style="padding-bottom:30px;padding-right: 10px;padding-left: 10px;">
    <tr style="background: #EAEDED;">
      <td>
        Name
      </td>
      <td>
        ${req.body.name}
      </td>
    </tr>
    <tr style="background: white;">
      <td>
        Company
      </td>
      <td>
        ${req.body.company}
      </td>
    </tr>
    <tr style="background: #EAEDED;">
      <td>
        Mail Id
      </td>
      <td>
        ${req.body.email}
      </td>
    </tr>
    <tr style="background: white;">
      <td>
        Phone Number
      </td>
      <td>
        ${req.body.phone}
      </td>
    </tr>
    <tr style="background: #EAEDED;">
      <td>
        Message
      </td>
      <td>
        ${req.body.message}
      </td>
    </tr>
  </table>
</div>
</div>
</center>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'conectarv1@gmail.com', // generated ethereal user
        pass: 'versionnumber1'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'conectarv1@gmail.com', // sender address
      to: ['conectar.iitk@gmail.com','vishal260700@gmail.com'], // list of receivers 
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });
// Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

module.exports = app;