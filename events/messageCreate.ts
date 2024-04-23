import { Events } from 'discord.js';

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
    if (
      keywords.some((keyword) =>
        message.content.toLowerCase().includes(keyword),
      ) &&
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
