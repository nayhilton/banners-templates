var fs = require("fs");
var glob = require("glob");
var copydir = require('copy-dir');
var path = require('path');
var dataFile = 'src/data/data.json';
var templateFile = 'src/templates/masterhead/index.hbs';
var destFile = 'src/templates/masterhead/index.html';
var handlebars = require('handlebars');


(function path() {

	var file = fs.readFileSync(templateFile).toString(),
		data = JSON.parse(fs.readFileSync(dataFile)),
		template = handlebars.compile(file);

		fs.writeFile(destFile, ' ');

		for(var prop in data) {
			console.log('Chaves', prop); //Chaves
			console.log('Prop', data[prop]); //Prop

			var result = template(data[prop]);

			fs.appendFile(destFile, result, function(error) {
				(error) ? console.error("Error") : console.log("Successful Write to " + destFile);		
			});	
		}

	

})();
