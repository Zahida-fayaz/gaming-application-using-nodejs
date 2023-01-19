const express = require("express");
const app = express();
const catMe = require('cat-me');
const lodash = require("lodash");

console.log(lodash.add(2, 3));
console .log(catMe());

app.get("/hello", function(req, res){
	res.send("hello";)
});

app.listen(8000, function(){
	console.log("sever has started listing  on port no 3000");
});