import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'
import IPVCCalendar from '../../assets/ipvc-calendar.json'

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setTitle('📅 Calendário')

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
