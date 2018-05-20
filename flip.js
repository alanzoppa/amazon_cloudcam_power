const puppeteer = require('puppeteer'); 

async function flip(shouldBePrivate)  {
    //const browser = await puppeteer.launch({executablePath: "chromium-browser"});
    //const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    let token = "";


    page.on('request', request => {
        if (request.url().match(/amazonpmi/)) {
            let tmpToken = request.headers()['x-amz-access-token']; 
            if (tmpToken != undefined) {
                token = tmpToken;
            } 
        }
    }); 

    await page.goto('http://cloudcam.amazon.com/', {waitUntil: 'networkidle2'});




    await page.$('.sign-in-btn');
    await page.click('.sign-in-btn');

    await page.waitFor(500);



    await page.$('#ap_email');
    await page.click('#ap_email');




    await page.keyboard.type(process.env.AMAZON_EMAIL)
    await page.click('#ap_password');
    await page.keyboard.type(process.env.AMAZON_PASSWORD)
    await page.click('#signInSubmit');
    await page.waitForNavigation(); 

    await page.waitFor(1000);

    function resWithToken(token, value) {
        return `fetch('https://piefs-pimms.amazonpmi.com/v1/devices/G070LJ1775030BA2?deviceType=A3SA7EC7BKYY63', {
                method: 'PATCH',
                body: JSON.stringify( {"patchOperationList":[{"operation":"REPLACE","path":"privacyModeEnabled","value":{"privacyModeEnabled":${value}}}]} ), 
                headers: new Headers({
                        'Content-Type': 'text/plain;charset=UTF-8', 
                        'Accept-Encoding': 'gzip, deflate, br',
                        'x-amz-access-token': '${token}'
                    }) 
            })` 
    } 

    await page.evaluate( resWithToken(token, shouldBePrivate) )
    await browser.close();

}

export default flip;
