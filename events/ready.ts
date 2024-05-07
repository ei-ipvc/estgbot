import { Client, Events } from 'discord.js'
import { updtMemberCountActivity } from '../global'

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log('Ready!')
    updtMemberCountActivity(client)
  },
}
