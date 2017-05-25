var fs = require("fs");
var glob = require("glob");
var mkdir = require("mkdirp");
var copydir = require('copy-dir');
var path = require('path');
var dataFile = 'src/data/data.json';
var templateFile = 'src/templates/masterhead/index.hbs';
var handlebars = require('handlebars');




(function path() {

	var file = fs.readFileSync(templateFile).toString(),
		data = JSON.parse(fs.readFileSync(dataFile)),
		template = handlebars.compile(file);		

		for(var prop in data) {
			// console.log('Chaves', prop, 'Prop', data[prop]); //Chaves

			var destFile = 'output/templates/' + prop + '/index.html';

			if (!fs.existsSync('output/templates/' + prop)){
			    fs.mkdirSync('output/templates/' + prop);
			}

			fs.writeFile(destFile, '');

			var result = template(data[prop]);

			// copydir.sync('src/templates/', 'output/templates');

			fs.appendFile(destFile, result, function(error) {
				(error) ? console.error("Error") : console.log("Successful Write to " + destFile);		
			});	
		}	

})();
