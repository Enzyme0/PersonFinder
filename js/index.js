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
Object.defineProperty(exports, "__esModule", { value: true });
//discord js
//const { Client, GatewayIntentBits, messageLink, ActionRow, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction} = require('discord.js');
const discord_js_1 = require("discord.js");
//.env 
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
//dotenv
require('dotenv').config();
//mongodb
const DataBase_1 = require("./classes/DataBase");
const Item_1 = require("./classes/Item");
const RobloxAPI_1 = require("./classes/RobloxAPI");
//rolimons api
const API_1 = require("./classes/API");
const util_1 = require("util");
const Pretty_1 = require("./classes/Pretty");
//create a new instance of the api
const api = new API_1.API();
const itemChannel = '1103141647618940958';
function ping(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isCommand())
            return;
        yield reply(interaction, "Pong!");
    });
}
function reply(interaction, message) {
    return __awaiter(this, void 0, void 0, function* () {
        //check to see if its itemData
        if (!interaction.isCommand())
            return;
        try {
            yield interaction.reply(message);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function addItemChannel(interaction, item) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        if (!interaction.inCachedGuild())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return;
        ;
        //create a new channel for the item, with the name itemname-itemid
        const channel = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.create({
            name: `${item.data.item_name}-${item.data.item_id}`,
            type: discord_js_1.ChannelType.GuildText,
            parent: itemChannel,
            permissionOverwrites: [
                {
                    id: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.everyone.id,
                    deny: ['ViewChannel'],
                },
            ],
        }));
        //send the item data to the channel
        //turn value into a string cuz for some reason it's a number
        try {
            const owners = (_c = item.data.owners) !== null && _c !== void 0 ? _c : "0";
            const value = (_d = item.data.value) !== null && _d !== void 0 ? _d : "N/A";
            const demand = (_e = item.data.demand) !== null && _e !== void 0 ? _e : "N/A";
            const rap = (_f = item.data.rap) !== null && _f !== void 0 ? _f : "N/A";
            yield (channel === null || channel === void 0 ? void 0 : channel.send({ embeds: [new discord_js_1.EmbedBuilder()
                        .setTitle("New item added! " + item.data.item_name)
                        .setURL(`https://www.rolimons.com/item/${item.data.item_id}`)
                        .setThumbnail(item.data.thumbnail_url_lg)
                        .addFields({ name: "Best Price", value: item.data.best_price.toLocaleString(), inline: true }, { name: "Owners", value: owners, inline: true }, { name: "Value", value: value, inline: true }, { name: "Demand", value: demand, inline: true }, { name: "Rap", value: rap, inline: true })
                    // .addFields(
                    //     {
                    //         name: "Best Price", value: item.data.best_price.toLocaleString(), inline: true
                    //     },
                    //     {
                    //         name: "Owners", value: item.data.owners.toLocaleString(), inline: true
                    //     },
                    //     {
                    //         name: "Value", value: "hi guys its me ben shapiro", inline: true
                    //     },
                    //     {
                    //         name: "Demand", value: "hi guys its me ben shapiro", inline: true
                    //     },
                    //     {
                    //         name: "Rap", value: item.data.Rap.toLocaleString(), inline: true
                    //     }
                    // )
                ] }));
        }
        catch (err) {
            console.log(err);
        }
    });
}
function updateChannel(assetId) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        //refresh the channel with the new item data
        Item_1.Item.update(assetId);
        const item = yield Item_1.Item.get(assetId);
        //get the channel with the name itemname-itemid
        //search for the channel in the category itemChannel of the guilds
        const guildId = "1103083544718348308";
        const guild = yield client.guilds.fetch(guildId);
        let name = item.data.item_name.replace(/ /g, "-").toLowerCase();
        const channel = guild.channels.cache.find(channel => channel.name === `${name}-${item.data.item_id.toLowerCase()}` && channel.parentId === itemChannel);
        //throw if not text channel
        if (!(channel === null || channel === void 0 ? void 0 : channel.isTextBased()))
            throw new Error("Channel is not a text channel!");
        //get the actual channel
        //say "updating channel..."
        yield (channel === null || channel === void 0 ? void 0 : channel.send("Updating channel..."));
        //send the item data to the channel
        //turn value into a string cuz for some reason it's a number
        try {
            const owners = (_a = item.data.owners) !== null && _a !== void 0 ? _a : "0";
            const value = (_b = item.data.value) !== null && _b !== void 0 ? _b : "N/A";
            const demand = (_c = item.data.demand) !== null && _c !== void 0 ? _c : "N/A";
            const rap = (_d = item.data.rap) !== null && _d !== void 0 ? _d : "N/A";
            yield (channel === null || channel === void 0 ? void 0 : channel.send({ embeds: [new discord_js_1.EmbedBuilder()
                        .setTitle("New item added! " + item.data.item_name)
                        .setURL(`https://www.rolimons.com/item/${item.data.item_id}`)
                        .setThumbnail(item.data.thumbnail_url_lg)
                        .addFields({ name: "Best Price", value: item.data.best_price.toLocaleString(), inline: true }, { name: "Owners", value: owners, inline: true }, { name: "Value", value: value, inline: true }, { name: "Demand", value: demand, inline: true }, { name: "Rap", value: rap, inline: true })
                ] }));
        }
        catch (err) {
            console.log(err);
        }
    });
}
function buildTxtFile(largeText) {
    return __awaiter(this, void 0, void 0, function* () {
        //create a text file and send as attachment for discord (to send the entire list of owners)
        //create a buffer from the string
        const buffer = Buffer.from(largeText, 'utf-8');
        const attachmentData = {
            name: "owners.txt",
            description: "Owners of the item",
        };
        const attachment = new discord_js_1.AttachmentBuilder(buffer, attachmentData);
        //return the attachment
        return attachment;
    });
}
function addItem(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return reply(interaction, "Please provide an asset id");
        //try to get item data from the db, if it exists, return
        try {
            const item = yield DataBase_1.DataBase.getItem(assetId);
            console.log(item);
            if (!item == null)
                return reply(interaction, "Item already exists in database! Updating the channel...");
            //delete the channel
        }
        catch (err) {
            //just continue
        }
        yield reply(interaction, "Adding to database...");
        const item = yield Item_1.Item.get(assetId);
        const owners = yield api.getOwnershipData(assetId);
        //edit reply to say Added (item name) to database with (owners.length) owners
        yield interaction.editReply(`Added ${item.data.item_name} to database with ${owners.length} owners!`);
        yield DataBase_1.DataBase.addItem(item, owners);
        yield addItemChannel(interaction, item);
    });
}
function userIdFromEmbed(embed) {
    return __awaiter(this, void 0, void 0, function* () {
        const userName = embed.fields[0].value;
        return userName;
    });
}
function deleteItem(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return reply(interaction, "Please provide an asset id");
        try {
            const item = yield DataBase_1.DataBase.getItem(assetId);
            if (!item)
                return reply(interaction, "Item does not exist in database!, failed at non-exist check.");
            if (item === null || item === void 0 ? void 0 : item.isNull())
                return reply(interaction, "Item does not exist in database!, failed at isNull check.");
            yield DataBase_1.DataBase.removeItem(assetId);
            //delete the channel with the name item.data.item_name-item.data.item_id
            //look in the category itemChannel
            //replace the spaces in the name with -
            let tempName = item.data.item_name.replace(/ /g, "-");
            let tempId = item.data.item_id;
            console.log(tempName + "-" + tempId);
            const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(channel => channel.name === `${tempName.toLowerCase()}-${tempId}` && channel.parentId === itemChannel);
            if (!channel)
                return reply(interaction, "Channel does not exist!");
            yield channel.delete();
            yield reply(interaction, "Deleted item from database!");
            //delete the channel
        }
        catch (err) {
            console.log(err);
            yield reply(interaction, "An error occured!");
        }
    });
}
function getOwners(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //run db.getAllUsers(itemid)
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return reply(interaction, "Please provide an asset id");
        const item = yield DataBase_1.DataBase.getItem(assetId);
        if (!item)
            return reply(interaction, "Item does not exist in database!");
        if (item === null || item === void 0 ? void 0 : item.isNull())
            return reply(interaction, "Item does not exist in database!");
        //run RobloxAPI.getOnline(assetId)
        yield reply(interaction, "Getting owners...");
        let owners = yield RobloxAPI_1.RobloxAPI.getOnline(assetId);
        //remove all banned users
        let banned = yield DataBase_1.DataBase.allBanned();
        const ids = yield Pretty_1.Pretty.getIds(banned);
        //make banned an array of userids
        //remove all owners that include ids
        //remove all undefined owners
        for (let i = 0; i < owners.length; i++) {
            if (owners[i] == undefined) {
                owners.splice(i, 1);
            }
        }
        let Strings = JSON.stringify(owners);
        let temp = JSON.parse(Strings);
        for (let i = owners.length - 1; i >= 0; i--) {
            //not using .includes cuz it says its not a function
            for (let j = 0; j < ids.length; j++) {
                console.log(owners[i]);
                console.log(`debug: ${owners[i].userId.toString()} ${ids[j].toString()}`);
                if (owners[i].userId.toString() == ids[j].toString()) {
                    console.log("removing banned user " + owners[i].userId.toString());
                    temp.splice(i, 1);
                }
            }
        }
        owners = temp;
        console.log(owners);
        if (owners.length == 0)
            return interaction.editReply("No owners found!");
        const userIds = [];
        for (let i = 0; i < owners.length; i++) {
            userIds.push(owners[i].userId);
        }
        let responses = yield Pretty_1.Pretty.pretty(item, owners);
        //send the owners in a message
        //owners is a string
        let embeds = responses.embeds;
        let rows = responses.rows;
        const messages = [];
        for (let i = 0; i < embeds.length; i++) {
            try {
                yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ components: [rows[i]], embeds: [embeds[i]] }).then(message => messages.push(message)));
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
function getOwnerIds(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return reply(interaction, "Please provide an asset id");
        const item = yield DataBase_1.DataBase.getItem(assetId);
        if (!item)
            return reply(interaction, "Item does not exist in database!");
        if (item === null || item === void 0 ? void 0 : item.isNull())
            return reply(interaction, "Item does not exist in database!");
        //run db.getAllUsersWithItem(itemid)
        yield reply(interaction, "Getting owners...");
        const owners = yield DataBase_1.DataBase.getAllUsersWithItem(assetId);
        //send the owners in a message
        const attachment = yield buildTxtFile(owners.join(", "));
        yield interaction.editReply({ content: `Owners of ${item.data.item_name} (${owners.length}):`, files: [attachment] });
    });
}
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'ping') {
        yield ping(interaction);
    }
    if (interaction.commandName === 'additem') {
        yield addItem(interaction);
    }
    if (interaction.commandName === 'removeitem') {
        yield deleteItem(interaction);
    }
    if (interaction.commandName === 'getowners') {
        yield getOwners(interaction);
    }
    if (interaction.commandName === 'getuserids') {
        yield getOwnerIds(interaction);
    }
    if (interaction.commandName === 'eval') {
        const code = interaction.options.getString('code');
        if (!code)
            return reply(interaction, "Please provide code");
        try {
            //robloxapi define
            let evaled = eval(code);
            if (!evaled)
                return reply(interaction, "Success! But no output.");
            if (typeof evaled !== "string")
                evaled = (0, util_1.inspect)(evaled).toString();
            if (evaled.length > 2000)
                return reply(interaction, "Output too long!");
            //temp
            let temp = yield RobloxAPI_1.RobloxAPI.fetchData("https://users.roblox.com/v1/users/authenticated", null, null);
            let yonk = JSON.stringify(temp);
            yield interaction.reply(yonk);
        }
        catch (err) {
            yield reply(interaction, err.toString());
        }
    }
    if (interaction.commandName === 'update') {
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return reply(interaction, "Please provide an asset id");
        yield updateChannel(assetId);
    }
}));
//buttons
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isButton())
        return;
    //ban
    if (interaction.customId === 'ban') {
        //get the user id from the embed
        const userId = yield userIdFromEmbed(interaction.message.embeds[0]);
        //ban the user
        yield interaction.reply({ content: `Banned ${userId}`, ephemeral: true });
        yield DataBase_1.DataBase.ban(userId);
    }
}));
//when the bot is ready
client.on('ready', () => {
    if (!client.user)
        throw new Error("Client user is null");
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login("MTEwMzA4NDIyOTMyNTI0NjQ4NA.Gnahey.H0Ho1QcroQola9sN-Jm6ABf73HOfsIZSy9RFdk");
