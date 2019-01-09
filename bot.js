const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '797549937:AAEhhivwySoe_d6vquYXh85KoNqyxj3ujvI';
let botOptions = {
    polling: true
};
let bot = new TelegramBot(TOKEN, botOptions);

bot.on('text', function (msg) {
    var messageChatId = msg.chat.id;
    var messageText = msg.text;

    if (messageText === '/start') {
        bot.sendMessage(messageChatId, 'Hello there! For more info, input /help');
    }

    if (messageText == '/help' || messageText == '/help' || messageText.indexOf('/help') != -1) {
        bot.sendMessage(messageChatId, 'Для получения картинки по запросу введите \'/IMG ваш запрос\'. Чтобы перевести гривны в другую валюту по курсу НБУ на текущий день, введите команду \'/convert сумма код валюты\', где сумма - целое число в гривне, код валюты - трехсимвольная аббревиатура, например EUR для евро, USD для доллара');
        return;
    }

    if (!isNaN(messageText)) {
        bot.sendMessage(messageChatId, messageText * 2);
    }

    if (messageText.indexOf('/convert') == 0) {
        var sum = parseInt(messageText.replace(/\D+/g, ""));
        var currency = messageText.slice(-3).toUpperCase();
        var list = ['AUD', 'CAD', 'CNY', 'HRK', 'CZK', 'DKK', 'HKD', 'HUF', 'INR', 'IDR', 'IRR', 'ILS', 'JPY', 'KZT', 'KRW', 'MXN', 'MDL', 'NZD', 'NOK', 'RUB', 'SAR', 'SGD', 'ZAR', 'SEK', 'CHF', 'EGP', 'GBP', 'USD', 'BYN', 'AZN', 'RON', 'TRY', 'XDR', 'BGN', 'EUR', 'PLN', 'DZD', 'BDT', 'AMD', 'IQD', 'KGS', 'LBP', 'LYD', 'MYR', 'MAD', 'PKR', 'VND', 'THB', 'AED', 'TND', 'UZS', 'TWD', 'TMT', 'GHS', 'RSD', 'TJS', 'GEL', 'XAU', 'XAG', 'XPT', 'XPD'];

        if (!list.some(elem => elem == currency)) {
            bot.sendMessage(messageChatId, 'Валюта не найдена или неправильный формат запроса. Повторите запрос.');
            return;
        }

        console.log(sum);
        console.log(currency);


        if (isNaN(sum) == true) {
            bot.sendMessage(messageChatId, 'Ошибка при вводе, проверьте синтаксис');
            return;
        }

        const https = require('https');

        const options = {
            hostname: 'bank.gov.ua',
            path: '/NBUStatService/v1/statdirectory/exchange?json',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);

            res.on('data', (d) => {
                let resp = JSON.parse(d);
                //console.log(resp);
                let list = [];
                for (i of resp) {
                    if (i.cc == currency) {
                        var result = sum / i.rate;
                        var respExchange = 'Согласно курсу НБУ на ' + i.exchangedate + ', ' + '₴' + sum + ' вы можете обменять на ' + result.toFixed(2) + ' ' + i.cc;
                        bot.sendMessage(messageChatId, respExchange);
                    }
                }

                console.log(respExchange);
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });

        req.end();
    }

    if (messageText.indexOf('/img') == 0) {

        const https = require('https');

        const opt = {
            hostname: 'www.google.com',
            path: '/search?q=benis&newwindow=1&hl=ru&tbm=isch&source=lnt&tbs=isz:l&sa=X&ved=0ahUKEwiS7NW-rN7fAhUiM-wKHZ7aBg8QpwUIHw&biw=1440&bih=789&dpr=1',
            method: 'GET',
        };

        https.get(opt, (rst) => {
            rst.setEncoding('binary');
            let chunks = [];

            rst.on('data', (chunk) => {
                chunks.push(Buffer.from(chunk, 'binary'));
            });

            rst.on('end', () => {
                let binary = Buffer.concat(chunks);

                let htmlPage = binary.toString('ascii');

                let arr = htmlPage.match(/https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[\w-]{63,64}/g);
                console.log('Search successful');
                let imageURL = (Math.random() * (arr.length - 2)).toFixed();
                console.log(imageURL);
                console.log(arr[imageURL]);
                bot.sendPhoto(messageChatId, arr[imageURL]);

            });
        });
    }

    if (messageText.indexOf('/IMG') == 0 && messageText.length > 5) {
        const gis = require('g-i-s');
        var searchQuery = messageText.slice(5).replace(/\s/g, '+')

        var searchOpts = {
            searchTerm: searchQuery,
            queryStringAddition: '&biw=1440&bih=789'
        };

        gis(searchOpts, logResults);

        function logResults(error, results) {
            if (error) {
                console.log(error);
                bot.sendMessage(messageChatId, 'Ой, что-то пошло не так. Повторите запрос');
            } else {
                let imgURL = Math.floor(Math.random() * (40 - 1)) + 1;
                bot.sendPhoto(messageChatId, results[imgURL].url);
                console.log(messageChatId + ' ' + messageText.slice(5));
            }
        }
    }

    if (messageText.indexOf('/VIDEO') == 0 && messageText.length > 7) {

        let videoQuery = messageText.slice(7);

        var videoOpts = {
            maxResults: 10,
            key: 'AIzaSyAPE06HkAar4Cj751xJ0nGsVUwhj_sOSaY'
        };

        let videoSearch = require('youtube-search');

        videoSearch(videoQuery, videoOpts, function (err, results) {
            if (err) return console.log(err);
            let videoURL = 'https://youtu.be/' + results[Math.floor(Math.random() * (10 - 1)) + 1].id;
            bot.sendMessage(messageChatId, videoURL);
            console.log(videoQuery + ' ' + videoURL);
        });
    }

});

let exchange = (sum, currency) => {
    const https = require('https');

    const options = {
        hostname: 'bank.gov.ua',
        path: '/NBUStatService/v1/statdirectory/exchange?date=20190107&json',
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        //console.log('headers:', res.headers);

        res.on('data', (d) => {
            let resp = JSON.parse(d);

            for (i of resp) {
                if (i.cc == currency) {
                    var result = sum / i.rate;
                    var respExchange = 'За ' + sum + ' UAH вы можете купить ' + result + ' ' + i.cc;
                    //bot.sendMessage(messageChatId, respExchange);
                    console.log(respExchange);
                }
            }

            //console.log(respExchange);

        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.end();

}
