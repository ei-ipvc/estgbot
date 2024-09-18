import { Events, GuildMember, TextChannel } from 'discord.js'
import { client } from '../index'
import { updtMemberCountActivity } from '../global'

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    if (member.user.bot) return

    const channel = member.guild.channels.cache.find((ch) =>
      ch.name.includes('chat-geral'),
    ) as TextChannel
    await channel.send(
      `Boas ${member}! Sê bem-vindo ao discord de Engenharia Informática do IPVC 👋`,
    )

    const emojis = [
      '<:catHappy:1285662157316427796>',
      '<:pepeOkay:1285662139033321585>',
      '<:peepoHappy:1285662121375432795>',
      '<a:peepoParty:1285662104317067324>',
      '<:lookinLeftPog:1285662088542290035>',
      '<:peepoSmile:1285662066992087082>',
      '<:pepeCool:1285662044980514907>',
      '<:peepoCool:1285662026559000647>',
      '<:poggies:1285662010326913065>',
      '<a:peepoSalute:1285661992090075217>',
      '<:peepoPog:1285661954731544647>',
    ]

    channel.messages
      .fetch({ limit: 5 })
      .then((msgs) => {
        const botMsg = msgs.find((msg) => msg.author.bot)
        if (botMsg)
          botMsg.react(emojis[Math.floor(Math.random() * emojis.length)])
      })
      .catch(console.error)

    updtMemberCountActivity(client)
  },
}
