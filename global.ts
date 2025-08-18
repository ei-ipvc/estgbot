import { ActivityType, Client, ColorResolvable } from 'discord.js'
require('dotenv').config()

// embeds
const defaultColor = '#2d79c7' as ColorResolvable

// fun
const pea = [
  '<:peepoHapper:1157850009346244658>',
  '<:poggies:1232020108788891779>',
] as string[]
const pogEmoji = () => pea[Math.floor(Math.random() * pea.length)]

function timestamp(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// activity
const updtMemberCountActivity = (client: Client) => {
  const guild = client.guilds.cache.get(process.env.SERVERID as string)
  client.user?.setPresence({
    activities: [
      {
        name: `${guild?.memberCount} marujos ⛵️`,
        type: ActivityType.Listening,
      },
    ],
  })
}

export { defaultColor, pogEmoji, timestamp, updtMemberCountActivity }
