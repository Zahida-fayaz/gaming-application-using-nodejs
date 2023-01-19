const express = require("express");
const app = express();
app.length("/", function(){
    res.send("welcome to our wensite");
};)


app.listen(3000, () => console.log("welcome here"));