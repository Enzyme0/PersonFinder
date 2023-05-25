
import {HttpProxyAgent } from 'http-proxy-agent';
import fetch from "node-fetch";
import { DataBase } from "./DataBase";
//import * from "noblox.js" as noblox;
//noblox
import noblox, { UserPresence } from "noblox.js";
import fs from "fs";
//item
import { Item } from "./Item";




const proxies = ["37.19.221.235:8595", "45.86.63.177:6245", "104.168.25.187:5869", "168.181.228.164:6589"]

export class RobloxAPI

{
    
    public static async fetchData(url: string, options: any, body: any): Promise<any>
    {
        const proxyAgent = new HttpProxyAgent("http://" + this.getProxy());
        const response = await fetch(url, { proxyAgent, ...options, body: body});
        const json = await response.json();
        //check for errors
        return json;
    }
    public async fetchNoProxy(url: string, options: any, body: any): Promise<any>
    {
        const response = await fetch(url, { ...options, body: body});
        const json = await response.json();
        //check for errors
        return json;
    }
    public static getCookie()
    {
        return "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_DB33B5EDEE06860BC0B2A268221D9443F3FF93A5FC31B442727EDEEBFF4AD5368F5EFFD741B1F1C8F556B0ED60C667F7EC73FD4D814689071C6EC7296130A34BDC1A6D83A6B7426BE60C451DF6DCC054A8361467539E9E366E39AA1605A6CF5F85CDDA38BD1F8E290E3FA59227E2EF3B74A3D771AC2B9E3B775A32634DF6588C959A31FA0FD3248DDF5CF684C70E09B63CD1EAD47AC3C98A8187B6A3CB69CC1740E71C856C312AB608296FBC50C797A717986E5152984C513AA143DC98A14B05ECEFFBCB47EC912C21A9AA3D7BFC27E6292022FDDD868E72E5CDBD9482FCCA148CE8A161E3D92EC69D67420A3143AC316B3E4146CFA8C0992FBFB7B63100C4CF590495396E16849CBEA5D86B98B49DDCDDE6673248A947E3F855284535B4888220C69F077D301978B9152568F1758F14E8E63631D1A2C284739BA1DEF8997AE0D6D3D088289B0EBECCAA31167D4AC7BE40C2C71E";
    }
    private static async userPresence(userId: string[]) : Promise<UserPresence[]>
    {
        const url = "https://presence.roblox.com/v1/presence/users";
        const options = {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": await this.getxcrsf(),
                "Cookie": ".ROBLOSECURITY=" + this.getCookie() + "",
                "Content-Type": "application/json"
            }
        }
        const body = JSON.stringify({
            userIds: userId
        });
        const response = await this.fetchData(url, options, body);
        return response;

    }

    public static async getxcrsf()
    {
        //login
        await noblox.setCookie(this.getCookie());
        return noblox.getGeneralToken();
    }
    public static async getOnline(asset_id: string): Promise<UserPresence[]>
    {
        await noblox.setCookie(RobloxAPI.getCookie());
        //get the item from database with Database.getAllUsersWithItem
        const users = await DataBase.getAllUsersWithItem(asset_id);
        //remove invalid users using db.removeInvalids
        const validUsers = await DataBase.removeInvalids(users);
        //remove the first 10 (superstitious)
        validUsers.splice(0, 10);
        //get the userids from the valid users
        const userIds = [];
        for(let i = 0; i < validUsers.length; i++)
        {
            userIds.push(validUsers[i]);
        }
        //chunk userids into 100s
        const chunks : any[] = this.chunkArray(userIds, 100);
        //run chunked userids through userPresence
        let results : any[] = [];
        for(let i = 0; i < chunks.length; i++)
        {
            results.push(this.userPresence(chunks[i]));
        }

        //get the presences for each chunk
        //promise.all the presences
        results = await Promise.all(results);
        let dupe : any[] = [];
        for(let i = 0; i < results.length; i++)
    {
        console.log(results[i])
        for(let j = 0; j < results[i].userPresences.length; j++)
            {   
                console.log(results[i].length)
            results = results[i].userPresences[j]
            dupe.push(results)
            }
    }
        //turn the results into a single array using .concat
        /*
        var merged = test2d.reduce(function(prev, next) {
            return prev.concat(next);
          });
          */
        console.log(dupe)
        fs.writeFileSync("results.json", JSON.stringify(dupe));
        //remove all presences that dont have a "lastLocation" or dont have presencetype of 2
        //check presenctype first for performance
        const filtered = dupe.filter((presence) => presence.userPresenceType === 2);
        //check last location
        const finalFiltered = dupe.filter((presence) => presence.lastLocation !== null);
        console.log(finalFiltered)
        return finalFiltered;
    }

    public static chunkArray(myArray: any[], chunk_size: number){
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
    private static getProxy() : string
    {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)];
        return proxy;
    }
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
    public static users(userIds: string[])
    {
        if(userIds.length > 100)
            throw new Error("Maximum of 100 users per request");
        //turn userids into int
        const url = "https://users.roblox.com/v1/users";
        const options = {
            method: "POST",
            'Cookie': '.ROBLOSECURITY=' + this.getCookie(),
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-CSRF-TOKEN': this.getxcrsf()
        };
        const body = JSON.stringify({
            userIds: userIds
        });
        return this.fetchData(url, options, body);
    }
}


//if ran tests
const url = "https://users.roblox.com/v1/users/authenticated";
const options = {
    method: "GET",
    //xcsrf
    headers: {
        "Cookie": ".ROBLOSECURITY=" + RobloxAPI.getCookie(),
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": RobloxAPI.getxcrsf()
    }
}
//fetch with proxy
RobloxAPI.fetchData(url, options, null).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
}
);
