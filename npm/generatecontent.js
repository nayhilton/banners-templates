var fs = require("fs");
var glob = require("glob");
var mkdir = require("mkdirp");
var copydir = require('copy-dir');
var path = require('path');
var dataFile = 'src/data/data.json';
var handlebars = require('handlebars');

(function path() {
	var data = JSON.parse(fs.readFileSync(dataFile));

	glob("src/templates/*", function (er, folder) { //Get all templates

		var templateFolders = folder; //Array of template folders

		templateFolders.forEach(function(item) {

			var templateFile = item + '/' + '/index.html', //Every file of every template folder 
			file = fs.readFileSync(templateFile).toString(), //convert every file to string		
			template = handlebars.compile(file); //set its own data

			for(var prop in data) {

				var bannerType = item.replace('src/templates/', '');

				console.log('bannerType', bannerType);

				copydir.sync('src/templates/masterhead', 'output/templates/' + bannerType + '/' + prop); //Copy unchanged files

				var destFile = 'output/templates/' + bannerType + '/' + prop + '/index.html'; 

				(!fs.existsSync('output/templates/' + bannerType + '/' + prop)) ? fs.mkdirSync('output/templates/' + item + '/' + prop) : '';

				fs.writeFile(destFile, ''); //Clear dest file

				var result = template(data[prop]); //Set data

				fs.appendFile(destFile, result, function(error) {
					(error) ? console.error("Error") : console.log("Successful Write to " + destFile);		
				});	
			}

		});	
	});
})();
