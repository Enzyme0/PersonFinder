//discord js
//const { Client, GatewayIntentBits, messageLink, ActionRow, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction} = require('discord.js');
import { Client, GatewayIntentBits, messageLink, ActionRow, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, CacheType, ChannelFlagsBitField, ChannelType, ChannelFlags, Attachment, AttachmentBuilder, AttachmentData, Embed, Channel} from 'discord.js';
//.env 

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
  ],
});

//dotenv
require('dotenv').config();
//mongodb
import { DataBase } from "./classes/DataBase";
import { Item } from "./classes/Item";
import { RobloxAPI } from './classes/RobloxAPI';
//rolimons api
import { API } from "./classes/API";
import { inspect } from "util";
import fetch from 'node-fetch';
import { Pretty } from './classes/Pretty';
//create a new instance of the api
const api = new API();
const itemChannel = '1103141647618940958'
//create a new instance of the database

type itemData = {
    item_name: string,
    item_id: number,
    channel : Channel
}



async function ping(interaction : Interaction<CacheType>) {
    if(!interaction.isCommand()) return;
   await reply(interaction, "Pong!");
}

async function reply(interaction : Interaction<CacheType>, message : string) {
    //check to see if its itemData
    if(!interaction.isCommand()) return;
    try
    {
        await interaction.reply(message);
    }
    catch(err)
    {
        console.log(err);
    }
}

async function addItemChannel(interaction : Interaction<CacheType>, item : Item) {
    if(!interaction.isChatInputCommand()) return;
    if(!interaction.inCachedGuild()) return;
    const assetId = interaction.options.getString('assetid'); if(!assetId) return;;
    //create a new channel for the item, with the name itemname-itemid
    const channel = await interaction.guild?.channels.create( {
        name: `${item.data.item_name}-${item.data.item_id}`,
        type: ChannelType.GuildText,
        parent: itemChannel,
        permissionOverwrites: [
            {
                id: interaction.guild?.roles.everyone.id,
                deny: ['ViewChannel'],
            },
        ],
    });
    //send the item data to the channel
    //turn value into a string cuz for some reason it's a number

    try{
        const owners = item.data.owners ?? "0";
        const value = item.data.value ?? "N/A";
        const demand = item.data.demand ?? "N/A";
        const rap = item.data.rap ?? "N/A";
        await channel?.send({embeds: [new EmbedBuilder()
            .setTitle("New item added! " + item.data.item_name)
            .setURL(`https://www.rolimons.com/item/${item.data.item_id}`)
            .setThumbnail(item.data.thumbnail_url_lg)
            .addFields(
                {name: "Best Price", value: item.data.best_price.toLocaleString(), inline: true},
                {name: "Owners", value: owners, inline: true},
                {name: "Value", value: value, inline: true},
                {name: "Demand", value: demand, inline: true},
                {name: "Rap", value: rap, inline: true},
            )
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
        ]});
    }
    catch(err) {
        console.log(err);
    }
    



}
async function updateChannel(assetId : string) {
    //refresh the channel with the new item data
    Item.update(assetId);
    const item = await Item.get(assetId);
    //get the channel with the name itemname-itemid

    //search for the channel in the category itemChannel of the guilds
    const guildId = "1103083544718348308";
    const guild = await client.guilds.fetch(guildId);
    let name = item.data.item_name.replace(/ /g, "-").toLowerCase();
    const channel = guild.channels.cache.find(channel => channel.name === `${name}-${item.data.item_id.toLowerCase()}` && channel.parentId === itemChannel);
    //throw if not text channel
    if(!channel?.isTextBased()) throw new Error("Channel is not a text channel!");
    //get the actual channel
    //say "updating channel..."
    await channel?.send("Updating channel...");
    //send the item data to the channel
    //turn value into a string cuz for some reason it's a number
    try
    {
        const owners = item.data.owners ?? "0";
        const value = item.data.value ?? "N/A";
        const demand = item.data.demand ?? "N/A";
        const rap = item.data.rap ?? "N/A";
        await channel?.send({embeds: [new EmbedBuilder()
            .setTitle("New item added! " + item.data.item_name)
            .setURL(`https://www.rolimons.com/item/${item.data.item_id}`)
            .setThumbnail(item.data.thumbnail_url_lg)
            .addFields(
                {name: "Best Price", value: item.data.best_price.toLocaleString(), inline: true},
                {name: "Owners", value: owners, inline: true},
                {name: "Value", value: value, inline: true},
                {name: "Demand", value: demand, inline: true},
                {name: "Rap", value: rap, inline: true},
            )
            ]});
    }
    catch(err)
    {
        console.log(err);
    }

}


