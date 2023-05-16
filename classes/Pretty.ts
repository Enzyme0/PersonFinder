import { RobloxAPI } from "./RobloxAPI";
import { DataBase } from "./DataBase";
import { Item } from "./Item";
import { UserPresence } from "noblox.js";
import noblox from "noblox.js";

//embed builder
import { EmbedBuilder, Embed, ActionRow, ButtonBuilder,ButtonStyle, ActionRowBuilder } from "discord.js";

export class Pretty
{
    public static generateScript(presence: UserPresence)
    {
        //example script
        /*
        Roblox.GameLauncher.followPlayerIntoGame(2639482676, '5bf0b27b-bb31-4813-af33-3188d3a4b3a9', 'JoinUser');var referrerId = Roblox.UrlParser ? Roblox.UrlParser.getParameterValueByName('rbxp') : null; if (Roblox.GamePlayEvents) { var context = Roblox.GamePlayEvents.contextCategories.joinUser; Roblox.GamePlayEvents.SendGamePlayIntent(context, '6890041519', referrerId, '5bf0b27b-bb31-4813-af33-3188d3a4b3a9'); }
        */
        //get the game id
        const gameId = presence.gameId;
        //get the place id
        const placeId = presence.placeId;
        //get the universe id
        const universeId = presence.universeId;
        //get the user id
        //make the script
        const script = `Roblox.GameLauncher.followPlayerIntoGame(${placeId}, '${universeId}', 'JoinUser');var referrerId = Roblox.UrlParser ? Roblox.UrlParser.getParameterValueByName('rbxp') : null; if (Roblox.GamePlayEvents) { var context = Roblox.GamePlayEvents.contextCategories.joinUser; Roblox.GamePlayEvents.SendGamePlayIntent(context, '${gameId}', referrerId, '${universeId}'); }`;

        return script;
    }
    public static async getBusts(userIds: number[])
    {
        const busts = [];
        //req url https://thumbnails.roblox.com/v1/users/avatar-bust?userIds={userIds}&size=420x420&format=Png&isCircular=false
        const url = "https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=" + userIds.join(",") + "&size=420x420&format=Png&isCircular=false";
        const response = await RobloxAPI.fetchData(url, null, null);
        //get the data from the response
        const data = response.data;
        //get the thumbnails from the data
        for(let i = 0; i < data.length; i++)
        {
            busts.push(data[i].imageUrl);
        }
        
        return busts;
    }
    public static async getNames(userIds: undefined | number[])
    {
        if(userIds == undefined) throw new Error("User ids is undefined")
       const names = [];
       for(let i = 0; i < userIds.length; i++)
       {
           const name = await noblox.getUsernameFromId(userIds[i]);
           names.push(name);
       }
       return names;
    }
    private static filterNulls(presences: UserPresence[]) : any[]
    {
        return presences.filter((presence: UserPresence) => presence.placeId != null && presence.placeId != 0 && presence.userId != null);
    }
    public static async pretty(item: Item, presences: UserPresence[])
    {
        if(presences.length == 0) throw new Error("No presences found")
        if(item.isNull()) throw new Error("Item is null")
        let filtered = this.filterNulls(presences);
        //get names urls and the such
        //get the user ids from the presences
        const userIds = [];
        for(let i = 0; i < filtered.length; i++)
        {
            userIds.push(filtered[i].userId);
        }
        if(userIds.length == 0) throw new Error("No users found");
        //get the names from the user ids
        //throw error if has no names
        let names = await Pretty.getNames(userIds);
        //get the busts from the user ids
        let busts = await Pretty.getBusts(userIds);
        //throw error if has no busts
        if(!busts) throw new Error("ambussing");
        //make an embed for each presence
        const embeds = [];
        const rows: any[] = [];
        for(let i = 0; i < filtered.length; i++)
        {
            const embed = new EmbedBuilder();
            embed.setTitle(item.data.item_name);
            embed.setThumbnail(busts[i]);
            try
            
            {embed.addFields(
                {
                    name: "Username",
                    value: names[i],
                    inline: true
                },
                {
                    name: "Game ID",
                    value: filtered[i].placeId.toString(),
                    inline: true
                },
                {
                    name: "Game",
                    value: filtered[i].lastLocation,
                    inline: true
                },
                {
                    name: "script",
                    value: Pretty.generateScript(filtered[i]),
                    inline: false
                }
            )
            //add buttons
            }
            catch(e)
            {
                console.log(e);
                continue;
            }
            //action row
            const actionRow = new ActionRowBuilder();
            //button
            const button = new ButtonBuilder();
            button.setCustomId("join");
            button.setLabel("Join");
            button.setStyle(ButtonStyle.Primary);
            button.setURL("https://www.roblox.com/users/" + filtered[i].userId + "/profile");
            //ban button
            const banButton = new ButtonBuilder();
            banButton.setCustomId("ban");
            banButton.setLabel("Ban");
            banButton.setStyle(ButtonStyle.Danger);
            actionRow.addComponents(button, banButton);

            embeds.push(embed);
        }
        return {embeds: embeds, rows: rows};
    }
}