const { Client, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {console.log(`Ready! Logged in as ${c.user.tag}`);});


client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    const commandName = "!thread ";

    if (message.content.startsWith(commandName)) {
        const threadSubject = message.content.slice(commandName.length);
        const threadName = `Thread de ${message.author.displayName}`;

        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setAuthor({ name: message.author.displayName, iconURL: message.author.avatarURL() })
            .setTimestamp()
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/5175/5175820.png")
            .setDescription(`\`\`\`${threadSubject}\`\`\``);

        const thread = await message.channel.threads.create({
            name: threadName,
            autoArchiveDuration: 60,
            startMessage: false
        });

        const joinThread = new ButtonBuilder()
            .setLabel('Voir le Thread')
            .setURL(thread.url)
            .setStyle(ButtonStyle.Link);

        const closeThread = new ButtonBuilder()
            .setCustomId('closeThread')
            .setLabel('Fermer le Thread')
            .setStyle(ButtonStyle.Danger);

        const rowJoinThread = new ActionRowBuilder().addComponents(joinThread);
        const rowCloseThread = new ActionRowBuilder().addComponents(closeThread);

        await Promise.all([
            message.delete(),
            thread.send({ embeds: [embed], components: [rowCloseThread] }),
            message.channel.send({ embeds: [embed], components: [rowJoinThread] })
        ]);

        const starterMessage = await thread.fetchStarterMessage();
        if (starterMessage) {
            await starterMessage.delete();
        }

        await thread.members.add(message.author);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isMessageComponent() && interaction.customId === "closeThread") {
        const channel = interaction.channel;
        if (!channel.isThread()) return;
        await interaction.deferUpdate();
        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setAuthor({name: `🔒 ${interaction.member.displayName} a fermé le thread !`})
            .setTimestamp();
        await channel.send({embeds: [embed]});
        await channel.setArchived();
    }
})

client.login(process.env.CLIENT_TOKEN);