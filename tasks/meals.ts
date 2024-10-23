import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
} from 'discord.js'
import { defaultColor } from '../global.js'
import * as cron from 'node-cron'
import { client } from '../index'

interface Meal {
  code: string
  translations: { name: string }[]
  prices: { description: string; price: number }[]
}
interface MealData {
  data: Meal[]
}
let lunchMeals: (string | number)[][] = []
let dinnerMeals: (string | number)[][] = []
const processMeals = (mealData: MealData): (string | number)[][] => {
  return mealData.data
    .filter((meal) => meal.code.startsWith('PD_'))
    .map((meal) => {
      let mealType = meal.code.charAt(3) + meal.code.slice(4).toLowerCase(),
        mealTypeEN = ''

      switch (mealType) {
        case 'Carne':
          mealTypeEN = 'Meat'
          break
        case 'Peixe':
          mealTypeEN = 'Fish'
          break
        case 'Vege':
          mealType = 'Vegetariano'
          mealTypeEN = 'Vegetarian'
          break
      }

      const price = meal.prices.find(
        (price) => price.description === 'Preço Aluno',
      )!.price

      return [
        mealType,
        mealTypeEN,
        price,
        meal.translations[0].name,
        meal.translations[1].name,
      ]
    })
    .sort()
}
const formatMeals = (
  meals: (string | number)[][],
  english: Boolean = false,
) => {
  if (english)
    return meals
      .map((prop) => `**${prop[1]} — ${prop[2]}€**\n${prop[4]}`)
      .join('\n\n')
  else
    return meals
      .map((prop) => `**${prop[0]} — ${prop[2]}€**\n${prop[3]}`)
      .join('\n\n')
}

const btn = new ButtonBuilder()
    .setCustomId('english')
    .setLabel('English')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('<:flagUS:1297497526282358815>'),
  disabledBtn = new ButtonBuilder()
    .setCustomId('disabledEN')
    .setDisabled(true)
    .setLabel('English')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('<:flagUS:1297497526282358815>')
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  if (interaction.customId === 'english') {
    const today = new Date(),
      tmrw = today.getDate() + 1,
      currentMonth = today.getMonth() + 1

    const embed = new EmbedBuilder()
      .setColor(defaultColor)
      .setAuthor({
        name: 'SASocial - IPVC (ESTG)',
        iconURL: 'https://sasocial.sas.ipvc.pt/favicon.ico',
      })
      .setTitle(`**Tomorrow (${tmrw}/${currentMonth})**`)
      .addFields({
        name: '🍴 Lunch',
        value: formatMeals(lunchMeals, true),
      })
      .addFields({
        name: '_ _',
        value: '_ _',
      })
      .addFields({
        name: '🍴 Dinner',
        value: formatMeals(dinnerMeals, true),
      })

    embed.setFooter({
      text: "⚠️ English translation is provided by SASocial's API",
    })

    await interaction.reply({ embeds: [embed], ephemeral: true })
  }
})

module.exports = {
  execute() {
    cron.schedule('* * * * *', async () => {
      const req = await fetch(
          'https://sasocial.sas.ipvc.pt/api/authorization/authorize/device-type/WEB',
          {
            method: 'POST',
          },
        ),
        token = (await req.json()).data[0].token

      const today = new Date(),
        tmrw = today.getDate() + 1,
        tmrwISO = new Date(today.setDate(tmrw)).toISOString(),
        currentMonth = today.getMonth() + 1

      const lunch = await fetch(
          `https://sasocial.sas.ipvc.pt/api/alimentation/menu/service/1/menus/${tmrwISO}/lunch?withRelated=taxes,file`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        dinner = await fetch(
          `https://sasocial.sas.ipvc.pt/api/alimentation/menu/service/1/menus/${tmrwISO}/dinner?withRelated=taxes,file`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      const lunchData = await lunch.json(),
        dinnerData = await dinner.json()

      lunchMeals = processMeals(lunchData)
      dinnerMeals = processMeals(dinnerData)

      const guild = await client.guilds.fetch(process.env.SERVERID as string),
        channel = guild.channels.cache.find((ch) =>
          ch.name.includes('ementas'),
        ) as TextChannel
      const messages = await channel.messages.fetch({ limit: 32 })
      const oldMsg = messages.find((msg) => msg.author.id === client.user?.id)
      if (oldMsg)
        oldMsg.edit({
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(disabledBtn),
          ],
        })

      const embed = new EmbedBuilder()
        .setColor(defaultColor)
        .setAuthor({
          name: 'SASocial - IPVC (ESTG)',
          iconURL: 'https://sasocial.sas.ipvc.pt/favicon.ico',
        })
        .setTitle(`**Amanhã (${tmrw}/${currentMonth})**`)
        .addFields({
          name: '🍴 Almoço',
          value: formatMeals(lunchMeals),
        })
        .addFields({
          name: '_ _',
          value: '_ _',
        })
        .addFields({
          name: '🍴 Jantar',
          value: formatMeals(dinnerMeals),
        })
      await channel.send({
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(btn)],
        embeds: [embed],
      })
    })
  },
}
