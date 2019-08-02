const puppeteer = require('puppeteer');

function getText(linkText) {
    linkText = linkText.replace(/\r\n|\r/g, "\n");
    linkText = linkText.replace(/\ +/g, " ");
  
    // Replace &nbsp; with a space 
    var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    return linkText.replace(nbspPattern, " ");
  }

async function findByLink(page, linkString) {
    const links = await page.$$('a.q.qs')
    console.log(links);
    for (var i=0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty('innerText');
      let linkText = await valueHandle.jsonValue();
      const text = getText(linkText);
      if (linkString == text) {
        console.log(linkString);
        console.log(text);
        console.log("Found");
        return links[i];
      }
    }
    return null;
  }

  async function getLinks(page) {
      const links = await page.$$('a.l.lLrAF')
      for (var i=0; i < links.length; i++) {
        let linkTextHandle = await links[i].getProperty('innerText');
        let linkText = await linkTextHandle.jsonValue();
        console.log(linkText);
        let hrefHandle = await links[i].getProperty('href');
        let hrefLink = await hrefHandle.jsonValue();
        console.log(hrefLink)
      }
  }

const scrapeGoogle = async (searchPhrase) => {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list'
        ]
    });
    
    const page = await browser.newPage();
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    console.log("new page created");
    await page.setViewport({width:1366,height:768});
    await page.goto(`https://www.google.com/search?q=${searchPhrase}`);
         
    await findByLink(page, "News")
        .then(async (links) => {
            console.log(links);
            await links.click();
            await page.waitForNavigation();
            
        });
    // await page.evaluate(() => {
    //     //let elements = document.getElementById('hdtb-msb-vis');//.getElementsByClassName('q qs');
    //     const elements = [...document.querySelectorAll('a')];
    //     console.log(elements);
    // })
    await getLinks(page)
        .then(async () => {

        })
        await page.screenshot({path: 'screenshot1.png', fullPage: true});
    // await page.focus('#lst-ib');
    // await page.keyboard.type('DC');
    const input = await page.$('#lst-ib');
    await input.click({clickCount: 3});
    await input.type("DC");
    await page.keyboard.press('Enter');
    //await (await page.$('input[type="text"]')).press('Enter'); // Enter Key
    // const inputElement = await page.$('input[type=submit]');
    // await inputElement.click();
    await page.waitForNavigation();
    await getLinks(page)
        .then(async () => {

        })
    await page.screenshot({path: 'screenshot2.png', fullPage: true});
    await browser.close();
}

scrapeGoogle('Marvel');
