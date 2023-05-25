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
exports.API = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = require("fs");
class API {
    constructor() {
        this.urlFormat = "https://www.rolimons.com/%s/%s";
    }
    //our custom fetch, using proxies! > proxies.txt is a list of proxies, one per line\
    // getProxy(): HttpsProxyAgent {
    //     const proxies = fs.readFileSync("proxies.txt").toString().split("\n");
    //     const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    //     //Argument of type '{ agent: HttpsProxyAgent; }' is not assignable to parameter of type 'RequestInit'. Object literal may only specify known properties, and 'agent' does not exist in type 'RequestInit'
    //     //return new HttpsProxyAgent("http://" + proxy);
    //     return new HttpsProxyAgent("http://" + proxy);
    // }
    // fetch(url: string): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         const proxy = this.getProxy();
    //         process.env.HTTPS_PROXY = "http://" + proxy.toString();
    //         process.env.HTTPS_PROXY = "http://" + proxy.toString();
    //         fetch(url, { agent: proxy }).then((response :any) => {
    //             resolve(response);
    //         }).catch((err : Error) => {
    //             reject(err);
    //         });
    //     });
    // }
    getVariable(JavaScript, Variable) {
        //use regex to get the variable
        const regex = new RegExp(Variable + " =(.*?);"); //rewrite following regex to not explicitly match spaces, but match any whitespace or any amount of whitespace
        const regex2 = new RegExp(Variable + "              = (.*?);");
        const regex3 = new RegExp(Variable + "                =(.*?);");
        //match = whatever regex work
        const match = JavaScript.match(regex) || JavaScript.match(regex2) || JavaScript.match(regex3);
        if (match) {
            return match[1];
        }
        //write to test.js
        fs.writeFileSync("test.js", JavaScript);
        throw new Error("Unable to find variable " + Variable);
    }
    getData(Type, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(this.urlFormat.replace("%s", Type).replace("%s", Id.toString()));
            //throw error if 404/ not ok
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            const text = yield response.text();
            //see if text contains the words "item_details_data" or "scanned_player_assets
            if (!text.includes("item_details_data") && !text.includes("scanned_player_assets")) {
                throw new Error("Invalid response");
            }
            const type = Type.toLowerCase();
            const rawData = type === "player" ? this.getVariable(text, "scanned_player_assets") : this.getVariable(text, "item_details_data");
            return JSON.parse(rawData);
        });
    }
    ownerShipData(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(this.urlFormat.replace("%s", "item").replace("%s", assetId.toString()));
            //throw error if 404/ not ok
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            const text = yield response.text();
            //see if it contains the words "all_copies_data"
            if (!text.includes("all_copies_data")) {
                throw new Error("Invalid response");
            }
            let rawData = this.getVariable(text, "all_copies_data");
            let newData = JSON.parse(rawData);
            if (typeof newData == "string") {
                //write to test.js
                yield fs.writeFileSync("test.js", rawData);
                throw new Error("Invalid response");
            }
            //data is a bunch of arrays
            //e.g
            /*
            "owner_ids": ['1', '2', '3'],
            "owner_names": ['a', 'b', 'c'],
            "quantities": ['1', '2', '3'],
            "uaids": ['1', '2', '3'],
            "serials": ['1', '2', '3'],
            //bc updated is time of purchase, in milliseconds
            "updated": ['1', '2', '3'],
            //time in ms
            "presence_upate_time": ['1', '2', '3'],
            //time in ms
            "last_online_time": ['1', '2', '3'],
            */
            //we want to make an array of objects that has each index of the arrays as a property, but if
            //also remove any objects that have a null owner_id, or owner_name
            //remove any objects that have a "presence update time" of less than 1 years ago (1651694373349)  < this will help us find more inactive accounts
            let objs = [];
            for (let i = 0; i < newData.owner_ids.length; i++) {
                console.log(`${newData}`);
                if (newData.owner_ids[i] == null || newData.owner_names[i] == null) {
                    console.log(`Null owner id or name, skipping ${i}`);
                    continue;
                }
                if (newData.presence_update_time[i] == null) {
                    console.log(`Presence update time is less than 1 year ago, skipping ${i}`);
                    continue;
                }
                //^ filter out any objects that have a presence update time of less than 1 year ago, and above it we filter out any objects that have a null owner_id or owner_name
                //create objects
                let obj = {
                    owner_id: newData.owner_ids[i],
                    owner_name: newData.owner_names[i],
                    quantity: newData.quantities[i],
                    uaids: newData.uaids[i],
                    serials: newData.serials[i],
                    updated: newData.updated[i],
                    presence_update_time: newData.presence_update_time[i],
                    last_online: newData.last_online[i]
                };
                objs.push(obj);
            }
            // add the objects to the array
            return objs;
        });
    }
    //quick console script to find 1 year ago in ms
    // var d = new Date();
    // d.setFullYear(d.getFullYear() - 1);
    getAssetData(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getData("item", assetId);
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getData("player", userId);
        });
    }
    getOwnershipData(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ownerShipData(assetId);
        });
    }
}
exports.API = API;
