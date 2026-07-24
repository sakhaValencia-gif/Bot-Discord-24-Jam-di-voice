const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

const TOKEN = '';
const GUILD_ID = '';
const CHANNEL_ID = '';

function connectToVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log('Server tidak ditemukan. Cek GUILD_ID!');

  const connection = joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: true,
  });

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch (error) {
      connection.destroy();
      console.log('Koneksi terputus, mencoba masuk kembali...');
      setTimeout(connectToVoice, 5_000);
    }
  });
}

client.once('ready', () => {
  console.log(`Berhasil! Bot ${client.user.tag} sudah aktif!`);
  connectToVoice();
});

client.login(TOKEN);
