import fetch from 'node-fetch';
import fs from 'fs';
import {HttpsProxyAgent} from 'https-proxy-agent';
import log from './log.js';

let fin = "";

process.on('uncaughtException', (err) => {
    log.fatal(err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    log.fatal(err);
    process.exit(1);
});

log.info('Starting script');

async function twoipreq() {
    log.info('Starting twoipreq()');
    try {
        log.info('Sending request to 2ip.ru');
        let response = await fetch("https://2ip.ru/", {
            "method": "GET"
        });
        log.info({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.raw()
        }, 'Response');
        response = await response.text();
        return response;
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing twoipreq()');
}

async function getcsrftokenandcookie() {
    log.info('Starting getcsrftokenandcookie()');
    try {
        log.info('Sending request to maxmind.com(get csrf & cookie)');
        let response = await fetch("https://www.maxmind.com/en/geoip2-precision-demo", {
            agent: new HttpsProxyAgent("http://vokrench0InvC:4i33n2Y6oS@45.156.45.89:50100"),
            "method": "GET"
        });
        log.info({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.raw()
        }, 'Response');
        let arr = [];
        arr[0] = response.headers.get("Set-Cookie");
        response = await response.text();
        arr[1] = response.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?X_CSRF_TOKEN = "/g, '').replace(/";<.*?html>/g, '');
        return arr;
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing getcsrftokenandcookie()');
}


async function gettoken() {
    log.info('Starting gettoken()');
    try {
        log.info('Calling getcsrftokenandcookie()');
        let csrftokenandcookie = await getcsrftokenandcookie();
        log.info('Get response from getcsrftokenandcookie()');
        log.info('Sending request to maxmind.com(get token)');
        let response = await fetch("https://www.maxmind.com/en/geoip2/demo/token", {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8",
                "X-Csrf-Token": csrftokenandcookie[1],
                "Cookie": csrftokenandcookie[0]
            },
            agent: new HttpsProxyAgent("http://vokrench0InvC:4i33n2Y6oS@45.156.45.89:50100"),
            "body": null,
            "method": "POST"
        });
        log.info({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.raw()
        }, 'Response');
        response = await response.json();
        return response;
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing gettoken()');
}

async function geoipreq(ip) {
    log.info('Starting geoipreq(ip)');
    try {
        log.info('Calling gettoken()');
        let token = await gettoken();
        log.info('Get response from gettoken()');
        log.info('Sending request to maxmind.com(get geo info)');
        let response = await fetch("https://geoip.maxmind.com/geoip/v2.1/city/" + ip + "?demo=1", {
            "headers": {
                "Authorization": "Bearer " + token.token
            },
            agent: new HttpsProxyAgent("http://vokrench0InvC:4i33n2Y6oS@45.156.45.89:50100"),
            "method": "GET"
        });
        log.info({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.raw()
        }, 'Response');
        response = await response.json();
        return response;
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing geoipreq(ip)');
}

async function regionlistreq() {
    log.info('Starting regionlistreq()');
    try {
        log.info('Sending request to gist.github.com');
        let response = await fetch("https://gist.github.com/salkar/19df1918ee2aed6669e2", {
            "method": "GET"
        });
        log.info({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.raw()
        }, 'Response');
        response = await response.text();
        return response;
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing regionlistreq()');
}

(async function main() {
    log.info('Starting main()');
    try {
        log.info('Calling twoipreq()');
        let responsetwoip = await twoipreq();
        log.info('Get response from twoipreq()');
        responsetwoip = responsetwoip.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?1><div class="ip" id="d_clip_button"><span>/g, '').replace(/<.*?html>/g, '');
        log.info('Calling geoipreq(responsetwoip)');
        let responsegeoip = await geoipreq(responsetwoip);
        log.info('Get response from geoipreq(responsetwoip)');
        if (responsegeoip.city !== undefined) {
            log.info('City available');
            let timezone = responsegeoip.city.names.en;
            log.info({city: timezone}, 'City');
            timezone = responsegeoip.continent.names.en + "/" + timezone;
            log.info({timezone: timezone}, 'Timezone');
            log.info('Calling regionlistreq()');
            let responseregionlist = await regionlistreq();
            log.info('Get response from regionlistreq()');
            responseregionlist = responseregionlist.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?="Timezones for Russian regions">/g, '').replace(/able><.*?html>/g, '').replace(/<tr><td.*?js-file-line">/g, '').replace(/<.*?>/g, '').replace(/<.*?t/g, '').replace(/&quot;/g, '"');
            responseregionlist = JSON.parse(responseregionlist);
            log.info({regions: responseregionlist}, 'Region list');
            for (var i = 0; i < responseregionlist.length; i++) {
                if (timezone === responseregionlist[i][1]) {
                    fin = fin + responseregionlist[i][0] + "; ";
                }
            }
            fin = timezone + "\n" + fin;
            log.info({result: fin}, 'Result text');
            fs.writeFileSync('result.txt', fin);
            log.info('Export result to result.txt');
        } else {
            log.info('City unavailable');
            let timezone = responsegeoip.continent.names.en;
            fin = timezone;
            log.info({timezone: timezone}, 'Timezone');
            fs.writeFileSync('result.txt', fin);
            log.info('Export result to result.txt');
        }
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
    log.info('Finishing main()');
})();