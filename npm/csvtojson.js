const fs = require("fs");
	  glob = require("glob");
	  csvFile = 'src/data/data.csv';
	  jsonFile = 'src/data/data.json';

(csvtojson => {

	fs.writeFileSync(jsonFile, ''); //clear file

	const csv = fs.readFileSync(csvFile).toString(); //Convert csv file to string
	csv.replace(/^(\w*)?;/, '').replace(/\r/g, ''); //Remove de first word

	let arr = csv.split(/\n/), //For each new line create an item in array
		obj = {};
	
	arrProp = arr[0].split(';'); //Return an array of properties	
	arr.shift(); //Remove properties of array


	arr.forEach((line) => { 

		let key = line.split(';').shift(), //Return name of key (the first item from array)
			arrValues = line.split(';'); //Return values 

		arrValues.shift(); //Remove key (the first item from array) 

		obj[key] = {}; //obj.key 

		arrProp.map((property, index) => { //While have properties
			obj[key][property] = arrValues[index] //obj.key.property = value
		})		

	});

	const myJSON = JSON.stringify(obj, null, 2); //Convert object to json and indent it 

	fs.appendFileSync(jsonFile, myJSON) //Append converted csv content in json file

})();
