import { Events, MessagePayload, MessageReplyOptions } from 'discord.js'

const keywords = [
  'astronauta',
  'ribeirinho',
  'ribeiro',
  'ribas',
  'máchine',
  'nosso lider',
]

module.exports = {
  name: Events.MessageCreate,
  execute(message: {
    content: string
    author: { bot: boolean }
    react: (arg0: string) => void
    reply:  (options: string | MessagePayload | MessageReplyOptions) => void
  }) {
    if (message.author.bot) return

    if (message.content.toLowerCase().includes("aserio")) {
      message.reply("https://i.imgur.com/NjE7ZYm.png")
    }

    const content = message.content.replace(
      '<:ribeiro3:855147982110457877>',
      '',
    )

    if (
      keywords.some((word) => content.toLowerCase().includes(word)) &&
      Math.random() <= 0.326 // 32.5% chance of reacting
    ) {
      message.react('🇷')
      message.react('🇮')
      message.react('🇧')
      message.react('🇦')
      message.react('🇸')
      message.react('🐐')
    }
  },
}
