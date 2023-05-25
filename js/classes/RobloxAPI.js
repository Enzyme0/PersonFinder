"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobloxAPI = void 0;
const http_proxy_agent_1 = require("http-proxy-agent");
const node_fetch_1 = __importDefault(require("node-fetch"));
const DataBase_1 = require("./DataBase");
//import * from "noblox.js" as noblox;
//noblox
const noblox_js_1 = __importDefault(require("noblox.js"));
const fs_1 = __importDefault(require("fs"));
const proxies = ["37.19.221.235:8595", "45.86.63.177:6245", "104.168.25.187:5869", "168.181.228.164:6589"];
class RobloxAPI {
    static fetchData(url, options, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const proxyAgent = new http_proxy_agent_1.HttpProxyAgent("http://" + this.getProxy());
            const response = yield (0, node_fetch_1.default)(url, Object.assign(Object.assign({ proxyAgent }, options), { body: body }));
            const json = yield response.json();
            //check for errors
            return json;
        });
    }
    fetchNoProxy(url, options, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(url, Object.assign(Object.assign({}, options), { body: body }));
            const json = yield response.json();
            //check for errors
            return json;
        });
    }
    static getCookie() {
        return "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_2E550C6CC25254A76E92393C02669F372F3E3F3EEACF7991677DC4E073887CB37053596F9752019C03DEE4D5DC0F4FDA9CB4188FFC0ECE6187E45AC41E20031AB7F7A7110117B760DACC01BBD62D67AE5472234DC993475AC4C04DBF715AC43067DAF80637A5BDFF1BDD6B90A9BC2E6894399C541F9D1685BD11D660AAAFE02580CA277B276C45DBF1F5898E9215E906E2C99CA7573AC7B7151CF37C35A135C60756D98470847D7AE97E49FE2A7CBD970B1E5ACC262126F12CC216DB3150A04187D95CB42048FCA9C18A78D646308A430AE895445086EB2EF52A2884980B8731CCD341FA4306A93C78C63C39D5A0288B5ECB42ABCF2C2EC97531802ED3B30DEB32765CA47752843DB9200EA68310834BBB7873A9848A290BE762E310BE30583CC6AF93280000EB7C930DF03714330A1B2B7E0E7C8D4E8554ED477A238E7A7736E38524C93FFD428B746FD890C27F23A650046ADB88C9F41444B9EE38EB8ACA59E6C09F5363E0E1120E2CB034662C11C0CB71990EAD4CC924812E39657C911ED94EBA305742377D607F4AAD4C6C9846CDDD5BC23E";
    }
    static userPresence(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://presence.roblox.com/v1/presence/users";
            const options = {
                method: "POST",
                'Cookie': this.getCookie(),
                'accept': 'application/json',
                'content-type': 'application/json'
            };
            const body = JSON.stringify({
                userIds: userId
            });
            const response = yield this.fetchData(url, options, body);
            return response;
        });
    }
    static getOnline(asset_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield noblox_js_1.default.setCookie(RobloxAPI.getCookie());
            //get the item from database with Database.getAllUsersWithItem
            const users = yield DataBase_1.DataBase.getAllUsersWithItem(asset_id);
            //remove invalid users using db.removeInvalids
            const validUsers = yield DataBase_1.DataBase.removeInvalids(users);
            //remove the first 10 (superstitious)
            validUsers.splice(0, 10);
            //get the userids from the valid users
            const userIds = [];
            //pick a random 100 users from the valid users
            let randomUsers = validUsers.sort(() => Math.random() - Math.random()).slice(0, 49);
            //get the user presences from the userids
            const results = (yield noblox_js_1.default.getPresences(validUsers)).userPresences;
            fs_1.default.writeFileSync("results.json", JSON.stringify(results));
            //return the presences
            return results;
        });
    }
    static chunkArray(myArray, chunk_size) {
        let index = 0;
        const arrayLength = myArray.length;
        let tempArray = [];
        //console.log(myArray);
        for (index = 0; index < arrayLength; index += chunk_size) {
            const myChunk = myArray.slice(index, index + chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }
        return tempArray;
    }
    static getProxy() {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)];
        return proxy;
    }
    static userFriendlyResults(filtered) {
        const results = [];
        //iterate through results and
        //Remove any ones with "null" place id
        //Remove any ones with "null" last location
        //give a simple user friendly result user profile link, place name, and last location
        for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].placeId == null || filtered[i].lastLocation == null)
                continue;
            results.push({
                "userProfile": `https://www.roblox.com/users/${filtered[i].userId}/profile`,
                "placeName": filtered[i].place.name,
                "lastLocation": filtered[i].lastLocation
            });
        }
        console.log(results);
        return results;
    }
    static users(userIds) {
        if (userIds.length > 100)
            throw new Error("Maximum of 100 users per request");
        //turn userids into int
        const url = "https://users.roblox.com/v1/users";
        const options = {
            method: "POST",
            'Cookie': '.ROBLOSECURITY=' + this.getCookie(),
            'accept': 'application/json',
            'content-type': 'application/json'
        };
        const body = JSON.stringify({
            userIds: userIds
        });
        return this.fetchData(url, options, body);
    }
}
exports.RobloxAPI = RobloxAPI;
