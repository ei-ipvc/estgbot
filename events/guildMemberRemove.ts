import { GuildMember, TextChannel } from 'discord.js'

module.exports = {
  name: 'guildMemberRemove',
  async execute(member: GuildMember) {
    if (member.user.bot) return

    const channel = member.guild.channels.cache.find((ch) =>
      ch.name.includes('chat-geral'),
    ) as TextChannel
    channel.send(
      `${member.user.username} abandonou a nossa jangada ⛵️ Seguimos com ${member.guild.memberCount} marujos :feelsBadMan:`,
    )

    const msg = await channel.messages.fetch({ limit: 1 })
    msg.first()?.react('<a:aPES_Salute:1232019890119114842>')
  },
}