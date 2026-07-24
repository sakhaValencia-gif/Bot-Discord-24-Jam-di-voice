const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

const TOKEN = 'TOKEN_HASIL_RESET_TERBARU_KAMU';
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
  console.log(`Berhasil! Bot ${client.user.tag} sudah aktif!`);
  connectToVoice();
});

client.login(TOKEN);