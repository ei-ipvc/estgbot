import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import ServicesSchedule from '../assets/services-schedule.json'
import { defaultColor, timestamp } from '../global'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serviços')
    .setDescription('Obtem informações de um serviço do IPVC')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('serviço')
        .setDescription('Serviço do IPVC')
        .setChoices(
          ...ServicesSchedule.service.map((service) => ({
            name: service.name,
            value: service.value,
          })),
        ),
    ),
  async execute(interaction: {
    options: { getString: (arg0: string) => any }
    reply: (arg0: {
      content: string
      ephemeral: boolean
      embeds: {
        setTitle: (arg0: string) => any
        addFields: (...args: any[]) => any
        setFooter: (arg0: { text: string }) => any
      }[]
    }) => void
  }) {
    const service = interaction.options.getString('serviço')
    const serviceObj = ServicesSchedule.service.find((s) => s.value == service)
    if (!serviceObj) {
      return interaction.reply({
        content: 'Serviço inexistente.',
        embeds: [],
        ephemeral: true,
      })
    }
    const fields = []
    if (serviceObj.email)
      fields.push({ name: 'Email', value: serviceObj.email })
    if (serviceObj.schedule && serviceObj.schedule.length)
      fields.push({ name: 'Horário', value: serviceObj.schedule.join('') })
    if (serviceObj.exceptionalSchedule && serviceObj.exceptionalSchedule.length)
      fields.push({
        name: 'Horário excepcional',
        value: serviceObj.exceptionalSchedule.join(''),
      })
    if (serviceObj.exceptions && serviceObj.exceptions.length)
      fields.push({ name: 'Excepções', value: serviceObj.exceptions })
    if (serviceObj.phone)
      fields.push({ name: 'Telefone', value: serviceObj.phone })

    const embed = new EmbedBuilder()
      .setColor(defaultColor)
      .setTitle(`Horário ${serviceObj.prepArticleCombo} ${serviceObj.name}`)
      .addFields(...fields)
      .addFields({
        name: '\u200B',
        value: `⚠️ **Horário sujeito a alterações!**\n-# Se encontrares algum erro, avisa a <@&766292682283810826>`,
      })
      .setFooter({ text: '📅 Atualizado no' })
      .setTimestamp(timestamp(serviceObj.updated_at))

    return interaction.reply({ content: '', ephemeral: false, embeds: [embed] })
  },
}
