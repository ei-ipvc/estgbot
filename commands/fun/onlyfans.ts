import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setDescription(`Subscreve-te no meu [onlyfans](https://google.pt)`)
  .setFooter({
    text: 'Donate 2 me, I want more dynos',
  })
  .setImage(
    'https://media1.tenor.com/images/e855b2e04d85071ffec096ad48d56dc1/tenor.gif',
  )
  .setTitle('Onlyfans')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('onlyfans')
    .setDescription('Onlyfans'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
