//Olivia Moore, Olivia Gines, Eddie Rodriguez, Derek Johnson, Andrew Alley, Blake Robison 
//Section 4
//IS 303 Project 3
/*This project is a web application that promotes awareness of human trafficking. One one pages of the website displays a
table of data of victims in Utah. All data comes from a postgres database. This web app also uses the basic implementation of
CRUD, allowing the user to interact with the database.*/

const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3001; 

app.use(express.static(__dirname));

app.set("view engine", "ejs");

const knex = require(path.join(__dirname + '/knex/knex.js'));   

app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {      
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/about", (req, res) => {      
    res.sendFile(path.join(__dirname + '/about.html'));
});
                                                            //routes that navigate between pages of the website
app.get("/contact", (req, res) => {      
    res.sendFile(path.join(__dirname + '/contact.html'));
});

app.get("/blog", (req, res) => {      
    res.sendFile(path.join(__dirname + '/resume.html'));
});

app.get("/missingpersons", (req, res) => {
    knex.select().from("missing_persons").then(missing_persons => {         //gets data from database and passes it to missing_persons
        res.render("missingpersons", {pgtable : missing_persons});          //renders missingpersons ejs file
    });
});

app.post("/deleteEntry/:id" , (req , res) => {
    knex("missing_persons").where("record_number", req.params.id).del().then(() => {      // d tthis route deletes arecord in the databaseusing the primary key                                                    //        
        res.redirect("/missingpersons");
    }).catch(err =>{
        console.log(err);
        res.status(500)
    });
});

//renders the addIndividual ejs file
app.get("/addIndividual", (req,res) => { 
    res.render("addIndividual");
});

//stores all new data entered and stores a new record
app.post("/addIndividual", (req,res) => { 
    knex("missing_persons").insert({
        date_missing: req.body.date_missing,
        last_name: req.body.last_name.toUpperCase(),
        first_name: req.body.first_name.toUpperCase(),
        age_at_missing: parseInt(req.body.age_at_missing),
        city: req.body.city.toUpperCase(),
        state: req.body.state.toUpperCase(),
        gender: req.body.gender,
        race: req.body.race
    }).then(missing_persons => {
        res.redirect("/missingpersons");
    })
});
//route to edit ejs
app.get("/editEntry/:id", (req, res) => {
    knex("missing_persons").where("record_number", req.params.id).then(person => {
        res.render("editEntry", {person: person});
    });
});
//edit route to updata data
app.post("/editEntry", (req, res) => {
    knex("missing_persons").where("record_number", req.body.record_number).update({
        date_missing: req.body.date_missing,
        last_name: req.body.last_name.toUpperCase(),
        first_name: req.body.first_name.toUpperCase(),
        age_at_missing: req.body.age_at_missing,
        city: req.body.city.toUpperCase(),
        state: req.body.state.toUpperCase(),
        gender: req.body.gender,
        race: req.body.race
    }).then(() => {
        res.redirect("/missingpersons");
    });
});
//lets us know if the server is up
app.listen(port, () => console.log("Express App has started and server is listening!"));                   
