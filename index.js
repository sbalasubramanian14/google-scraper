const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const getGoogleNewsLinks = async (page) => {
    const links = await page.$$('a.l.lLrAF')
    let listedLinks = [];
    for (var i=0; i < links.length; i++) {
        let linkTextHandle = await links[i].getProperty('innerText');
        let linkText = await linkTextHandle.jsonValue();
        let hrefHandle = await links[i].getProperty('href');
        let linkHref = await hrefHandle.jsonValue();
        listedLinks.push({
            linkText: linkText,
            linkHref: linkHref
        })
    }
    return listedLinks;
}

const getGoogleTrendsLinks = async (page) => {
    const links = await page.$$('.summary-text')
    let listedLinks = [];
    for (var i=0; i < links.length; i++) {
        let $ = cheerio.load(await (await links[i].getProperty('innerHTML')).jsonValue());
        listedLinks.push({
            linkText: $('a').text(),
            linkHref: $('a').attr('href')
        })
    }
    return listedLinks;
}

const getGoogleNews = async (searchPhrases, sortByDate = true) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    let result = [];

    const sort = sortByDate == true? '&tbs=sbd:1' : '';

    for (var i=0; i < searchPhrases.length; i++) {
        await page.goto(`https://www.google.com/search?q=${escape(searchPhrases[i])}&tbm=nws${sort}`);
        let data = await getGoogleNewsLinks(page);
        result.push({
            searchPhrase: searchPhrases[i],
            results: data
        });
    }
    await browser.close();
    return result;
}

const translateStuff = async (searchPhrases, targetLanguage = 'en') => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    let result = [];

    for (var i=0; i < searchPhrases.length; i++) {
        await page.goto(`https://translate.google.com/#view=home&op=translate&sl=auto&tl=${targetLanguage}&text=${escape(searchPhrases[i])}`);
        await page.waitFor(500);
        let $ = cheerio.load(await page.content());
        result.push({
            searchPhrase: searchPhrases[i],
            result: $('span.tlid-translation').text()
        });
    }
    await browser.close();
    return result;
}

const getGoogleDailySearchTrends = async (geo = 'US') => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`https://trends.google.com/trends/trendingsearches/daily?geo=${geo}`);
    let result = await getGoogleTrendsLinks(page);
    await browser.close();
    return result;
}

module.exports = {getGoogleNews, translateStuff, getGoogleDailySearchTrends};