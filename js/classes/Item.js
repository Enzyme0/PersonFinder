"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
//repersenting an item in the rolimons api, each are accessed by their assetId
const API = __importStar(require("./API"));
const DataBase_1 = require("./DataBase");
const api = new API.API();
class Item {
    constructor(data) {
        this.data = data;
    }
    //get method to get the item data by the assetId
    static get(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield api.getAssetData(assetId);
            //turn all data into strings
            for (let key in data) {
                if (data[key] === null)
                    continue;
                data[key] = data[key].toString();
            }
            return new Item(data);
        });
    }
    static update(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield api.getAssetData(assetId);
            //turn all data into strings
            for (let key in data) {
                if (data[key] === null)
                    continue;
                data[key] = data[key].toString();
            }
            yield DataBase_1.DataBase.updateItem(data);
        });
    }
    isNull() {
        return this.data == null;
    }
}
exports.Item = Item;
