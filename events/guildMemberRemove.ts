import { Events, GuildMember, TextChannel } from 'discord.js'
import { client } from '../index'
import { updtMemberCountActivity } from '../global'

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    if (member.user.bot) return

    const channel = member.guild.channels.cache.find((ch) =>
      ch.name.includes('chat-geral'),
    ) as TextChannel
    await channel.send(
      `${member.user.username} abandonou a nossa jangada ⛵️ Seguimos com ${member.guild.memberCount} marujos <:feelsBadMan:766306313663283241>`,
    )

    const msg = await channel.messages.fetch({ limit: 1 })
    msg.first()?.react('<a:aPES_Salute:1232019890119114842>')

    updtMemberCountActivity(client)
  },
}
