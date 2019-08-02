const puppeteer = require('puppeteer');

const getLinks = async (page) => {
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
        let data = await getLinks(page);
        result.push({
            searchPhrase: searchPhrases[i],
            results: data
        });
    }
    await browser.close();
    return result;
}

module.exports = {getGoogleNews};
