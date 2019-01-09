const https = require('https');
const fs = require("fs");

const options = {
    hostname: 'www.google.com',
    path: '/search?q=pepe+the+frog+rare&newwindow=1&hl=ru&tbm=isch&source=lnt&tbs=isz:l&sa=X&ved=0ahUKEwiS7NW-rN7fAhUiM-wKHZ7aBg8QpwUIHw&biw=1440&bih=789&dpr=1',
    method: 'GET',
};

https.get(options, (res) => {
    res.setEncoding('binary');
    let chunks = [];

    res.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk, 'binary'));
    });

    res.on('end', () => {
        let binary = Buffer.concat(chunks);
        // binary is now a Buffer that can be used as Uint8Array or as
        // any other TypedArray for data processing in NodeJS or 
        // passed on via the Buffer to something else.

        let htmlPage = binary.toString('ascii');
        //console.log(htmlPage);

        fs.writeFile('test.html', htmlPage, function () {
            console.log('test write file')
        });

        let arr = htmlPage.match(/https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[\w-]{63,64}/g);

        console.log('Картинок найдено: ' + arr.length);

        for (i of arr) {
            console.log(i);
        }

    });
});
