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

				//Create img folder

				if(data[campaign].src.indexOf('http') === -1) {
					console.log('NAO TEM HTTP') 

					//Create img folder

					if (!fs.existsSync(output + bannerType + '/' + campaign + '/img/')) {
						console.log('NAO TEM PASTA') 
						fs.mkdirSync(output + bannerType + '/' + campaign + '/img/'); 
						console.log('CRIOU PASTA') 
					}

					//Copy img src

					var img = 'img/' + data[campaign].src;

					if('src/assets/' + bannerType + '/' + data[campaign].src) {
						console.log('EXSITE A IMAGEM NO OBJETO')
						fs.writeFileSync(output + bannerType + '/' + campaign + '/' + img, 
						fs.readFileSync('src/assets/' + bannerType + '/' + data[campaign].src));
					} 
			
				}		
				

				//Clear dest file
				fs.writeFile(destFile, ''); 


				//Set data
				var content = template(data[campaign]);
								

				fs.appendFile(destFile, content, function(error) {
					// (error) ? console.error("Error") : console.log("Successful Write to " + destFile);		
				});	
			}

		});	
	});
})();
