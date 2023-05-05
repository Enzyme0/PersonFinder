"use strict";
//interacting with the database is esclusively through additem, removeitem, getitem, getallitems, updateCofig, getconfig, ban, unban, isbanned, getbanned
//all other methods are private and are used internally
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
exports.DataBase = void 0;
const Item_1 = require("./Item");
const API_1 = require("./API");
//mongodb
require("mongodb");
const api = new API_1.API();
class DataBase {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const MongoClient = require('mongodb').MongoClient;
            const uri = "mongodb://localhost:27017";
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            return yield client.connect();
        });
    }
    static getCollection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.connect();
            const db = client.db("LimitedJoiner");
            return db.collection(collection);
        });
    }
    static addItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            yield collection.insertOne(item);
        });
    }
    static removeItem(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            yield collection.deleteOne({ "data.item_id": assetId });
        });
    }
    static getItem(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            //get the item from the database, (just the whole document)
            //every item has an object called data, which is the item data. we're looking for data.item_id
            const document = collection.findOne({ "data.item_id": assetId });
            console.log(document);
            //if the document is null, return null
            if (!document) {
                return null;
            }
            //return the item
            return new Item_1.Item(document.data);
        });
    }
    static getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            const documents = yield collection.find({}).toArray();
            const items = [];
            for (const document of documents) {
                items.push(new Item_1.Item(document.data));
            }
            return items;
        });
    }
    static updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("config");
            //document is the config
            let document = yield collection.findOne({ name: "config" });
            //if the document is null, return null
            if (!document)
                throw new Error("Config not found");
            //update the config
            document = config;
            //update the document, NOW MONKEY.
            const result = yield collection.updateOne({ name: "config" }, { $set: document });
            //if the result is not modified, throw an error
            if (result.modifiedCount == 0)
                throw new Error("Config not modified, watf happen!");
        });
    }
    static getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("config");
            const document = yield collection.findOne({ name: "config" });
            //if the document is null, return null
            if (!document)
                throw new Error("Config not found");
            //return the config
            return document;
        });
    }
    static ban(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("banned");
            const document = yield collection.findOne({ userId: userId });
            //if the document is null, return null
            if (document)
                throw new Error("User already banned");
            //
            yield collection.insertOne({ userId: userId });
        });
    }
    //isbanned
    static isBanned(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("banned");
            const document = yield collection.findOne({ userId: userId });
            //if the document is null, return null
            if (!document)
                return false;
            return true;
        });
    }
    static allNonBan() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("banned");
            const documents = yield collection.find({}).toArray();
            const users = [];
            for (const document of documents) {
                users.push(document.userId);
            }
            resolve(users);
        }));
    }
    //getuser, setuser, getallUsers
    static getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("users");
            const document = yield collection.findOne({ userId: userId });
            //if the document is null, return null
            if (!document)
                throw new Error("User not found");
            //return the user
            return document;
        });
    }
    static setUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //get the user data from the api
            const userData = yield api.getUserData(userId);
            //get the collection
            const collection = yield this.getCollection("users");
            //get the document
            let document = yield collection.findOne({ userId: userId });
            //if not exist, create it
            if (!document) {
                yield collection.insertOne(userData);
                return;
            }
            //update the document
            document = userData;
            //update the document, NOW MONKEY.
            const result = yield collection.updateOne({ userId: userId }, { $set: document });
            //if the result is not modified, throw an error
            if (result.modifiedCount == 0)
                throw new Error("User not modified, watf happen!");
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("users");
            const documents = yield collection.find({}).toArray();
            const users = [];
            for (const document of documents) {
                users.push(document);
            }
            return users;
        });
    }
}
exports.DataBase = DataBase;
