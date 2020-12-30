const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ejs = require("ejs");
const cors = require("cors");
const port = 3000



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'college_db'
});
 
connection.connect();

app.get('/', (req, res) => {
  res.render('home')
})

app.get("/login", (req, res) => {
    res.render('login')
})

app.post('/login', (req,res)=>{
    const email = req.body.user;
    const password = req.body.passn;
    
    connection.query('SELECT user_id, password, username FROM user WHERE email = ?',[email], function (error, results) {
        if (error){
            res.send("<h1>No details exist</h1>")
            console.log(error);
        } else {
            if(results[0].password === password) {
                res.render('studentdetails', {username: results[0].username, user_id: results[0].user_id})
                console.log("success");
                console.log(results[0])
            } else {
                console.log("password didn't match")
            }
        }
        
    });
})

app.get("/signup", (req, res) => {
    res.render('signup')
})

app.post("/signup", (req, res) => {
    console.log(req.body)
    const user = req.body.user;
    const email = req.body.emailid;
    const password = req.body.passn;
    const password2 = req.body.passn2;

    if (password != password2) {
        res.send("<h1>Both passwords doesnt match!!</h1>")
    } else {
        connection.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [user, password, email], function (error, results, fields) {
            if (error){
                console.log(error);
            } else {
                console.log(results.solution);
                res.render('login')
            }
            
        });
    }

})



app.post('/studentdetails', (req, res) => {
    console.log(req.body)
    const name = req.body.name;
    const usn = req.body.usn;
    const phone_no = req.body.phoneno;
    const email_id = req.body.emailid;
    const address = req.body.address;
    const user_id = req.body.user_id;

    connection.query('INSERT INTO studentdetails (std_id, name, usn, phone_no, email_id, address) VALUES (?, ?, ?, ?, ?, ?)', [user_id, name, usn, phone_no, email_id, address], function (error, results) {
        if (error){
            console.log(error);
        } else {
            console.log(results);
            console.log("Insert Success!");
            res.render('department', {user_id: user_id})
        }
        
    });
})


app.post('/department', (req, res) => {
    const course = req.body.course;
    const user_id = req.body.user_id;
    console.log(req.body)
    connection.query('INSERT INTO department (std_id, dep_name) VALUES (?, ?)', [parseInt(user_id), course], function (error, results) {
        if (error){
            console.log(error);
        } else {
            console.log(results);
            console.log("Insert Success!");
            res.render('fee', {user_id: user_id})
        }
        
    });
})

app.post('/fee', (req, res) => {
    console.log(req.body);
    const user_id = req.body.user_id;
    const admission = req.body.admission;
    const amount = req.body.amtd;

    connection.query('INSERT INTO fee (std_id, admission, amount) VALUES (?, ?, ?)', [parseInt(user_id), admission, amount], function (error, results) {
        if (error){
            console.log(error);
        } else {
            console.log(results);
            console.log("Insert Success!");
        }
        
    });
})

app.get('/recipt', (req, res) => {
    console.log(req.query);
    const user_id = req.query.uid;
    connection.query('SELECT * FROM studentdetails WHERE std_id = ?', [user_id], function (error, results1) {
        if (error){
            console.log(error);
        } else {
            console.log("Results1",results1);
            connection.query('SELECT * FROM department WHERE std_id = ?', [user_id], function (error, results2) {
                if (error){
                    console.log(error);
                } else {
                    console.log("Results2",results2);
                    connection.query('SELECT * FROM fee WHERE std_id = ?', [user_id], function (error, results3) {
                        if (error){
                            console.log(error);
                        } else {
                            console.log("Results3",results3);
                            res.render('recipt', {user_id: user_id, std: results1, dep: results2, fee: results3});
                        }
                    });
                }
            });
        }
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})