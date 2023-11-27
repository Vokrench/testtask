const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
let element;
let st = "";

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, ms);
    });
}

(async function parsing() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--disable-blink-features=AutomationControlled')).build();
    const actions = driver.actions({bridge: true});
    await driver.get('https://www.nseindia.com/');
    await delay(2000);
    try {
        element = driver.findElement(By.xpath("//*[@id=\"myModal\"]/div/div/div[1]/button")); // проверка на кнопку
        await element.click();
    } catch (e) {

    }
    element = driver.findElement(By.xpath("//*[@id=\"link_2\"]"));
    await actions.move({duration: 1000, origin: element, x: 0, y: 0}).perform();
    element = driver.findElement(By.xpath("//*[@id=\"main_navbar\"]/ul/li[3]/div/div[1]/div/div[1]/ul/li[1]/a"));
    await element.click();
    await delay(2000);
    for (var i = 1; i < 51; i++) {
        element = await driver.findElement(By.xpath("//*[@id=\"livePreTable\"]/tbody/tr[" + i + "]/td[2]/a")).getText();
        st = st + element + ";";
        element = await driver.findElement(By.xpath("//*[@id=\"livePreTable\"]/tbody/tr[" + i + "]/td[7]")).getText();
        st = st + element + "\n";
    }
    const writeStream = fs.createWriteStream('data.csv');
    writeStream.write(st);
    element = driver.findElement(By.xpath("/html/body/header/nav/div[1]/a"));
    await element.click();
    await delay(2000);
    element = driver.findElement(By.xpath("//*[@id=\"myModal\"]/div/div/div[1]/button"));
    await element.click();
    await delay(2000);
    try {
        element = driver.findElement(By.xpath("//*[@id=\"myModal\"]/div/div/div[1]/button")); // проверка на кнопку
        await element.click();
    } catch (e) {

    }
    await delay(2000);
    await driver.executeScript('scroll(0,50);');
    element = driver.findElement(By.xpath("//*[@id=\"tabList_NIFTYBANK\"]"));
    await element.click();
    await delay(2000);
    element = driver.findElement(By.xpath("//*[@id=\"tab4_gainers_loosers\"]/div[3]/a"));
    await element.click();
    await delay(2000);
    element = driver.findElement(By.xpath("//*[@id=\"equitieStockSelect\"]/optgroup[4]/option[7]"));
    await element.click();
    await delay(2000);
    await driver.executeScript('scroll(0,1000);');
    await delay(2000);
    await driver.quit();
})();