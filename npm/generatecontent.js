const	fs = require('fs-extra'),
			glob = require("glob"),
			mkdir = require("mkdirp"),
			copydir = require('copy-dir'),
			path = require('path'),
			handlebars = require('handlebars'),
			data = JSON.parse(fs.readFileSync('src/data/data.json')),
			srcTemplates = 'src/templates/',
			srcAssets = 'src/assets/',
			output = 'output/templates/';

(structure => {
	glob(srcTemplates + "/*", (er, arrBannerType) => { //Get array of all templates (bannerType folders)

		arrBannerType.forEach((templates) => {

			const templateFile = path.join(templates, '/index.html'); //Every index file of every template folder 
						file = fs.readFileSync(templateFile).toString(), //convert every file to string     
						template = handlebars.compile(file); //set its own data

			for(var campaign in data) {

				const bannerType = templates.replace(srcTemplates, ''), //Just name of template
							outputStructure = path.join(output, campaign, bannerType), //Structure of output folder							
							destFile = outputStructure + '/index.html', //Dest file to get content
							imgPath = path.join(outputStructure, 'img/'); //img path

				(createOutputStructure => {					
					copydir.sync(srcTemplates + bannerType, outputStructure); //Copy unchanged files   
					!fs.existsSync(outputStructure) ? fs.mkdirSync(outputStructure) : 'error'; //Create output folder's structure
					!fs.existsSync(imgPath) ? fs.mkdirSync(imgPath) : 'error'; //Create img folder 
					fs.copySync(path.join(srcAssets, campaign, bannerType), imgPath); //Copy img src to img output
				})();

				(appendContent =>{				
					fs.writeFileSync(destFile, '');	//clear file			
					let content = template(data[campaign]); //Set data
					fs.appendFileSync(destFile, content); //Append Data
				})();				
			}
		}); 
	});
})();
