//interacting with the database is esclusively through additem, removeitem, getitem, getallitems, updateCofig, getconfig, ban, unban, isbanned, getbanned
//all other methods are private and are used internally




import { Item } from "./Item";
import { API } from "./API";
//mongodb
import "mongodb";
import { Collection } from "mongodb";
const api = new API();
import { RobloxAPI } from "./RobloxAPI";

export class DataBase 
{
    
    private static async connect(): Promise<any> {
        const MongoClient = require('mongodb').MongoClient;
        //local
        const uri = "mongodb://localhost:27017/";
    
        const ssl = true;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
        return await client.connect();
    }

    private static async getCollection(collection: string): Promise<any> {
        const client = await this.connect();
        const db = client.db("LimitedJoiner");
        return db.collection(collection);
    }
    public static async removeInvalids(owners: any[]): Promise<any[]>
    {
        //iterate through the owners array and remove any invalid users using the https://users.roblox.com/v1/users with the id in the owners array
        let ids = [];
        for(let i = 0; i < owners.length; i++)
        {
            ids.push(owners[i].owner_id);
        }
        const chunks = RobloxAPI.chunkArray(ids, 100);
        const promises = [];
        for(let i = 0; i < chunks.length; i++)
        {
            promises.push(RobloxAPI.users(chunks[i]));
        }
        const results = await Promise.all(promises);
        //if the user is invalid, the roblox api simply doesnt return it in the array
        //if i have users 1, gabagoo, 12, 3
        //and i send it to the api, it will return 1, 12, 3
        //check to find this missing user, and remove from the owners array
    
        //return the owners array
        //if owners[i].owner_id is not in results, remove it from the owners array
        for(let i = 0; i < owners.length; i++)
        {
            if(!results.includes(owners[i].owner_id))
            {
                owners.splice(i, 1);
            }
        }
        return owners;
    }
    
    public static async addItem(item: Item, owners: any): Promise<void> {
        const collection = await this.getCollection("items");
        //make an object with the item data and the owners
        //remove invalid users from the owners array
        owners = await this.removeInvalids(owners);
        let obj =
        {
            data: item.data,
            owners: owners
        }
        await collection.insertOne(obj);
    }

   public static async removeItem(assetId: string): Promise<void> 
    {
        const collection = await this.getCollection("items");
        await collection.deleteOne({"data.item_id": assetId})
    }

   public static async getItem(assetId: string): Promise<Item | null>
    {
        const collection = await this.getCollection("items");
        //get the item from the database, (just the whole document)
        //every item has an object called data, which is the item data. we're looking for data.item_id
        const document = await collection.findOne({ "data.item_id": assetId })
        //if the document is null, return null
        if (!document) {
            return null;
        }
        //return the item
        return new Item(document.data);
    }

    public static async getAllItems(): Promise<Item[]> {
        const collection = await this.getCollection("items");
        const documents = await collection.find({}).toArray();
        const items: Item[] = [];
        for (const document of documents) {
            items.push(new Item(document.data));
        }
        return items;
    }

    public static async updateConfig(config: any): Promise<void> {
        const collection = await this.getCollection("config");
        //document is the config
        let document = await collection.findOne({ name: "config" });
        //if the document is null, return null
        if (!document) 
            throw new Error("Config not found");
        //update the config
        document = config;
        //update the document, NOW MONKEY.
        const result = await collection.updateOne({ name: "config" }, { $set: document });
        //if the result is not modified, throw an error
        if (result.modifiedCount == 0) 
            throw new Error("Config not modified, watf happen!");
    }

    public static async updateItem(item: Item): Promise<void> {
        const collection = await this.getCollection("items");
        //document is the item
        let document = await collection.findOne({ "data.item_id": item.data.item_id });
        //if the document is null, return null
        if (!document)
            throw new Error("Item not found");
        //update the item
        document = item;
        //update the document, NOW MONKEY.
        const result = await collection.updateOne({ "data.item_id": item.data.item_id }, { $set: document });
        //if the result is not modified, throw an error
        if (result.modifiedCount == 0)
            throw new Error("Item not modified, watf happen!");
    }
    

    public static async getConfig(): Promise<any> {
        const collection = await this.getCollection("config");
        const document = await collection.findOne({ name: "config" });
        //if the document is null, return null
        if (!document)
            throw new Error("Config not found");
        //return the config
        return document;
    }

    public static async ban(userId: string): Promise<void> {
        const collection = await this.getCollection("banned");
        const document = await collection.findOne({ userId: userId });
        //if the document is null, return null
        if (document) 
            throw new Error("User already banned");
        //
        await collection.insertOne({ userId: userId });

    }

    //isbanned
    public static async isBanned(userId: string): Promise<boolean> {
        const collection = await this.getCollection("banned");
        const document = await collection.findOne({ userId: userId });
        //if the document is null, return null
        if (!document)
            return false;
        return true;
    }

    public static allNonBan(): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            const collection = await this.getCollection("banned");
            const documents = await collection.find({}).toArray();
            const users: string[] = [];
            for (const document of documents) {
                users.push(document.userId);
            }
            resolve(users);
        });
    }
    public static allBanned(): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            const collection = await this.getCollection("banned");
            const documents = await collection.find({}).toArray();
            const users: string[] = [];
            for (const document of documents) {
                users.push(document.userId);
            }
            resolve(users);
        });
    }

    
    //getuser, setuser, getallUsers
    public static async getUser(userId: string): Promise<any> {
        const collection = await this.getCollection("users");
        const document = await collection.findOne({ userId: userId });
        //if the document is null, return null
        if (!document)
            throw new Error("User not found");
        //return the user
        return document;
    }

    public static async setUser(userId: string): Promise<void> {
        //get the user data from the api
        const userData = await api.getUserData(userId);
        //get the collection
        const collection = await this.getCollection("users");
        //get the document
        let document = await collection.findOne({ userId: userId });
        //if not exist, create it
        if (!document) {
            await collection.insertOne(userData);
            return;
        }
        //update the document
        document = userData;
        //update the document, NOW MONKEY.
        const result = await collection.updateOne({ userId: userId }, { $set: document });
        //if the result is not modified, throw an error
        if (result.modifiedCount == 0)
            throw new Error("User not modified, watf happen!");
        
    }

    public static async getAllUsers(): Promise<any[]> {
        const collection = await this.getCollection("users");
        const documents = await collection.find({}).toArray();
        const users: any[] = [];
        for (const document of documents) {
            users.push(document);
        }
        return users;
    } 
    //get all userids of users who have a certain item, specified by itemid
    public static async getAllUsersWithItem(itemId: string): Promise<string[]> {
        const collection : Collection = await this.getCollection("items");
        let documents = await collection.findOne({ "data.item_id": itemId });
        //if the document is null, return null
        
        const users: string[] = [];
        if (!documents)
            throw new Error("Item not found");
        //iterate through the "owners" array and push the userIds to the users array
        for (const document of documents.owners) {
            users.push(document.owner_id);
        }
        //document would be just 1 item, but the user data is stored in owners
        //fin
        return users;
    }
    //isbanned funnnc (check banned database for a user id)
    

}