const groupBy = require('lodash.groupby');
const moment = require('moment');

const fileList = [
    {
        id: 0,
        file:
        {
            fileName: 'Screenshot (7).png',
            createdAt: "2020 - 05 - 04T06: 15: 37.302Z"
        }
    },
    
    {
        id: 1,
        file:
        {
            fileName: 'Ratetable.PNG',
            createdAt: "2020 - 05 - 03T06: 34: 17.003Z"
        }
    },
    {
        id: 2,
        file:
        {
            fileName: 'hacker1.PNG',
            createdAt: "2020 - 05 - 03T06: 34: 17.002Z"
        }
    },
    {
        id: 3,
        file:
        {
            fileName: 'CurrencyDetails.PNG',
            createdAt: "2020 - 05 - 03T06: 34: 17.001Z"
        }
    },
    {
        id: 4,
        file:
        {
            fileName: 'MainPage.PNG',
            createdAt: "2020 - 05 - 03T06: 34: 17.003Z"
        }
    },
    {
        id: 5,
        file:
        {
            fileName: 'Screenshot (6).png',
            createdAt: "2020 - 05 - 02T06: 15: 37.302Z"
        }
    }
    
]

let groupedResults = groupBy(fileList, (result) => moment(result.file['createdAt'], 'YYYY-MM-DD').startOf('date').format('DD MMM YYYY'));
let dates =  Object.keys(groupedResults)
dates.forEach(element => {
    console.log(groupedResults[element].map(f => f.file));
});


 
"scripts": {
    "start": "npm install && node server.js",
    "heroku-postbuild": "cd client && npm install --only=dev && npm install && npm run build"
  },
"scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },