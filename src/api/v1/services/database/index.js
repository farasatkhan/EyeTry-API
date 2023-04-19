var mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost:27017/eyetry')
.then(() => console.log("Database Connected."))
.catch((err) => console.log(err));