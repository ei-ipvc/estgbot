import weatherTypes from '../../assets/weather-type-classe.json'
import districtIslands from '../../assets/distrits-islands.json'
import { EmbedBuilder } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const findEmoji = (type: number) => {
  let returnEmoji
  weatherTypes.data.forEach((element) => {
    if (element.idWeatherType == type) returnEmoji = element.weatherEmoji
  })
  return returnEmoji
}
const findType = (type: number) => {
  let returnType
  weatherTypes.data.forEach((element) => {
    if (element.idWeatherType == type) returnType = element.descIdWeatherTypePT
  })
  return returnType
}
const findLocationName = (idLocation: number) => {
  let location = ''
  districtIslands.data.forEach(
    (local: { globalIdLocal: number; local: string }) => {
      if (local.globalIdLocal === +idLocation) {
        location = local.local
      }
    },
  )
  return location
}
const fetchWeather = async (location: number): Promise<any> => {
  const url = `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${location}`
  const response = await fetch(url)
  return await response.json()
}
const embed = new EmbedBuilder()
  .setFooter({
    text: 'Powered by Engenheiro Rodrigo Sá',
  })
  .setColor('#0099ff')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meteo')
    .setDescription('Previsão meterológica para 3 dias')
    .addStringOption((option) =>
      option
        .setChoices(
          ...districtIslands.data.map(
            (location: { local: string; id: string }) => {
              return {
                name: location.local,
                value: location.id,
              }
            },
          ),
        )
        .setDescription('Exemplo: aquario/carneiro/capricornio')
        .setName('distrito')
        .setRequired(true),
    ),
  async execute(interaction: {
    options: { get: (arg0: string) => { value: any } }
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    const locationID: number =
      districtIslands.data[interaction.options.get('distrito').value - 1]
        .globalIdLocal

    const locationName = findLocationName(locationID)
    const weather = await fetchWeather(locationID)

    const [day1, day2, day3] = weather.data
    const day1emoji: string = findEmoji(day1.idWeatherType)!,
      day1type: string = findType(day1.idWeatherType)!
    const day2emoji: string = findEmoji(day2.idWeatherType)!,
      day2type: string = findType(day2.idWeatherType)!
    const day3emoji: string = findEmoji(day3.idWeatherType)!,
      day3type: string = findType(day3.idWeatherType)!

    embed.setTitle(`Previsão meterológica para ${locationName}`)
    embed.addFields(
      {
        name: 'Hoje',
        value: `${day1emoji}\t ${day1type}\n🌡Temperatura ➜ ${day1.tMin}ºC ~ ${day1.tMax}ºC\n💦Precipitação ➜ ${day1.precipitaProb}%`,
      },
      {
        name: 'Amanhã',
        value: `${day2emoji}\t ${day2type}\n🌡Temperatura ➜ ${day2.tMin}ºC~ ${day2.tMax}ºC\n💦Precipitação ➜ ${day2.precipitaProb}%`,
      },
      {
        name: 'Depois de amanhã',
        value: `${day3emoji}\t ${day3type}\n🌡Temperatura ➜ ${day3.tMin}ºC ~ ${day3.tMax}ºC\n💦Precipitação ➜ ${day3.precipitaProb}%`,
      },
    )

    interaction.reply({ embeds: [embed] })
  },
}
