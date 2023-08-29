const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {console.log(`Ready! Logged in as ${c.user.tag}`);});


const threadChannelId = "CHANNEL ID"

client.on(Events.MessageCreate, async (message) => {
    if(message.author.bot) return;

    if (message.channelId === threadChannelId) {
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setAuthor({name : message.author.displayName, iconURL : message.author.avatarURL()})
            .setTimestamp()
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/5175/5175820.png")
            .setDescription(`\`\`\`${message.content}\`\`\``)

        await message.channel.send({embeds : [embed]}).then(newMessage => {
            newMessage.startThread({
                name : message.author.displayName,
                autoArchiveDuration : 60,

                type : "GUILD_PUBLIC_THREAD"
            }).then(thread => {
                thread.members.add(message.author)
            })
        })
        await message.delete();
    }
});

client.login(process.env.CLIENT_TOKEN);