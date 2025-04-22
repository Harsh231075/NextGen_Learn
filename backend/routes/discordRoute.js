import express from 'express';
import { createMentorChannel } from '../utils/discordBot.js';

const router = express.Router();

router.post('/create-mentor-channel', async (req, res) => {
  const { mentorName, guildId } = req.body; // Ensure guildId is passed from the frontend
  console.log(`Creating channel for mentor: ${mentorName} in guild: ${guildId}`);

  try {
    const channel = await createMentorChannel(guildId, mentorName);

    if (!channel) {
      return res.status(500).json({ error: 'Failed to create channel' });
    }

    // Save this channelId in mentor DB or any logic you want
    res.json({
      success: true,
      channelUrl: `https://discord.com/channels/${channel.guild.id}/${channel.id}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

export default router;
