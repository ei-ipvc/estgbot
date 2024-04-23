import { Events } from 'discord.js'
require('dotenv').config()
import { ActivityType } from 'discord.js'

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: {
    guilds: { cache: { get: (arg0: string) => any } }
    user: {
      setPresence: (arg0: { activities: { name: string; type: any }[] }) => void
    }
  }) {
    console.log('Ready!')

    const guild = client.guilds.cache.get(process.env.SERVERID as string)
    client.user.setPresence({
      activities: [
        {
          name: `${guild.memberCount} marujos ⛵️`,
          type: ActivityType.Listening,
        },
      ],
    })
  },
}
