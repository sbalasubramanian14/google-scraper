# Google Data Scraper

Google Data Scraper is a node based scraping tool built using puppeteer and cheerio libraries. 

Currently it supports 
* Google News 
* Google Trends
* Google Translate

Upcoming - Multipage scraping

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
    searchPhrase: string;
    results: {
        linkText: string;
        linkHref: string;
    }[];
}[]>
```
#### getGoogleDailySearchTrends
* Accepts a geo location string (for example, United states - 'US')
* Returns a promise
```
Promise<{
    linkText: string;
    linkHref: string;
}[]>
```

#### translateStuff
* Accepts array of strings to translate and target language code as string.
* Please refer https://ctrlq.org/code/19899-google-translate-languages target language codes
* Returns a promise
```
Promise<{
    searchPhrase: string;
    result: string;
}[]>
```

## Examples
```
const scraper = require("google-data-scraper");

scraper.getGoogleNews(["AI", "mars"])
    .then((data) => {
        console.log(JSON.stringify(data));
    })

scraper.translateStuff(['omae wa mou shindeiru', 'Nani?'],'en')
    .then((data) => {
        console.log(JSON.stringify(data));
    })

scraper.getGoogleDailySearchTrends('US')
    .then((data)=>{
        console.log(JSON.stringify(data));
    })
```

## Built With

* [Puppeteer](https://www.npmjs.com/package/puppeteer)
* [Cheerio](https://www.npmjs.com/package/cheerio)

## Authors

* **Balasubramanian** - [git](https://github.com/sbalasubramanian14)

## License

This project is licensed under the MIT License