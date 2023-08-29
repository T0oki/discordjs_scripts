const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {console.log(`Ready! Logged in as ${c.user.tag}`);});


const threadChannelIdList = [
    {channelId : "CHANNEL ID", roleId : "ROLE ID", prefix : "Staff - "},
    {channelId : "CHANNEL ID", roleId : "ROLE ID", prefix : "Crypto - "}
]


client.on(Events.MessageCreate, async (message) => {
    if(message.author.bot) return;

    const threadChannel = threadChannelIdList.find(item => item.channelId === message.channel.id);
    if (threadChannel) {
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setAuthor({name : message.author.displayName, iconURL : message.author.avatarURL()})
            .setTimestamp()
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/5175/5175820.png")
            .setDescription(`\`\`\`${message.content}\`\`\``)

        await message.channel.send({content :`<@&${threadChannel.roleId}>`, embeds : [embed]}).then(newMessage => {
            newMessage.startThread({
                name : `${threadChannel.prefix}${message.author.displayName}`,
                autoArchiveDuration : 60,

                type : "GUILD_PUBLIC_THREAD"
            }).then(async thread => {
                await thread.members.add(message.author)
            })
        })
        await message.delete();
    }
});

client.login(process.env.CLIENT_TOKEN);