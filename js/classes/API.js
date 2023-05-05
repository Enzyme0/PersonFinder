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
        const regex = new RegExp(Variable + "              = (.*?);"); //rewrite following regex to not explicitly match spaces, but match any whitespace or any amount of whitespace
        const regex2 = new RegExp(Variable + " = (.*?);");
        const match = JavaScript.match(regex) ? JavaScript.match(regex) : JavaScript.match(regex2);
        if (match) {
            return match[1];
        }
        throw new Error("Variable not found");
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
}
exports.API = API;
