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
const RobloxAPI_1 = require("./RobloxAPI");
class DataBase {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const MongoClient = require('mongodb').MongoClient;
            //local
            const uri = "mongodb://localhost:27017/";
            const ssl = true;
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
    static removeInvalids(owners) {
        return __awaiter(this, void 0, void 0, function* () {
            //iterate through the owners array and remove any invalid users using the https://users.roblox.com/v1/users with the id in the owners array
            let ids = [];
            for (let i = 0; i < owners.length; i++) {
                ids.push(owners[i].owner_id);
            }
            const chunks = RobloxAPI_1.RobloxAPI.chunkArray(ids, 100);
            const promises = [];
            for (let i = 0; i < chunks.length; i++) {
                promises.push(RobloxAPI_1.RobloxAPI.users(chunks[i]));
            }
            const results = yield Promise.all(promises);
            //if the user is invalid, the roblox api simply doesnt return it in the array
            //if i have users 1, gabagoo, 12, 3
            //and i send it to the api, it will return 1, 12, 3
            //check to find this missing user, and remove from the owners array
            //return the owners array
            //if owners[i].owner_id is not in results, remove it from the owners array
            for (let i = 0; i < owners.length; i++) {
                if (!results.includes(owners[i].owner_id)) {
                    owners.splice(i, 1);
                }
            }
            return owners;
        });
    }
    static addItem(item, owners) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            //make an object with the item data and the owners
            //remove invalid users from the owners array
            owners = yield this.removeInvalids(owners);
            let obj = {
                data: item.data,
                owners: owners
            };
            yield collection.insertOne(obj);
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
            const document = yield collection.findOne({ "data.item_id": assetId });
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
    static updateItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            //document is the item
            let document = yield collection.findOne({ "data.item_id": item.data.item_id });
            //if the document is null, return null
            if (!document)
                throw new Error("Item not found");
            //update the item
            document = item;
            //update the document, NOW MONKEY.
            const result = yield collection.updateOne({ "data.item_id": item.data.item_id }, { $set: document });
            //if the result is not modified, throw an error
            if (result.modifiedCount == 0)
                throw new Error("Item not modified, watf happen!");
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
    static allBanned() {
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
    //get all userids of users who have a certain item, specified by itemid
    static getAllUsersWithItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection("items");
            let documents = yield collection.findOne({ "data.item_id": itemId });
            //if the document is null, return null
            const users = [];
            if (!documents)
                throw new Error("Item not found");
            //iterate through the "owners" array and push the userIds to the users array
            for (const document of documents.owners) {
                users.push(document.owner_id);
            }
            //document would be just 1 item, but the user data is stored in owners
            //fin
            return users;
        });
    }
}
exports.DataBase = DataBase;
