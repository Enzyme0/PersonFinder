//repersenting an item in the rolimons api, each are accessed by their assetId
import * as API from "./API";
import { DataBase as db } from "./DataBase";
const api = new API.API();
export class Item {
    data: any;
    customData : any;
    //get method to get the item data by the assetId
    static async get(assetId: string): Promise<Item> {
        const data = await api.getAssetData(assetId);
        //turn all data into strings
        for(let key in data) {
            if(data[key] === null) continue;
            data[key] = data[key].toString();
        }
        return new Item(data);
    }
    static async update(assetId: string): Promise<void> {
        const data = await api.getAssetData(assetId);
        //turn all data into strings
        for(let key in data) {
            if(data[key] === null) continue;
            data[key] = data[key].toString();
        }
        await db.updateItem(data);
    }

    constructor(data: any) {
        this.data = data;
    }
    isNull()
    { 
        return this.data == null;
    }
}