import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'

const embed = new EmbedBuilder()
  .addFields({
    name: 'Não chegava ser feio',
    value: 'Ainda tenho de levar com esta "Cruz"',
  })
  .setColor(defaultColor)
  .setImage(
    'https://cdn.discordapp.com/app-assets/1230618188727849141/1231918928998174811.png?size=512',
  )
  .setTitle('Estou triste')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('java')
    .setDescription('Porquê Java?'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
