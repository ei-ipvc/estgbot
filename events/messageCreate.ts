import { Events } from 'discord.js'

module.exports = {
  name: Events.MessageCreate,
  execute(message: { content: string; react: (arg0: string) => Promise<any> }) {
    const keywords = [
      'astronauta',
      'ribeirinho',
      'ribeiro',
      'ribas',
      'máchine',
      'nosso lider',
    ]
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
