
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
        return "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_A66A9D8EB763A4FE894D48E46E416BE0754DEE71858A90BA13E77A44A4C4B7F691471EC3ADBC657ABD3F91599714D81B3B8EF30BDDDEBC2B41C252FC094444CD117C35699BD4D307CF989A9ACA24C2D76E242944DA015C0DBE92722B158C6C73F74A4423BC3ED296324A851225FBF62381CE0924ADCE57D40C4A7CBF55F0858F2D52115D9F21F9BA58A7398D4894C259380097DE3360D0596B56AC76CD57392704DC18FFF88F40658DCE94FC8983842AE34FF642B590564700B885AC3E6EF950245048392D8757D8BBBEA9DD35FB0A25713BA27999228382824FC7758209409BF99A74F5084EAAAEBDEB25E27F36AE2BEEA3E9DF2FF1A190A1E797E767A36343A291CB19AAF4FFD837873174BF9AD64CFF0574900C38C3D225BB89783B1AE353083EDB2122E041B3F1E02C161C4FA641FF69EEB6022427125BD330CD10774C97BEFE05E44B307553EB21DCA4FDE987B85F5E3813";
    }
    private static async userPresence(userId: string[])
    {
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
        const response = await this.fetchData(url, options, body);
        return response;

        
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
        let presences = await noblox.getPresences(validUsers);
        //filter out all without a place id
        presences.userPresences = presences.userPresences.filter((presence: any) => presence.placeId != null);
        //get the place ids from the presences
        //obj format that we want
        /*
        {
            userId: 123,
            placeId: 123,
            lastLocation: "string"
            gameId: 123
            universeId: 123
        }
        */
        return presences.userPresences;

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
            'content-type': 'application/json'
        };
        const body = JSON.stringify({
            userIds: userIds
        });
        return this.fetchData(url, options, body);
    }
}
