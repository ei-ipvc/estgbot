import * as cheerio from 'cheerio'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import horoscope from '../../assets/horoscope.json'
import { defaultColor } from '../../global'

export interface Prediction {
  text: string
}

export const getHoroscope = async (
  sign: String,
): Promise<Prediction | null> => {
  const url = `https://lifestyle.sapo.pt/astral/previsoes/maya?signo=${sign}`

  const response = await fetch(url)
  const data = await response.text()
  if (!response || !data) return null

  const $ = cheerio.load(data)
  const text = $('#diaria .horoscope-text p').last().text()

  if (!text) return null
  return {
    text: text,
  }
}
const embed = new EmbedBuilder()
  .setAuthor({
    name: 'Maya',
    iconURL:
      'https://cdn.discordapp.com/app-assets/1230618188727849141/1232026317441073183.png',
  })
  .setColor(defaultColor)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('horoscopo')
    .setDescription('Verifica o teu horóscopo')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('signo')
        .setDescription('Exemplo: aquario/carneiro/capricornio')
        .setChoices(...horoscope.signos),
    ),
  async execute(interaction: {
    reply: (arg0: { content: string; embeds: any[] }) => void
    options: { get: (arg0: string) => { value: string } }
    interaction: {
      reply: (arg0: {
        content: string
        embeds: {
          title: string
          description: string
          image: { url: string }
        }[]
      }) => void
    }
  }) {
    const sign = interaction.options.get('signo').value
    const prediction = await getHoroscope(sign)

    if (!prediction)
      return interaction.reply({
        content: 'Erro ao obter o horóscopo <:burCat:1232019409816649768>',
        embeds: [],
      })

    embed.addFields({
      name: 'Previsão',
      value: prediction.text,
    })
    embed.setTitle(
      `Horóscopo de ${sign.substring(0, 1).toUpperCase() + sign.substring(1)}`,
    )

    interaction.reply({
      content: '',
      embeds: [embed],
    })
  },
}
