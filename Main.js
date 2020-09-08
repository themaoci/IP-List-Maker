"use strict";
const fs = require('fs');
function createDir(file) {    
    let filePath = file.substr(0, file.lastIndexOf('/'));

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
}

function stringify(data, oneLiner = false) {
	if(oneLiner)
		return JSON.stringify(data);
    return JSON.stringify(data, null, "\t");
}

function parse(string) {
    return JSON.parse(string);
}

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

function write(file, data) {
	if(file.indexOf("/") != -1)
		createDir(file);
    fs.writeFileSync(file, stringify(data, true), 'utf8');
}
var ip_s = [];
var i = 0;
async function readLines(input, func) {
	return new Promise((resolve, reject) => {
		var remaining = '';

		  input.on('data', function(data) {
			console.log(i); i++;
			remaining += data.toString('utf8');
			var index = remaining.indexOf('\n');
			while (index > -1) {
			  var line = remaining.substring(0, index);
			  remaining = remaining.substring(index + 1);
			  func(line);
			  index = remaining.indexOf('\n');
			}
		  });

		  input.on('end', function() {
			if (remaining.length > 0) {
			  func(remaining);
			}
			resolve("done!")
		  });
	});
  
}

function func(data) {
	let newData = data.split(".");
	let IP_ = `${newData[0]}.${newData[1]}.${newData[2]}`;
	if(ip_s.indexOf(IP_) == -1){
		ip_s.push(IP_);
		//console.log('Added: ' + IP_);
	}
}
async function main(){
	let list = [];
	if(fs.existsSync("list.json"))
		list = parse(read("list.json"));
	if(list.length > 0)
		for(let ip of list){
			let newData = ip.split(".");
			let IP_ = `${newData[0]}.${newData[1]}.${newData[2]}`;
			if(ip_s.indexOf(IP_) == -1){
				ip_s.push(IP_);
				console.log(': ' + IP_);
			}
		}
	var input = fs.createReadStream('lines.txt');
	await readLines(input, func);
	console.log(`Added ${ip_s.length} IS's`);
	console.log("Saved to IP_LIST.json");
	write("IP_LIST.json", ip_s);
}

main();