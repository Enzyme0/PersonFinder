//interacting with the database is esclusively through additem, removeitem, getitem, getallitems, updateCofig, getconfig, ban, unban, isbanned, getbanned
//all other methods are private and are used internally




import { Item } from "./Item";
import { API } from "./API";
//mongodb
import "mongodb";
const api = new API();

export class DataBase 
{
    
    private static async connect(): Promise<any> {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb://localhost:27017";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        return await client.connect();
    }

    private static async getCollection(collection: string): Promise<any> {
        const client = await this.connect();
        const db = client.db("LimitedJoiner");
        return db.collection(collection);
    }
    
    public static async addItem(item: Item, owners: any): Promise<void> {
        const collection = await this.getCollection("items");
        //make an object with the item data and the owners
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
        console.log(document)
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
}