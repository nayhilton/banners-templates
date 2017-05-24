var fs = require("fs");
var glob = require("glob");
var csvFile = 'src/data/data.csv';
var jsonFile = 'src/data/data.json';

(function path() {
	var contentCsvFile = fs.readFileSync(csvFile).toString();

	fs.writeFile(jsonFile, ''); //clear file

	var csv = contentCsvFile.replace(/^(\w*)?;/, '').replace(/\r/g, ''),
		arraytotal = csv.split(/\n/), //All lines of csv
		arrayProp = arraytotal[0].split(';'); //Filter just Objct Properties

	arraytotal.shift(); //Remove properties

	var obj = {}; 

	arraytotal.forEach(function(line) {

		var key = line.split(';').shift(), //Object Name
			arrayValues = line.split(';'); //Object Values

		arrayValues.shift(); //Remove Object Name

		obj[key] = {}; //obj.key 

		arrayProp.map(function(item, index){
			obj[key][item] = arrayValues[index] //obj.key.property = value
		})		

	});

	var myJSON = JSON.stringify(obj, null, 2);

	fs.appendFile(jsonFile, myJSON, function(error) {
		(error) ? console.error("Error") : console.log("Successful Write to " + jsonFile);		
	});	

})();
