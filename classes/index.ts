//testing stuff

//get request to "https://www.rolimons.com/player/318762886" < output all headers

//import mongodb
import { MongoClient } from "mongodb";

//get request to "https://www.rolimons.com/player/318762886" < output all headers
import { Response } from "../node_modules/node-fetch/@types/index";
import fetch from "node-fetch";
import { URL } from "url";
async function test(url: URL){
    let response = await fetch(url);
    //get response that isnt html
    let data = response.headers.get("content-type");
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

async function getData(type: string, id: number){
    let url: URL = new URL(`https://www.rolimons.com/${type}/${id}`);
    let response = await fetch(url);
    let data = await response.text();
    let raw = data.match(/var (.*?)_details_data = (.*?);/);
}


getData("player", 318762886);

