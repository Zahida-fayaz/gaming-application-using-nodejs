const express = require("express");
const app = express();

app.get("*", function(req, res){
	res.send("error");

});

app.get("/", function(req, res){
	res.send("welcome to our website");

});
app.get("/hello", function(req, res){
	res.send("hello how r u!!!!");
});

app.listen("8080", function(){
	console.log("hii")
});