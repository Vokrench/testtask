const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const log = require('./log.js');

let element;
let st = "";

process.on('uncaughtException', (err) => {
    log.fatal(err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    log.fatal(err);
    process.exit(1);
});

log.info('Starting script');

(async function parsing() {
    log.info('Starting parsing()');
    try {
        log.info('Creating browser');
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--disable-blink-features=AutomationControlled')).build();
        log.info('Browser created');
        try {
            let browsett = await driver.getCapabilities();
            log.info({settings: JSON.stringify(Object.fromEntries(browsett.map_))}, 'Browser settings');
            let winsett = await driver.executeScript(() => {
                const navigatorData = {};

                function circular(obj, stack = []) {
                    if (typeof obj === 'object' && obj !== null) {
                        if (stack.includes(obj)) {
                            return true;
                        }
                        stack.push(obj);
                        for (const key in obj) {
                            if (circular(obj[key], stack)) {
                                return true;
                            }
                        }
                        stack.pop();
                    }
                    return false;
                }

                for (const property in window.navigator) {
                    if (!circular(window.navigator[property])) {
                        navigatorData[property] = window.navigator[property];
                    }
                }
                return navigatorData;
            }).then(navigatorData => {
                return navigatorData;
            });
            log.info({settings: JSON.stringify(winsett)}, 'Window settings');
            log.info('Getting browser actions');
            const actions = driver.actions({bridge: true});
            log.info('Got browser actions');
            log.info('Loading nseindia.com');
            await driver.get('https://www.nseindia.com/');
            log.info('nseindia.com loaded');
            await driver.sleep(2000);
            log.info('Finding popup window');
            try {
                log.info('Getting popup window`s close button');
                element = driver.findElement(By.css("#myModal > div > div > div.modal-header > button"));
                log.info('Got popup window`s close button');
                await element.click();
                log.info('Popup window closed');
            } catch (err) {
                log.error(err);
            }
            log.info('Getting MARKET DATA button');
            element = driver.findElement(By.css("#link_2"));
            log.info('Got MARKET DATA button');
            log.info('Hovering to MARKET DATA button');
            await actions.move({duration: 1000, origin: element, x: 0, y: 0}).perform();
            log.info('Hovered to MARKET DATA button');
            log.info('Getting Pre-Open Market button');
            element = driver.findElement(By.css("#main_navbar > ul > li:nth-child(3) > div > div.container > div > div:nth-child(1) > ul > li:nth-child(1) > a"));
            log.info('Got Pre-Open Market button');
            await element.click();
            log.info('Clicked Pre-Open Market button');
            log.info('Redirecting to Pre-Open Market page');
            await driver.sleep(2000);
            log.info('Pre-Open Market loaded');
            log.info('Getting symbol + final price');
            for (var i = 1; i < 51; i++) {
                log.info('Getting symbol of ' + i + ' line');
                element = await driver.findElement(By.css("#livePreTable > tbody > tr:nth-child(" + i + ") > td:nth-child(2) > a")).getText();
                log.info('Got symbol of ' + i + ' line');
                st = st + element + ";";
                log.info('Getting final price of ' + i + ' line');
                element = await driver.findElement(By.css("#livePreTable > tbody > tr:nth-child(" + i + ") > td:nth-child(7)")).getText();
                log.info('Got final price of ' + i + ' line');
                st = st + element + "\n";
            }
            log.info('Got symbol + final price');
            log.info({data: st}, 'Exporting Pre-Open Makret table to data.csv');
            const writeStream = fs.createWriteStream('data.csv');
            writeStream.write(st);
            log.info('Pre-Open Makret table exported');
            log.info('Getting home button');
            element = driver.findElement(By.css("body > header > nav > div.container.top_logomenu > a"));
            log.info('Got home button');
            await element.click();
            log.info('Redirecting to home page');
            await driver.sleep(2000);
            log.info('Home page loaded');
            log.info('Finding popup window');
            try {
                log.info('Getting popup window`s close button');
                element = driver.findElement(By.css("#myModal > div > div > div.modal-header > button"));
                log.info('Got popup window`s close button');
                await element.click();
                log.info('Popup window closed');
            } catch (err) {
                log.error(err);
            }
            await driver.sleep(2000);
            log.info('Scrolling page');
            await driver.executeScript('scroll(0,50);');
            log.info('Page scrolled');
            log.info('Getting NIFTY BANK button');
            element = driver.findElement(By.css("#tabList_NIFTYBANK"));
            log.info('Got NIFTY BANK button');
            await element.click();
            log.info('Clicked NIFTY BANK button');
            await driver.sleep(2000);
            log.info('Getting View All button');
            element = driver.findElement(By.css("#tab4_gainers_loosers > div.link-wrap > a"));
            log.info('Got View All button');
            await element.click();
            log.info('Clicked View All button');
            await driver.sleep(2000);
            log.info('Getting NIFTY ALPHA 50 option');
            element = driver.findElement(By.css("#equitieStockSelect > optgroup:nth-child(4) > option:nth-child(7)"));
            log.info('Got NIFTY ALPHA 50 option');
            await element.click();
            log.info('Selected NIFTY ALPHA 50 option');
            await driver.sleep(2000);
            log.info('Scrolling page');
            await driver.executeScript('scroll(0,1000);');
            log.info('Page scrolled');
            await driver.sleep(2000);
            log.info('Closing browser');
            await driver.quit();
            log.info('Browser closed');
        } catch (err) {
            log.error(err);
            log.info('Closing browser');
            await driver.quit();
            log.info('Browser closed');
            process.exit(1);
        }
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing parsing()');
})();