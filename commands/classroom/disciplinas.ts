import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global'
import IPVCUCList from '../../assets/ipvc-uc-list.json'

const embed = new EmbedBuilder()
  .setColor(defaultColor)
  .setTitle('🔍 Disciplinas')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disciplinas')
    .setDescription(
      'Mostra as disciplinas a lecionar durante o decorrer do curso',
    )
    .addIntegerOption((option) =>
      option
        .setName('ano')
        .setDescription('Ano letivo')
        .setRequired(true)
        .setMaxValue(3)
        .setMinValue(1),
    ),
  async execute(interaction: {
    options: any
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    const year = interaction.options.get('ano').value

    const yearObj = IPVCUCList.years.find((y) => y.id == year)
    if (!yearObj) {
      return 'Ano inexistente.'
    }
    embed.addFields({
      name: `${yearObj.id}º ano`,
      value: 'Engenharia Informática',
    })

    yearObj.halfs.forEach((half) => {
      embed.addFields({
        name: '⠀',
        value: `**${half.id}º Semestre**`,
      })

      half.uc.forEach((u) => {
        embed.addFields({
          name: `${u.longName} (${u.name})`,
          value: `${u.workHours
            .map((h) => `${h.name}: ${h.hours}`)
            .join(' | ')} | ETC: ${u.etc}`,
          inline: true,
        })
      })
    })

    interaction.reply({ embeds: [embed] })
  },
}
