import { Events, MessagePayload, MessageReplyOptions } from 'discord.js'
import { fixSocialMediaURLs } from '../commands/fun/socialMediaURLs'

const keywords = [
  'astronauta',
  'ribeirinho',
  'ribeiro',
  'ribas',
  'máchine',
  'nosso lider',
]

const tap_keywords = [
  "tap",
  "tap.",
  "tap!",
  "tap?"
]

module.exports = {
  name: Events.MessageCreate,
  execute(message: {
    content: string
    author: { bot: boolean }
    react: (arg0: string) => void
    reply: (options: string | MessagePayload | MessageReplyOptions) => void
  }) {
    if (message.author.bot) return

    if (message.content.toLowerCase().includes("aserio")) {
      message.reply("https://i.imgur.com/NjE7ZYm.png")
    } else if (message.content.toLowerCase().split(" ").find(x => tap_keywords.includes(x))) {
      message.reply("<@261925350680821770>")
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

    const messageWithCleanURLs = fixSocialMediaURLs(message.content)
    if(messageWithCleanURLs != null) {
      message.reply(`**Mensagem com URL(s) corrigido(s):**\n\n${messageWithCleanURLs}`)
    }
  },
}
