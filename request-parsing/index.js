import fetch from 'node-fetch';
import fs from 'fs';
import {HttpsProxyAgent} from 'https-proxy-agent';
let fin = "";

async function twoipreq() {
    let response = await fetch("https://2ip.ru/", {
        "method": "GET"
    });
    response = await response.text();
    return response;
}

async function getcsrftokenandcookie() {
    let response = await fetch("https://www.maxmind.com/en/geoip2-precision-demo", {
        agent: new HttpsProxyAgent("http://vokrench0InvC:4i33n2Y6oS@45.156.45.89:50100"),
        "method": "GET"
    });
    let arr = [];
    arr[0] = response.headers.get("Set-Cookie");
    response = await response.text();
    arr[1] = response.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?X_CSRF_TOKEN = "/g, '').replace(/";<.*?html>/g, '');
    return arr;
}


async function gettoken() {
    let csrftokenandcookie = await getcsrftokenandcookie();
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
    response = await response.json();
    return response;
}

async function geoipreq(ip) {
    let token = await gettoken();
    let response = await fetch("https://geoip.maxmind.com/geoip/v2.1/city/"+ ip +"?demo=1", {
        "headers": {
            "Authorization": "Bearer " + token.token
        },
        agent: new HttpsProxyAgent("http://vokrench0InvC:4i33n2Y6oS@45.156.45.89:50100"),
        "method": "GET"
    });
    response = await response.json();
    return response;
}

async function regionlistreq() {
    let response = await fetch("https://gist.github.com/salkar/19df1918ee2aed6669e2", {
        "method": "GET"
    });
    response = await response.text();
    return response;
}

(async function main() {
    let responsetwoip = await twoipreq();
    responsetwoip = responsetwoip.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?1><div class="ip" id="d_clip_button"><span>/g, '').replace(/<.*?html>/g, '');
    let responsegeoip = await geoipreq(responsetwoip);
    if (responsegeoip.city !== undefined) {
        let timezone = responsegeoip.city.names.en;
        timezone = responsegeoip.continent.names.en + "/" + timezone;
        let responseregionlist = await regionlistreq();
        responseregionlist = responseregionlist.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, '').replace(/<!DOCTYPE html>.*?="Timezones for Russian regions">/g, '').replace(/able><.*?html>/g, '').replace(/<tr><td.*?js-file-line">/g, '').replace(/<.*?>/g, '').replace(/<.*?t/g, '').replace(/&quot;/g, '"');
        responseregionlist = JSON.parse(responseregionlist);
        for (var i = 0; i < responseregionlist.length; i++) {
            if (timezone === responseregionlist[i][1]) {
                fin = fin + responseregionlist[i][0] + "; ";
            }
        }
        fin = timezone + "\n" + fin;
        fs.writeFileSync('result.txt', fin);
    } else {
        let timezone = responsegeoip.continent.names.en;
        fin = timezone;
        fs.writeFileSync('result.txt', fin);
    }
    console.log('Выполнено');
})();
