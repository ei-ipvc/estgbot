import { Client, GuildMember, TextChannel } from 'discord.js'
import { pogEmoji, updtMemberCountActivity } from '../global'

module.exports = {
  name: 'guildMemberAdd',
  async execute(client: Client, member: GuildMember) {
    if (member.user.bot) return

    const channel = member.guild.channels.cache.find((ch) =>
      ch.name.includes('chat-geral'),
    ) as TextChannel
    await channel.send(
      `Boas ${member}! Sê bem-vindo ao discord de Engenharia Informática do IPVC 👋`,
    )

    const msg = await channel.messages.fetch({ limit: 1 })
    msg.first()?.react(pogEmoji())

    updtMemberCountActivity(client)
  },
}
