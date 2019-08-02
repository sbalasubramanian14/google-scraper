# Google Data Scraper

Google Data Scraper is a node based scraping tool built on top of puppeteer library. Currently it supports google news scraping. 

## Getting Started

```
npm install google-data-scraper --save
```

## Usage

#### getGoogleNews 
* Accepts array of strings to search and boolean to specify whether to sort by date of not
* Returns a promise 
```
Promise<{
    searchPhrase: any;
    results: {
        linkText: any;
        linkHref: any;
    }[];
}[]>
```

#### How to use
```
const scraper = require("google-data-scraper");

scraper.getGoogleNews(["AI", "USA"])
    .then((data) => {
        console.log(JSON.stringify(data));
    })
```

## Built With

* [Puppeteer](https://www.npmjs.com/package/puppeteer)

## Authors

* **Balasubramanian** - [git/bala](https://github.com/sbalasubramanian14)

## License

This project is licensed under the ISC License