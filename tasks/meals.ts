import { EmbedBuilder, TextChannel } from 'discord.js'
import { defaultColor } from '../global.js'
import * as cron from 'node-cron'
import { client } from '../index'

module.exports = {
  execute() {
    cron.schedule('30 20 * * 0,1,2,3,4', async () => {
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

      interface Meal {
        code: string
        translations: { name: string }[]
        prices: { description: string; price: number }[]
      }
      interface MealData {
        data: Meal[]
      }

      const processMeals = (mealData: MealData): (string | number)[][] => {
        return mealData.data
          .filter((meal) => meal.code.startsWith('PD_'))
          .map((meal) => {
            let mealType =
              meal.code.charAt(3) + meal.code.slice(4).toLowerCase()
            if (mealType === 'Vege') mealType = 'Vegetariano'

            const price = meal.prices.find(
              (price) => price.description === 'Preço Aluno',
            )!.price
            return [mealType, price, meal.translations[0].name]
          })
          .sort()
      }

      const lunchMeals = processMeals(lunchData),
        dinnerMeals = processMeals(dinnerData)

      const formatMeals = (meals: (string | number)[][]) =>
        meals
          .map((prop) => `**${prop[0]} — ${prop[1]}€**\n${prop[2]}`)
          .join('\n\n')

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

      const guild = await client.guilds.fetch(process.env.SERVERID as string),
        channel = guild.channels.cache.find((ch) =>
          ch.name.includes('ementas'),
        ) as TextChannel
      channel.send({ embeds: [embed] })
    })
  },
}
