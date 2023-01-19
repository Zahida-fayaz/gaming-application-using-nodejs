
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const { stringify } = require("querystring");
//const request = require("request");


//connecting to database
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://zahida:zahida@test.kgff3hf.mongodb.net/test")
.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.log("you did something wrong, database not connected");
    console.log(err);

});

//creating database scheme
var gameSchema = new mongoose.Schema({
    title: String,
    creator: String,
    width: Number,
    height: Number,
    fileName: String,
    thumbnailFile: String
});

//adding data to database
var Game = mongoose.model("Game", gameSchema);

/*
Game.create({
    title: "continuity",
    creator: "turboNuke",
    width: 640,
    height: 480,
    fileName: "continuity.swf",
    thumbnailFile: "screenshot-cyclomaniacs-2-game.jpg"

}, function(error, data){
    if(error){
        console.log("there was a problem while adding a document to the collection.");
        console.log(error);
    }else{
        console.log("data added to the collection");
        console.log(data);
    }
});

//searching data from database
Game.find({}, function(error, data){ 
    if(error){
       console.log("there is a problem while finding the data");

    }else{
        console.log("Here is our data that we are searching");
        console.log(data);
    } 
});

const games = [
    {
        title: "continuity",
        creator: "turboNuke",
        width: 640,
        height: 480,
        fileName: "continuity.swf",
        thumbnailFile: "screenshot-cyclomaniacs-2-game.jpg"
    },
    {
        title: "elona", 
        creator: "PyschoGoldfish",
        width: 640,
        height: 480,
        fileName: "elona.swf",
        thumbnailFile: "run3.jgg"
    },
    {
        title: "Learn to Fly 2", 
        creator: "light_bringer777",
        width: 640,
        height: 480,
        fileName: "learntofly2.swf",
        thumbnailFile: "Learn_To_Fly_2.jpg"
    },
    {
        title: "Super_Fighters", 
        creator: "dampgnat",
        width: 750,
        height: 650,
        fileName: "Super_Fighters.swf",
        thumbnailFile: "superfighters-2-games.jpg"
    }
]  */



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(fileUpload());

app.set("view engine", "ejs");

app.get("/", function(req, res){
 res.render("homepage");
});


app.get("/playgames/:id", function(req, res){
    var id = req.params.id;

    Game.findById(id, function(error, foundGame){
        if(error){
            console.log("couldnot find the game with this id");
        }else{
            res.render("playgames", {
                title: foundGame.title,
                creator: foundGame.creator,
                width: foundGame.width,
                height: foundGame.height,
                fileName: foundGame.fileName
            });
               
        }
    });
        
});


app.get("/playgames/edit/:id", function(req, res){
    var id = req.params.id;

    Game.findById(id, function(error, foundGame){
        if(error){
            console.log("couldnot find the game with this id");
        }else{
            res.render("edit", {
                title: foundGame.title,
                creator: foundGame.creator,
                width: foundGame.width,
                height: foundGame.height,
            });
               
        }
    });
        
});


//update route
app.post("/update/:id", function(req, res){
    var id = req.params.id;
    Game.findByIdAndUpdate(id, {
        title: req.body.title,
        creator: req.body.creator,
        width: req.body.width,
        height: req.body.height
    }, function(err, updatedGame){
        if(err){
            console.log("can't update");
            console.log(error);
        }else{
            res.redirect("/glist");
            console.log("file updated successfully");
        }
    });
  
});

//delete route
app.get("/playgames/delete/:id", function(req, res){
    var id = req.params.id;
    Game.findByIdAndDelete(id, function(error){
        if(error){
            console.log("can't delete a file");
            console.log(error);
        }else{
            console.log("deleted successfully");
        }
    });
});




/*app.get("/game12/:gameTitle/:gameCreator", function(req, res){
	
	const title = req.params.gameTitle;
	const creator = req.params.gameCreator;
 
	res.render("game", {
		title: title,
		creator: creator,
		
	});
}); */


//gamelst  route
app.get("/glist", function(req, res){
    Game.find({}, function(error, games){
        if(error){
            console.log("there was a problem while retrieving games from the database");
            console.log(error);
        }else{
            
                res.render("glist", {
                gamesList: games
            });   

        } 
  
	
 
    });
});
 
//add games route
app.get("/addgame", function(req, res){
    res.render("addgame");

});

app.post("/addgame", function(req, res){
    var data = req.body;
    var gameFile = req.files.gameFiles;
    var imageFile = req.files.imageFiles;

    gameFile.mv("public/games/" + gameFile.name, function(error){
        if(error){
            console.log("could not upload the game file");
            console.log(error);
        }else{
            console.lof("game file uploaded successfully");
        }
    });

    imageFile.mv("public/thumbnails/" + imageFile.name, function(error){
        if(error){
            console.log("could not upload the image file");
            console.log(error);
        }else{
            console.lof("game file uploaded successfully");
        }
    });

    Game.create({
        title: data.title,
        creator: data.creator,
        width: data.width,
        height: data.height,
        fileName: gameFile.name,
        thumbnailFile: imageFile.name

    }, function(error, data){
        if(error){
            console.log("there was a problem while addding this game to the database");

        }else{
            console.log("game added sucessfully to the database");
            console.log("data");
        }
    });
    res.redirect("/glist");

});



/*request("http://www.google.com", function(error, response, body){
	if(error){
		console.log("an error was found");
	}else{
		console.log(body);
		console.log(response.statusCode);
	}
});


request("https://query.yahooapis.com/v1/public/yql?q=select%20wind%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22chicago%2C%20il%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(error, response, body){
	if(error){
		console.log("an error was found");
	}else{
		var data = JSON.parse(body);

		console.log(data.query.results.channel.item.condition.text.created);
		//console.log(response.statusCode);
	}
});
app.get("/pics, function(req, res"{
	 request("https://api.unsplash.com/photos?", function(error, response, body){
	      if(error){
		      console.log("an error was found");
	    }else{
			res.render("pictures",{
				picData:JSON.parse(body),
				pageNumber: 1
			});
		}
    });

});


app.get("/search", function(req, res){
	res.render("search");
}); */


app.listen("3000", function(){
	console.log("here is my website");
});