import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor, timestamp } from '../global'
import IPVCCalendar from '../assets/ipvc-calendar.json'

function dateToUnix(dateStr: string): string {
  const [day, month, year] = dateStr.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  date.setHours(date.getHours() + 18)
  return `<t:${Math.floor(date.getTime() / 1000)}:d>`
}

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setDescription('## 📅 Calendário Escolar')
  .setFooter({
    text: `📅 Atualizado no `,
  })
  .setTimestamp(timestamp(IPVCCalendar.lastUpdated))

IPVCCalendar.halfs.forEach((half, idx) => {
  embed.addFields({
    name: idx === 0 ? '' : '\u200B',
    value: `**${half.id}º semestre** (de ${dateToUnix(
      half.begin,
    )} a ${dateToUnix(half.end)})`,
  })

  half.interruptions.forEach((int) => {
    embed.addFields({
      name: int.type,
      value: `de ${dateToUnix(int.begin)} a ${dateToUnix(int.end)}`,
      inline: true,
    })
  })

  embed.addFields({
    name: 'Feriados',
    value: half.holidays.map((date) => `- ${dateToUnix(date)}`).join('\n'),
  })
})

embed.addFields({
  name: '\u200B',
  value: `🔗 [Documento oficial](${IPVCCalendar.document})\n⚠️ **Datas sujeitas a alterações**!\n-# Se encontrares algum erro, avisa a <@&766292682283810826>`,
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendário')
    .setDescription('Mostra o calendário escolar da ESTG'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    interaction.reply({ embeds: [embed] })
  },
}
