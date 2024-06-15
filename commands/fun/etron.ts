import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setImage('https://i.imgur.com/7g09ZIw.jpeg')
  .setTitle('Eu e a minha beibi bu')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('etron')
    .setDescription('O carro da Inês'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
