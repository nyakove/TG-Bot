var search = require('youtube-search');
 
var opts = {
  maxResults: 10,
  key: 'AIzaSyAPE06HkAar4Cj751xJ0nGsVUwhj_sOSaY'
};
 
search('ивлеева', opts, function(err, results) {
  if(err) return console.log(err);
 
  console.dir(results);
});