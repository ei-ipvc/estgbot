import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'
import IPVCCalendar from '../../assets/ipvc-calendar.json'

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setTitle('📅 Calendário')
  .setFooter({
    text: `⚠️ Se encontrares algum erro, avisa a moderação! ⚠️ | 📅 Atualizado em 17/08/2024 📅`,
  })

const normalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

IPVCCalendar.half.forEach((half) => {
  embed.addFields({
    name: '*------------------*',
    value: `**${half.id}º Semestre** (de ${half.begin} a ${half.end})`,
  })

  half.interruptions.forEach((int) => {
    embed.addFields({
      name: normalize(int.type),
      value: `de ${int.begin} a ${int.end}`,
    })
  })

  embed.addFields({
    name: 'Feriados',
    value: half.holydays.reduce((previous, current) => {
      current = previous + '\n' + current
      return current
    }),
  })
})

embed.addFields({
  name: '*------------------*',
  value:
    '🔗 [Documento Oficial](https://www.ipvc.pt/wp-content/uploads/2024/03/Calendario-Escolar-2024-25.pdf) 🔗',
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendario')
    .setDescription('Mostra o calendário escolar da ESTG'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