async function buildTxtFile(largeText: string)
{
    //create a text file and send as attachment for discord (to send the entire list of owners)
    //create a buffer from the string
    const buffer = Buffer.from(largeText, 'utf-8');
    const attachmentData = {
        name: "owners.txt",
        description: "Owners of the item",
    }
    const attachment = new AttachmentBuilder(buffer, attachmentData);

    //return the attachment
    return attachment;

}

async function addItem(interaction : Interaction<CacheType>) {
    if(!interaction.isChatInputCommand()) return;
    const assetId = interaction.options.getString('assetid'); if(!assetId) return reply(interaction, "Please provide an asset id");
    //try to get item data from the db, if it exists, return
    try{
        const item = await DataBase.getItem(assetId);
        console.log(item)
        if(!item == null) return reply(interaction, "Item already exists in database! Updating the channel...");
        //delete the channel
    }
    catch(err) {
        //just continue
    }
    await reply(interaction, "Adding to database...");
    const item = await Item.get(assetId);
    const owners = await api.getOwnershipData(assetId);
    //edit reply to say Added (item name) to database with (owners.length) owners
    await interaction.editReply(`Added ${item.data.item_name} to database with ${owners.length} owners!`);
    await DataBase.addItem(item, owners);
    await addItemChannel(interaction, item);


}
async function userIdFromEmbed(embed: Embed)
{
    const userName = embed.fields[0].value;
    return userName;

}
async function deleteItem(interaction: Interaction<CacheType>)
{
    if(!interaction.isChatInputCommand()) return;
    const assetId = interaction.options.getString('assetid'); if(!assetId) return reply(interaction, "Please provide an asset id");
    try{
        const item = await DataBase.getItem(assetId);
        if(!item) return reply(interaction, "Item does not exist in database!, failed at non-exist check.");
        if(item?.isNull()) return reply(interaction, "Item does not exist in database!, failed at isNull check.");
        await DataBase.removeItem(assetId);
        //delete the channel with the name item.data.item_name-item.data.item_id
        //look in the category itemChannel
        //replace the spaces in the name with -
        let tempName = item.data.item_name.replace(/ /g, "-");
        let tempId = item.data.item_id;
        console.log(tempName+ "-" +tempId)
        const channel = interaction.guild?.channels.cache.find(channel => channel.name === `${tempName.toLowerCase()}-${tempId}` && channel.parentId === itemChannel);
        if(!channel) return reply(interaction,"Channel does not exist!");
        await channel.delete();
        await reply(interaction, "Deleted item from database!");
        //delete the channel
    }
    catch(err) {
        console.log(err);
        await reply(interaction, "An error occured!");
    }
}
async function getOwners(interaction: Interaction<CacheType>)
{
    //run db.getAllUsers(itemid)
    if(!interaction.isChatInputCommand()) return;
    const assetId = interaction.options.getString('assetid'); if(!assetId) return reply(interaction, "Please provide an asset id");
    const item = await DataBase.getItem(assetId);
    if(!item) return reply(interaction, "Item does not exist in database!");
    if(item?.isNull()) return reply(interaction, "Item does not exist in database!");
    //run RobloxAPI.getOnline(assetId)
    await reply(interaction, "Getting owners...");
    let owners : any[] = await RobloxAPI.getOnline(assetId);
    //remove all banned users
    let banned = await DataBase.allBanned();
    const ids = await Pretty.getIds(banned);
    //make banned an array of userids
     //remove all owners that include ids
     //remove all undefined owners
     for(let i = 0; i < owners.length; i++)
     {
         if(owners[i] == undefined)
         {
             owners.splice(i, 1);
         }
     }
     let Strings = JSON.stringify(owners);
     let temp = JSON.parse(Strings);
    for(let i = owners.length - 1; i >= 0; i--)
    {
        //not using .includes cuz it says its not a function
        for(let j = 0; j < ids.length; j++)
        {
            console.log(owners[i])
            console.log(`debug: ${owners[i].userId.toString()} ${ids[j].toString()}`)
            if(owners[i].userId.toString() == ids[j].toString())
            {
                console.log("removing banned user " + owners[i].userId.toString())
               temp.splice(i, 1);
            }
        }
    }
    owners = temp;
    console.log(owners)
    if(owners.length == 0) return interaction.editReply("No owners found!");
    const userIds = [];
    for(let i = 0; i < owners.length; i++)
    {
        userIds.push(owners[i].userId);
    }

    let responses = await Pretty.pretty(item, owners);
    //send the owners in a message
    //owners is a string
    let embeds = responses.embeds;
    let rows = responses.rows;
    const messages = [];
    for(let i = 0; i < embeds.length; i++)
    {
        try
        {
            await interaction.channel?.send({components: [rows[i]], embeds: [embeds[i]]}).then(message => messages.push(message));
        }
        catch(err)
        {
            console.log(err);
        }
        
    }
}   
async function getOwnerIds(interaction: Interaction<CacheType>)
{
    if(!interaction.isChatInputCommand()) return;
    const assetId = interaction.options.getString('assetid'); if(!assetId) return reply(interaction, "Please provide an asset id");
    const item = await DataBase.getItem(assetId);
    if(!item) return reply(interaction, "Item does not exist in database!");
    if(item?.isNull()) return reply(interaction, "Item does not exist in database!");
    //run db.getAllUsersWithItem(itemid)
    await reply(interaction, "Getting owners..."); 
    const owners = await DataBase.getAllUsersWithItem(assetId);
    //send the owners in a message
    const attachment = await buildTxtFile(owners.join(", "));
    await interaction.editReply({content: `Owners of ${item.data.item_name} (${owners.length}):`, files: [attachment]});
}
client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'ping') {
        await ping(interaction);
    }
    if(interaction.commandName === 'additem') {
        await addItem(interaction);
    }
    if(interaction.commandName === 'removeitem') {
        await deleteItem(interaction);
    }
    if(interaction.commandName === 'getowners') {
        await getOwners(interaction);
    }
    if(interaction.commandName === 'getuserids') {
        await getOwnerIds(interaction);
    }
    if(interaction.commandName === 'eval') {
        const code = interaction.options.getString('code'); if(!code) return reply(interaction, "Please provide code");
        try{
            //robloxapi define
           
            let evaled = eval(code)
            if(!evaled) return reply(interaction, "Success! But no output.");
            if(typeof evaled !== "string") evaled = inspect(evaled).toString();
            if(evaled.length > 2000) return reply(interaction, "Output too long!");
            //temp
            let temp = await RobloxAPI.fetchData("https://users.roblox.com/v1/users/authenticated", null, null);
            let yonk = JSON.stringify(temp);
            await interaction.reply(yonk);
        }
        catch(err: any) {
            await reply(interaction, err.toString());
        }
    }
    if(interaction.commandName === 'update')
    {
        const assetId = interaction.options.getString('assetid'); if(!assetId) return reply(interaction, "Please provide an asset id");
        await updateChannel(assetId);
    }
});
//buttons
client.on('interactionCreate', async interaction => {
    if(!interaction.isButton()) return;
    //ban
    if(interaction.customId === 'ban') {
        //get the user id from the embed
        const userId = await userIdFromEmbed(interaction.message.embeds[0]);
        //ban the user
        await interaction.reply({content: `Banned ${userId}`, ephemeral: true});
        await DataBase.ban(userId);
    }
});

















//when the bot is ready
client.on('ready', () => {
    if(!client.user) 
        throw new Error("Client user is null");
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login("MTEwMzA4NDIyOTMyNTI0NjQ4NA.Gnahey.H0Ho1QcroQola9sN-Jm6ABf73HOfsIZSy9RFdk")