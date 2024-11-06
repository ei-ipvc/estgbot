import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'
import IPVCCalendar from '../../assets/ipvc-calendar.json'

const normalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()


const calendarEmbed =  (semester: number) => {
  const embed = new EmbedBuilder()
    .setColor(defaultColor)
    .setTitle('📅 Calendário')
    .setFooter({
      text: `⚠️ Se encontrares algum erro, avisa a moderação! | 📅 Atualizado em 4/11/2024`,
    })

  if (!semester) {
    embed.setImage(`https://cdn.discordapp.com/app-assets/1230618188727849141/1303479115508088953.png?size=4096`)
  } else {
    const half = IPVCCalendar.half.find((h) => h.id === semester)
    if (half) {
      embed.addFields(
        { name: '\u200B', value: `**${half.id}º Semestre** (de ${half.begin} a ${half.end})` },
        { name: '\u200B', value: '**Paragens Letivas**' }
      )

      half.interruptions.forEach((int) => {
        embed.addFields({
          name: normalize(int.type),
          value: `de ${int.begin} a ${int.end}`,
          inline: true,
        })
      })

      embed.addFields({
        name: 'Feriados',
        value: half.holydays.reduce((prev, curr) => `${prev}\n${curr}`),
      })

      embed.addFields({ name: '\u200B', value: '**Exames**' })

      half.exams.forEach((int) => {
        embed.addFields({
          name: normalize(int.type),
          value: `de ${int.begin} a ${int.end}`,
          inline: true,
        })
      })
    }
  }

  embed.addFields({
    name: '\u200B',
    value: '🔗 [Documento Oficial](https://www.ipvc.pt/wp-content/uploads/2024/03/Calendario-Escolar-2024-25.pdf)',
  })

  return embed
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendario')
    .setDescription('Mostra o calendário escolar da ESTG')
    .addNumberOption((option) =>
      option
        .setName('semestre')
        .setDescription('Semestre a apresentar')
        .addChoices(
          { name: '1º Semestre', value: 1 },
          { name: '2º Semestre', value: 2 },
        ),
    ),
  async execute(interaction: any) {
    const semester = interaction.options.getNumber('semestre')
    const embed = calendarEmbed(semester)

    await interaction.reply({ embeds: [embed] })
  },
}
