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
const fetch_with_proxy_1 = __importDefault(require("fetch-with-proxy"));
//db, items
const DataBase_1 = require("./DataBase");
const proxies = ["104.239.92.159:6799", "104.239.98.77:6108", "38.170.163.94:8150", "38.154.195.175:9263", "91.246.195.174:6943", "104.143.245.184:6424", "107.175.119.12:6540", "185.245.25.154:6415", "206.41.174.248:6203", "104.238.20.69:5691", "161.123.154.189:6719", "206.41.169.85:5665", "45.192.156.38:6709", "109.207.130.148:8155", "45.170.13.160:8186", "64.137.75.22:5942", "134.73.70.82:6326", "184.174.46.214:5843", "191.102.158.244:8308", "104.239.81.69:6604", "104.250.201.196:6741", "107.179.26.192:6262", "154.85.126.81:5088", "104.143.229.32:5960", "185.242.94.26:6111", "45.67.2.160:5734", "64.43.89.203:6462", "104.239.80.62:5640", "185.102.49.209:6547", "104.238.37.118:6675", "154.85.126.110:5117", "157.52.212.247:6150", "154.92.123.172:5510", "104.232.209.173:6131", "45.192.152.253:6191", "104.239.108.90:6325", "161.123.33.232:6255", "5.157.130.251:8255", "109.196.163.219:6317", "104.148.0.2:5357", "103.75.228.141:6220", "198.46.161.12:5062", "45.43.190.254:6772", "103.37.181.22:6678", "107.175.119.196:6724", "38.154.204.124:8165", "45.131.102.137:5789", "45.224.229.113:9178", "64.137.88.243:6482", "104.239.97.100:5853", "109.196.160.236:5982", "216.19.206.195:6173", "154.92.121.96:5115", "104.239.38.244:6777", "45.131.94.81:6068", "140.99.87.173:8419", "38.153.136.75:5098", "119.42.36.243:6143", "38.170.175.13:5682", "38.154.194.56:9469", "69.88.137.18:7104", "45.43.177.29:6357", "161.123.215.117:6728", "198.23.239.84:6490", "2.56.178.72:5112", "104.239.105.40:6570", "64.137.60.46:5110", "104.238.38.74:6342", "140.99.86.156:8266", "38.154.197.145:6811", "45.41.178.212:6433", "109.196.161.39:6487", "154.92.116.16:6328", "161.123.152.214:6459", "38.153.136.1:5024", "161.123.115.236:5257", "45.192.134.160:6481", "64.137.31.8:6622", "45.131.102.251:5903", "5.157.131.128:8388", "103.101.88.108:5832", "104.239.43.177:5905", "206.41.172.180:6740", "45.43.167.148:6330", "45.141.80.12:5738", "45.192.147.234:5882", "95.164.233.58:5416", "188.68.1.238:6107", "200.0.61.46:6121", "107.179.114.215:5988", "45.127.250.62:5671", "192.3.48.173:6166", "45.192.157.168:6295", "104.239.104.106:6330", "104.144.78.86:9131", "104.239.80.97:5675", "104.239.3.191:6151", "154.73.249.244:6823", "104.239.78.84:6029", "161.123.209.121:6621"];
class RobloxAPI {
    static fetchData(url, options, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const proxy = this.getProxy();
            const agent = new http_proxy_agent_1.HttpProxyAgent("http://" + proxy.ip + ":" + proxy.port);
            options.agent = agent;
            options.body = body;
            const response = yield (0, fetch_with_proxy_1.default)(url, options);
            return response;
        });
    }
    static userPresence(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://presence.roblox.com/v1/presence/users";
            const options = {
                method: "POST",
                'Cookie': '.ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_875EE3DBC80BCAF86FEB1495E7127B1AAE20361EF8FA4AE5AB84C1243B8C58F14646D0B6B2FEFBF456AA402682FEE225F45DB73248F08B0CBE1FA5B968594250071B546585BB57978D43574A83805A1732C3906A6AE09E1EE2D1AD7E31F003D6161428346281CFA8F81DB32068EFA8EBFC2A2AE45045A37827C186861992F7456908C3EFD51ADCF7F9304DDE9CAD5A21836B980F3173E470C5A721E110852FE154EFC4F02CE052317579793C44BDEB648AB55BDD2D327DCE305F3CC96CCDFB8917F7139475F3AC7367A3F5E83ED8D21634807A7974C4B8841D2F4FCF1476C87671F7031E1874882CCAB27D8CBBB700A73D4BA8D92A153A61BF483A0565B03612100A5E3BF0C2D84C965414987C3D5CBDF0727698909A6CFB4923E85B8F744100396BAC23E0EC3F3764022BFDFEA8E7450BE517220105182E904BE1468359CDDC0238CFA6AC7CA7BE947DF9B8F6C681761CB867D29C64E7E6B2F34206738059F17CFCD19E0E4E98E8CFB413741C2D85D685043C9FF04C72A87119963D26E98247C91F6330',
                'accept': 'application/json',
                'content-type': 'application/json'
            };
            const body = JSON.stringify({
                userIds: userId
            });
            const response = yield this.fetchData(url, options, body);
            const json = JSON.parse(response.body);
            return json;
        });
    }
    static getOnline(asset_id) {
        return __awaiter(this, void 0, void 0, function* () {
            //get the item from database with Database.getAllUsersWithItem
            const users = yield DataBase_1.DataBase.getAllUsersWithItem(asset_id);
            //split into chunks of 100
            const chunks = this.chunkArray(users, 100);
            //create an array of promises
            const promises = [];
            for (let i = 0; i < chunks.length; i++) {
                promises.push(this.userPresence(chunks[i]));
            }
            //await all promises
            const results = yield Promise.all(promises);
            //filter back all that dont have a userPresenceType of 2
            const filtered = [];
            for (let i = 0; i < results.length; i++) {
                const data = results[i].data;
                for (let j = 0; j < data.length; j++) {
                    if (data[j].userPresenceType == 2) {
                        filtered.push(data[j].userPresenceType);
                    }
                }
            }
            //return the filtered array
            return filtered;
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
        //split into ip and port
        const split = proxy.split(":");
        return { ip: split[0], port: Number(split[1]) };
    }
}
exports.RobloxAPI = RobloxAPI;
