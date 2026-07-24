const http = require('http');
http.createServer((req, res) => {
  res.write("Bot is Online!");
  res.end();
}).listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

const TOKEN = 'process.env.TOKEN';
const GUILD_ID = '885847193716662342';
const CHANNEL_ID = '885847193716662346';

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
  console.log(`Bot berhasil masuk sebagai ${client.user.tag}`);
  connectToVoice();
});

client.login(TOKEN);