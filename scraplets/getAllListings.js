const puppeteer = require('puppeteer');

const getListingUrlsOnPage = async (page) => {
    const listingUrls = await page.evaluate(() => {
        let listingLinks = [...document.querySelectorAll('a[href^="/rooms/show/"]')].map((hotelelement) => {
            return hotelelement.href;
            // let hotelJson = {};
            // try {
            //     hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
            //     hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
            //     hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
            //     if(hotelelement.querySelector('strong.price')){
            //         hotelJson.price = hotelelement.querySelector('strong.price').innerText;
            //     }
            // }
            // catch (exception){

            // }
        });
        return listingLinks;
    });
    return listingUrls;
};

module.exports = async (listingsParentPageUrl) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(listingsParentPageUrl);
    const listingUrls = await getListingUrlsOnPage(page);
    await Promise.all([
        // waitTwoSeconds(),
        page.click('li[data-id="page-2"] button'),
        //page.waitForRequest(request => request.url().match('https://www.airbnb.com/api/v2/user_promo_listings')),
        //waitTwoSeconds()
        page.waitFor('button[aria-label="Page 2, current page"]'),
    ]);  
    const listingUrls2 = await getListingUrlsOnPage(page);
    return [ ...listingUrls, ...listingUrls2 ];    
}