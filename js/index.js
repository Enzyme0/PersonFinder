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
//rolimons api
const API_1 = require("./classes/API");
//create a new instance of the api
const api = new API_1.API();
const itemChannel = '1103141647618940958';
//create a new instance of the database
function ping(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isCommand())
            return;
        yield interaction.reply("Pong!");
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
function updateChannel(interaction, item) {
    return __awaiter(this, void 0, void 0, function* () {
        return "coming soon";
    });
}
function addItem(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return interaction.reply("Please provide an asset id");
        //try to get item data from the db, if it exists, return
        try {
            const item = yield DataBase_1.DataBase.getItem(assetId);
            if (!(item === null || item === void 0 ? void 0 : item.isNull()) || item == null)
                return interaction.reply("Item already exists in database! Updating the channel...");
            //delete the channel
        }
        catch (err) {
            //just continue
            yield interaction.reply("Added item to database!");
            const item = yield Item_1.Item.get(assetId);
            yield DataBase_1.DataBase.addItem(item);
            yield addItemChannel(interaction, item);
        }
    });
}
function deleteItem(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const assetId = interaction.options.getString('assetid');
        if (!assetId)
            return interaction.reply("Please provide an asset id");
        try {
            const item = yield DataBase_1.DataBase.getItem(assetId);
            console.log(item);
            if ((item === null || item === void 0 ? void 0 : item.data) == null)
                return interaction.reply("Item does not exist in database!");
            yield DataBase_1.DataBase.removeItem(assetId);
            //delete the channel with the name item.data.item_name-item.data.item_id
            yield interaction.reply("Deleted item from database!");
            //delete the channel
        }
        catch (err) {
            console.log(err);
            yield interaction.reply("An error occured!");
        }
    });
}
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
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
}));
//when the bot is ready
client.on('ready', () => {
    if (!client.user)
        throw new Error("Client user is null");
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login("MTEwMzA4NDIyOTMyNTI0NjQ4NA.Gnahey.H0Ho1QcroQola9sN-Jm6ABf73HOfsIZSy9RFdk");
