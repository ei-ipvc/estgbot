import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import ServicesSchedule from '../../assets/services-schedule.json'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servicos')
    .setDescription('Obtem o horário de cada serviço do IPVC')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('servico')
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
    const service = interaction.options.getString('servico')
    const serviceObj = ServicesSchedule.service.find((s) => s.value == service)
    if (!serviceObj) {
      return interaction.reply({
        content: 'Serviço inexistente.',
        embeds: [],
        ephemeral: true,
      })
    }
    const fields = [
      {
        name: 'Horário',
        value: serviceObj.schedule.join(''),
      },
      {
        name: 'Horário excepcional',
        value: serviceObj.exceptionalSchedule?.join('') || 'Nenhum',
      },
      {
        name: 'Paragens Lectivas',
        value: serviceObj.breaks?.join('') || 'Nenhuma',
      },
      {
        name: 'Excepções',
        value: serviceObj.exceptions || 'Nenhuma',
      },
      {
        name: 'Telefone',
        value: serviceObj.phone,
      },
      {
        name: 'Email',
        value: serviceObj.email,
      },
    ]

    const embed = new EmbedBuilder()
      .setTitle(`Horário de ${serviceObj.name}`)
      .addFields(...fields)
      .setFooter({
        text: `⚠️ Horário sujeito a alterações ⚠️ | 📅 Atualizado em ${serviceObj.updated_at} 📅`,
      })

    return interaction.reply({ content: '', ephemeral: false, embeds: [embed] })
  },
}
