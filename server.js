var express = require('express');
var bodyParser = require('body-parser');
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

var app = express();

//app.use(require('connect-livereload')({ port: 35729 }));
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/',function(req,res){
    res.sendFile('/src/index.html');
});

app.get('/buildPDF', function(req, res){
    console.log('pdf to be getted');

    var html = fs.readFileSync(__dirname + '/src/index.html', 'utf8');
    pdf.create(html, options).toFile('./ticket2.pdf', function(err, result) {
        if (err) return console.log(err);
        console.log(result); // { filename: '/app/ticket2.pdf' }
        res.contentType("application/pdf").send(result);
    });
});

app.post('/buildPDF', function(req,res){
    console.log(req.body);
    console.log('pdf to be posted');

    wkhtmltopdf(req.body, { output: 'result.pdf' });

    res.status(200).send(__dirname + '/result.pdf', 'result.pdf');
});

app.listen(9000, function() {
    console.log("Listening on 9000");
});