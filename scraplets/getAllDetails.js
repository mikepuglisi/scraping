const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const timeoutPromise = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const waitTwoSeconds = async () => await timeoutPromise(10000);


const getDetails = async (page, url) => {
    await page.goto(url);
    await page.waitFor('script[data-hypernova-key="spaspabundlejs"]');
    // await waitTwoSeconds();
    const jsonData = await page.evaluate(() => {

        const jsonRaw = document.querySelector('script[data-hypernova-key="spaspabundlejs"]').innerHTML.replace('<!--', '').replace('-->', '')
        // console.log('jsonRaw', jsonRaw)
       // console.log(JSON.parse(jsonRaw))
        return jsonRaw;
    });
    await fs.writeFile(`./output/listing_${url.split('/').pop()}.json`, jsonData);
    return jsonData;
};

module.exports = async (listingUrls) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    
    const getDetailFunctions = listingUrls.map((url) => {
        return getDetails(page, url);
    })
    const results = await Promise.all(getDetailFunctions)
    // console.log(results.length)
    // fs.writeFile('./output/listings.json', results, () => {});
   // console.log(results)
   
    browser.close();
    return results;    
}