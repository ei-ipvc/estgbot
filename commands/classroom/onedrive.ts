import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor, pogEmoji } from '../../global.js'

const arrNotes = [
  `Esta pasta tornar-se-á mais útil com as vossas contribuições ${pogEmoji()}`,
  'Se possível, adiciona novo conteúdo à pasta! O povo agradece <a:aPES_Salute:1232019890119114842>',
  'Podes observar todas as alterações feitas na pasta <#1201580569960644799> 👀',
]
const embed = new EmbedBuilder().setColor(defaultColor).setAuthor({
  name: 'Sharepoint ESTG',
  iconURL:
    'https://cdn.discordapp.com/app-assets/1230618188727849141/1231897476882104342.png',
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('onedrive')
    .setDescription('Manda o link do OneDrive com o conteúdo do curso'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    let description = ''
    if (Math.random() <= 0.399)
      // 40% chance of adding a note
      description = `\n**Nota:** ${
        arrNotes[Math.floor(Math.random() * arrNotes.length)]
      }`
    embed.setDescription(
      `[**Clica aqui para acederes à pasta de conteúdo do curso!**](https://ipvcpt-my.sharepoint.com/:f:/g/personal/amatossousa_ipvc_pt/EneYoFbWQHNAlh4MBOLhtVUByrmdpsR3EulU6BU5Wqp5ww?e=bTIVth)${description}`,
    )
    interaction.reply({ embeds: [embed] })
  },
}
