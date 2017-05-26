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
						destFile = output + bannerType + '/' + campaign + '/index.html'; 
				
				//Copy unchanged files
				copydir.sync(src + bannerType, output + bannerType + '/' + campaign); 				

				//Create banner and campaign folders
				if (!fs.existsSync(output + bannerType + '/' + campaign)) {
				 	fs.mkdirSync(output + bannerType + '/' + campaign);
				}

				//Create img folder if src doesn`t contain 'http'
				if(data[campaign].src.indexOf('http') === -1) {

					//Create img folder					
					if (!fs.existsSync(output + bannerType + '/' + campaign + '/img/')) {						
						fs.mkdirSync(output + bannerType + '/' + campaign + '/img/'); 
					}


					//Copy img src if it exists in object
					if(fs.existsSync('src/assets/' + bannerType + '/' + data[campaign].src)) { //If img exists in folder						
							fs.writeFileSync(output + bannerType + '/' + campaign + '/' + 'img/' + data[campaign].src, 
							fs.readFileSync('src/assets/' + bannerType + '/' + data[campaign].src));
					}

					if(data[campaign].src.indexOf('img/') === -1) {
						data[campaign].src = 'img/' +  data[campaign].src;
					}		
				}					

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
