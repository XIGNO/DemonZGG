const {
  Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, Partials
} = require('discord.js');
const path = require('path');

// UZUPEŁNIJ:
const TOKEN = 'MTM5NzM2NjE1Nzk3MDg5OTAzNQ.G--Wr6.m4K1XTq_YnGQLETxI4eqaCG9YD-xmsDfZibNhE'; // <- Ustaw nowy token!
const WERYFIKACJA_CHANNEL_ID = '1395199349495173230'; // <- Skopiuj z Discorda
const ROLA_GRACZ = '1395053268388020235'; // lub ID roli

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  // ---- WERYFIKACJA WIADOMOŚĆ Z PRZYCISKIEM ----
  const channel = await client.channels.fetch(WERYFIKACJA_CHANNEL_ID);
  if (!channel) return console.log('❌ Nie znaleziono kanału weryfikacji!');

  const embed = new EmbedBuilder()
    .setColor('#8B0000')
    .setTitle('Weryfikacja')
    .setDescription('Kliknij przycisk poniżej, aby się **zweryfikować** i otrzymać rolę **Gracz**.')
    .setFooter({ text: 'DemonZGG' });

  const button = new ButtonBuilder()
    .setCustomId('verify')
    .setLabel('✅ Zweryfikuj się')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({ embeds: [embed], components: [row] });
});

// ---- POWITANIE Z OBRAZKIEM ----
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get('1395199331606466600'); // <- Kanał powitań
  if (!channel) return;

  const attachment = new AttachmentBuilder(path.join(__dirname, 'assets', 'demonz.png')).setName('demonz.png');

  const embed = new EmbedBuilder()
    .setColor('#8B0000')
    .setTitle(`Witaj ${member.user.username}!`)
    .setDescription(`Witamy na serwerze **DemonZGG**! Cieszymy się, że dołączyłeś.`)
    .setImage('attachment://demonz.png')
    .setFooter({ text: 'Miłego pobytu!', iconURL: member.user.displayAvatarURL() });

  channel.send({ embeds: [embed], files: [attachment] });
});

// ---- OBSŁUGA PRZYCISKU WERYFIKACJI ----
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify') {
    const role = interaction.guild.roles.cache.get(ROLA_GRACZ);
    if (!role) {
      return interaction.reply({ content: '❌ Nie znaleziono roli Gracz!', ephemeral: true });
    }

    try {
      await interaction.member.roles.add(role);
      await interaction.reply({ content: '✅ Zweryfikowano! Masz już rolę Gracz.', ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Coś poszło nie tak przy nadawaniu roli.', ephemeral: true });
    }
  }
});

client.login(TOKEN);




