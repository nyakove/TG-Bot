const fs = require("fs");
const gis = require('g-i-s');
var searchOpts = {
  searchTerm: 'shiba+inu',
  queryStringAddition: '&biw=1440&bih=789'
};
gis(searchOpts, logResults);

function logResults(error, results) {
    if (error) {
        console.log(error);
    } else {
        //console.log(JSON.stringify(results, null, '  '));

        fs.writeFile('test.txt', JSON.stringify(results), function () {
            console.log('Saved!')
        });

        for (i of results) {
            console.log(i.width)
        }
        
        //console.log(results);
    }
}
