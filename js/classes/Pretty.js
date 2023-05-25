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
exports.Pretty = void 0;
const RobloxAPI_1 = require("./RobloxAPI");
const noblox_js_1 = __importDefault(require("noblox.js"));
//embed builder
const discord_js_1 = require("discord.js");
class Pretty {
    static generateScript(presence) {
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
    static getBusts(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const busts = [];
            //req url https://thumbnails.roblox.com/v1/users/avatar-bust?userIds={userIds}&size=420x420&format=Png&isCircular=false
            const url = "https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=" + userIds.join(",") + "&size=420x420&format=Png&isCircular=false";
            const response = yield RobloxAPI_1.RobloxAPI.fetchData(url, null, null);
            //get the data from the response
            const data = response.data;
            //get the thumbnails from the data
            for (let i = 0; i < data.length; i++) {
                busts.push(data[i].imageUrl);
            }
            return busts;
        });
    }
    //get userids
    static getIds(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield noblox_js_1.default.getIdFromUsername(names);
        });
    }
    static getNames(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIds == undefined)
                throw new Error("User ids is undefined");
            const names = [];
            for (let i = 0; i < userIds.length; i++) {
                const name = yield noblox_js_1.default.getUsernameFromId(userIds[i]);
                names.push(name);
            }
            return names;
        });
    }
    static filterNulls(presences) {
        return presences.filter((presence) => presence.placeId != null && presence.placeId != 0 && presence.userId != null);
    }
    static pretty(item, presences) {
        return __awaiter(this, void 0, void 0, function* () {
            if (presences.length == 0)
                throw new Error("No presences found");
            if (item.isNull())
                throw new Error("Item is null");
            let filtered = this.filterNulls(presences);
            //get names urls and the such
            //get the user ids from the presences
            const userIds = [];
            for (let i = 0; i < filtered.length; i++) {
                userIds.push(filtered[i].userId);
            }
            if (userIds.length == 0)
                throw new Error("No users found");
            //get the names from the user ids
            //throw error if has no names
            let names = yield Pretty.getNames(userIds);
            //get the busts from the user ids
            let busts = yield Pretty.getBusts(userIds);
            //throw error if has no busts
            if (!busts)
                throw new Error("ambussing");
            //make an embed for each presence
            const embeds = [];
            const rows = [];
            for (let i = 0; i < filtered.length; i++) {
                const embed = new discord_js_1.EmbedBuilder();
                embed.setTitle(item.data.item_name);
                embed.setColor('Random');
                embed.setThumbnail(busts[i]);
                try {
                    embed.addFields({
                        name: "Username",
                        value: names[i],
                        inline: true
                    }, {
                        name: "Game ID",
                        value: filtered[i].placeId.toString(),
                        inline: true
                    }, {
                        name: "Game",
                        value: filtered[i].lastLocation,
                        inline: true
                    }, {
                        name: "script",
                        value: Pretty.generateScript(filtered[i]),
                        inline: false
                    });
                    //add buttons
                }
                catch (e) {
                    console.log(e);
                    continue;
                }
                //action row
                const actionRow = new discord_js_1.ActionRowBuilder();
                //button
                const button = new discord_js_1.ButtonBuilder();
                button.setLabel("Join");
                button.setStyle(discord_js_1.ButtonStyle.Link);
                button.setURL("https://www.roblox.com/users/" + filtered[i].userId + "/profile");
                //ban button
                const banButton = new discord_js_1.ButtonBuilder();
                banButton.setCustomId("ban");
                banButton.setLabel("Ban");
                banButton.setStyle(discord_js_1.ButtonStyle.Danger);
                actionRow.addComponents(button, banButton);
                rows.push(actionRow);
                embeds.push(embed);
            }
            return { embeds: embeds, rows: rows };
        });
    }
}
exports.Pretty = Pretty;
