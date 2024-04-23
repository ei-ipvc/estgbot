import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'

const embed = new EmbedBuilder()
  .addFields({
    name: 'PHP DEVELOPER?',
    value: 'Get a life <:MonkaGun:779681578816765952>',
  })
  .setColor(defaultColor)
  .setThumbnail('https://whydoesitsuck.com/why-does-php-suck/thumbnail.png')
  .setTitle('Are you dumb?')

module.exports = {
  data: new SlashCommandBuilder().setName('php').setDescription('Mata-te só'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
