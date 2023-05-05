"use strict";
//testing stuff
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
function test(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield (0, node_fetch_1.default)(url);
        //get response that isnt html
        let data = response.headers.get("content-type");
    });
}
/**
 old python code:
 function API.GetData(Type: string, Id: number) => table?
    local DidGet, Result = Http.Get(string.format(API.UrlFormat, Type, Id))
    if DidGet then
        Type = string.lower(Type)
        local RawData = Http.DecodeJson(API.GetVariable(Result, Type .. "_details_data") or API.GetVariable(Result, Type .. "_details"))
        
        local FormateedData = Formatter.FormatFromRaw(RawData)
        return FormateedData
    else
        warn("Rolimons - " .. Type .. " - Unable to retrive data | " .. Result)
    end
end
 */
function getData(type, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = new url_1.URL(`https://www.rolimons.com/${type}/${id}`);
        let response = yield (0, node_fetch_1.default)(url);
        let data = yield response.text();
        let raw = data.match(/var (.*?)_details_data = (.*?);/);
    });
}
getData("player", 318762886);
