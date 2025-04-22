import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import 'dotenv/config'; // Assuming you are using dotenv for environment variables

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Bot is logged in as ${client.user.tag}`);
});

// Create private channel for mentor
async function createMentorChannel(guildId, mentorName) {
  try {
    console.log(`Attempting to fetch guild with ID: ${guildId}`); // Log the guildId
    const guild = await client.guilds.fetch(guildId); // Fetch the guild

    if (!guild) {
      console.error(`Error: Guild with ID ${guildId} not found.`);
      return null;
    }

    // Check if bot has permission to create channels
    const botMember = await guild.members.fetch(client.user.id);
    if (!botMember.permissions.has('MANAGE_CHANNELS')) {
      console.error('Bot does not have permission to manage channels');
      return null;
    }

    const channel = await guild.channels.create({
      name: `${mentorName}-group`,
      type: ChannelType.GuildText, // 0 = text, use ChannelType.GuildText for clarity
    });

    console.log(`🎉 Channel "${mentorName}-group" created!`);
    return channel;

  } catch (error) {
    console.error('Error creating mentor channel:', error);
    return null;
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);

export { createMentorChannel };
