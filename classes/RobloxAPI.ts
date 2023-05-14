
import {HttpProxyAgent } from 'http-proxy-agent';
import fetch from "node-fetch";
import { DataBase } from "./DataBase";
import fs from "fs";
//item
import { Item } from "./Item";

//const proxies = ["104.239.92.159:6799", "104.239.98.77:6108", "38.170.163.94:8150", "38.154.195.175:9263", "91.246.195.174:6943", "104.143.245.184:6424", "107.175.119.12:6540", "185.245.25.154:6415", "206.41.174.248:6203", "104.238.20.69:5691", "161.123.154.189:6719", "206.41.169.85:5665", "45.192.156.38:6709", "109.207.130.148:8155", "45.170.13.160:8186", "64.137.75.22:5942", "134.73.70.82:6326", "184.174.46.214:5843", "191.102.158.244:8308", "104.239.81.69:6604", "104.250.201.196:6741", "107.179.26.192:6262", "154.85.126.81:5088", "104.143.229.32:5960", "185.242.94.26:6111", "45.67.2.160:5734", "64.43.89.203:6462", "104.239.80.62:5640", "185.102.49.209:6547", "104.238.37.118:6675", "154.85.126.110:5117", "157.52.212.247:6150", "154.92.123.172:5510", "104.232.209.173:6131", "45.192.152.253:6191", "104.239.108.90:6325", "161.123.33.232:6255", "5.157.130.251:8255", "109.196.163.219:6317", "104.148.0.2:5357", "103.75.228.141:6220", "198.46.161.12:5062", "45.43.190.254:6772", "103.37.181.22:6678", "107.175.119.196:6724", "38.154.204.124:8165", "45.131.102.137:5789", "45.224.229.113:9178", "64.137.88.243:6482", "104.239.97.100:5853", "109.196.160.236:5982", "216.19.206.195:6173", "154.92.121.96:5115", "104.239.38.244:6777", "45.131.94.81:6068", "140.99.87.173:8419", "38.153.136.75:5098", "119.42.36.243:6143", "38.170.175.13:5682", "38.154.194.56:9469", "69.88.137.18:7104", "45.43.177.29:6357", "161.123.215.117:6728", "198.23.239.84:6490", "2.56.178.72:5112", "104.239.105.40:6570", "64.137.60.46:5110", "104.238.38.74:6342", "140.99.86.156:8266", "38.154.197.145:6811", "45.41.178.212:6433", "109.196.161.39:6487", "154.92.116.16:6328", "161.123.152.214:6459", "38.153.136.1:5024", "161.123.115.236:5257", "45.192.134.160:6481", "64.137.31.8:6622", "45.131.102.251:5903", "5.157.131.128:8388", "103.101.88.108:5832", "104.239.43.177:5905", "206.41.172.180:6740", "45.43.167.148:6330", "45.141.80.12:5738", "45.192.147.234:5882", "95.164.233.58:5416", "188.68.1.238:6107", "200.0.61.46:6121", "107.179.114.215:5988", "45.127.250.62:5671", "192.3.48.173:6166", "45.192.157.168:6295", "104.239.104.106:6330", "104.144.78.86:9131", "104.239.80.97:5675", "104.239.3.191:6151", "154.73.249.244:6823", "104.239.78.84:6029", "161.123.209.121:6621"]
export class RobloxAPI
{
    private static async fetchData(url: string, options: any, body: any): Promise<any>
    {
        // const proxyAgent = new HttpProxyAgent("http://" + this.getProxy());
        const response = await fetch(url, { ...options, body: body});
        const json = await response.json();
        return json;
    }
    private static async userPresence(userId: string[])
    {
        const url = "https://presence.roblox.com/v1/presence/users";
        const options = { 
            method: "POST",
            'Cookie': '.ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_277A2ADCC6821D6609D1F897412F8F0641E85ADC71A1FCAD7057CF15FD5630B6FE7A119DADF1C8641893C30C910BE42ECF4C205C7986A12A5FC5DB394A97B0873356BCF03042CC76717611FC88B9359D10FB3DA78CFB6AF06F4833B5E63D46D93F5F27BFBF6B52C0D146E6D2C891D64CCEA866B5793BF166A7DBB3BA292FB0BC62A1331929A214982E0D169CC53E0B2CA2D86229C020E3BEEF27D5A1B0BD7BB9BCD09619198504F057C709DA2BBB62731D3176757E7B91147956D06ADB490447C52965B7C3DA462B6C69415DFD9B7C2AFAF9720FD160D31AD21B61B95AF06833E480D19B7D12EF299CAD33CBDBCC4F9CFB314025AE1195BF5A34687E7A29239538D4BD3FAA41E3066B335B20F38B83488FFACB611A4146DE59F9C42603167E55D1BE29E01AACBCB2897218E40477FA9B1B104CEF2CAB8BB7DD15BC7B5CAA172CC881F21D2CA432BBF3D9A5F86574A35183DED9D7EC02BA357172F9173683608D8702BE56',
            'accept': 'application/json',
            'content-type': 'application/json'
        };
        const body = JSON.stringify({
            userIds: userId
        });
        const response = await this.fetchData(url, options, body);
        return response;

        
    }

    public static async getOnline(asset_id: string): Promise<string[]>
    {
        //get the item from database with Database.getAllUsersWithItem
        const users = await DataBase.getAllUsersWithItem(asset_id);
        //split into chunks of 100
        const chunks = this.chunkArray(users, 25);
        //create an array of promises
        const promises = [];
        for(let i = 0; i < chunks.length; i++)
        {
            promises.push(this.userPresence(chunks[i]));
        }
        //await all promises
        const results = await Promise.all(promises);
        //filter back all that dont have a userPresenceType of 2
        //push the ENTIRE userPresence array to the filteredResults array if they have a userPresenceType of 2
        const filteredResults = [];
        for(let i = 0; i < results.length; i++)
        {
            //if the response is an erorr, skip it
            if(results[i].errors != null) continue;
            for(let j = 0; j < results[i].userPresences.length; j++)
            {
                if(results[i].userPresences[j].userPresenceType == 2 && results[i].userPresences[j].placeId != null && results[i].userPresences[j].lastLocation != null)
                {
                    filteredResults.push(results[i].userPresences[j]);
                }
            }
        }
        const userFriendlyResults = this.userFriendlyResults(filteredResults);
        return userFriendlyResults.toString().split(",");
    }

    private static chunkArray(myArray: any[], chunk_size: number){
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
    // private static getProxy() : string
    // {
    //     const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    //     return proxy;
    // }
    private static userFriendlyResults(filtered: any[])
    {
        const results = [];
        //iterate through results and
        //Remove any ones with "null" place id
        //Remove any ones with "null" last location
        //give a simple user friendly result user profile link, place name, and last location
        for(let i = 0; i < filtered.length; i++)
        {
            if(filtered[i].placeId == null || filtered[i].lastLocation == null) continue;
            results.push({
                "userProfile": `https://www.roblox.com/users/${filtered[i].userId}/profile`,
                "placeName": filtered[i].place.name,
                "lastLocation": filtered[i].lastLocation
            });
        }
        console.log(results);
        return results;
    }
}

