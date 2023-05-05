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
const fetch_with_proxy_1 = __importDefault(require("fetch-with-proxy"));
const fs = require("fs");
const https_proxy_agent_1 = require("https-proxy-agent");
class API {
    constructor() {
        this.urlFormat = "https://www.rolimons.com/%s/%s";
    }
    //our custom fetch, using proxies! > proxies.txt is a list of proxies, one per line\
    getProxy() {
        const proxies = fs.readFileSync("proxies.txt").toString().split("\n");
        const proxy = proxies[Math.floor(Math.random() * proxies.length)];
        //Argument of type '{ agent: HttpsProxyAgent; }' is not assignable to parameter of type 'RequestInit'. Object literal may only specify known properties, and 'agent' does not exist in type 'RequestInit'
        //return new HttpsProxyAgent("http://" + proxy);
        return new https_proxy_agent_1.HttpsProxyAgent("http://" + proxy);
    }
    fetch(url) {
        return new Promise((resolve, reject) => {
            const proxy = this.getProxy();
            process.env.HTTPS_PROXY = "http://" + proxy.toString();
            process.env.HTTPS_PROXY = "http://" + proxy.toString();
            (0, fetch_with_proxy_1.default)(url, { agent: proxy }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    getVariable(JavaScript, Variable) {
        let Declaration = JavaScript.substring(JavaScript.indexOf(Variable) + Variable.length);
        Declaration = Declaration.substring(0, Declaration.indexOf("\n"));
        if (Declaration.indexOf("=") !== -1) {
            Declaration = Declaration.substring(Declaration.indexOf("=") + 2, Declaration.indexOf(";") - 1);
            return Declaration;
        }
        return "";
    }
    getData(Type, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, fetch_with_proxy_1.default)(this.urlFormat.replace("%s", Type).replace("%s", Id.toString()));
            const text = yield response.text();
            const type = Type.toLowerCase();
            const rawData = this.getVariable(text, type + "_details_data") || this.getVariable(text, type + "_details");
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
            return yield this.getData("user", userId);
        });
    }
}
exports.API = API;
