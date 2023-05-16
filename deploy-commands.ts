const { Client, GatewayIntentBits, messageLink, ActionRow, ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require('discord.js');
//.env 
require('dotenv').config();

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
  ],
});



//creating slash commands

client.on('ready', () => {
  client.application.commands.create({
    name: 'ping',
    description: 'Replies with Pong!'
  });
  //assetid : string
    client.application.commands.create({    
    name: 'additem',
    description: 'Adds an item to the database',
    options: [
        {
            name: 'assetid',
            description: 'The asset id of the item',
            type: 3,
            required: true,
        }
    ]
    });
    client.application.commands.create({
    name: 'removeitem',
    description: 'Removes an item from the database',
    options: [
        {
            name: 'assetid',
            description: 'The asset id of the item',
            type: 3,
            required: true,
        }
    ]
});
client.application.commands.create({
    name: 'getowners',
    description: 'Gets the owners of an item',
    options: [
        {
            name: 'assetid',
            description: 'The asset id of the item',
            type: 3,
            required: true,
        }
    ]
});
//getuserids
client.application.commands.create({
    name: 'getuserids',
    description: 'Gets the userids of an item',
    options: [
        {
            name: 'assetid',
            description: 'The asset id of the item',
            type: 3,
            required: true,
        }
    ]
});
//eval
client.application.commands.create({
    name: 'eval',
    description: 'Evaluates code',
    options: [
        {
            name: 'code',
            description: 'The code to evaluate',
            type: 3,
            required: true,
        }
    ]
});

});

client.login("MTEwMzA4NDIyOTMyNTI0NjQ4NA.Gnahey.H0Ho1QcroQola9sN-Jm6ABf73HOfsIZSy9RFdk");