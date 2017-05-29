const	fs = require('fs-extra'),
		glob = require("glob"),
		mkdir = require("mkdirp"),
		copydir = require('copy-dir'),
		path = require('path'),
		handlebars = require('handlebars'),
		dataFile = 'src/data/data.json',		
		data = JSON.parse(fs.readFileSync(dataFile)), //ok
		srcTemplates = 'src/templates/',
		srcAssets = 'src/assets/',
		output = 'output/templates/';

(function structure() {

	glob(srcTemplates + "/*", function (er, arrBannerType) { //Get array of all templates (bannerType folders)

		arrBannerType.forEach(function(bannerType) {

			const templateFile = path.join(bannerType, '/index.html'); //Every index file of every template folder 
				file = fs.readFileSync(templateFile).toString(), //convert every file to string     
				template = handlebars.compile(file); //set its own data

			for(var campaign in data) {
				var outputStructure = path.join(output, campaign, bannerType);
					bannerType = bannerType.replace(srcTemplates, ''),
					destFile = outputStructure + '/index.html'; //Dest file to get content
					imgPath = path.join(outputStructure, 'img/');

			(function createOutputStructure() {					
				copydir.sync(srcTemplates + bannerType, outputStructure); //Copy unchanged files          
				!fs.existsSync(outputStructure) ? fs.mkdirSync(outputStructure) : 'error';
				!fs.existsSync(imgPath) ? fs.mkdirSync(imgPath) : 'error'; //Create img folder 
				fs.copySync(path.join(srcAssets, campaign, bannerType), imgPath);			

			})();

			(function appendContent() {				
				fs.writeFileSync(destFile, '');	//clear file			
				var content = template(data[campaign]); //Set data
				fs.appendFileSync(destFile, content); //Append Data
			})();				
			}
		}); 
	});
})();
