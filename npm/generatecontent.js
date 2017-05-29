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

		 //Array of template folders
		folder.forEach(function(bannerType) {

			var templateFile = bannerType + '/' + '/index.html', //Every file of every template folder 
				file = fs.readFileSync(templateFile).toString(), //convert every file to string     
				template = handlebars.compile(file); //set its own data

			for(var campaign in data) {

				var src = 'src/templates/',
					output = 'output/templates/',
					bannerType = bannerType.replace(src, ''),
					destFile = output + campaign + '/' + bannerType + '/index.html'; //Dest file to get content
				
				//Copy unchanged files
				copydir.sync(src + bannerType, output + campaign + '/' + bannerType);               

				//Create banner and campaign folders
				if (!fs.existsSync(output + campaign + '/' + bannerType)) {
					fs.mkdirSync(output + campaign + '/' + bannerType);
				}
				//Create img folder                 
				if (!fs.existsSync(output + campaign + '/' + bannerType + '/img/')) {                       
					fs.mkdirSync(output + campaign + '/' + bannerType + '/img/'); 
				}

				//Copy img
				function copySync(src, dest) {
					if (!fs.existsSync(src)) {
						return false;
					}
					var data = fs.readFileSync(src, 'utf-8');
					fs.writeFileSync(dest, data);
				}

				copySync('src/assets/' + campaign +'/' + bannerType + '/*', output + campaign +'/' + bannerType + '/' + 'img/')

				
				//Clear dest file
				fs.writeFile(destFile, '');

				//Set data
				var content = template(data[campaign]); 

				fs.appendFile(destFile, content, function(error) {
					(error) ? console.error("Error") : console.log("Successful Write to " + destFile);      
				}); 
			}

		}); 
	});
})();
