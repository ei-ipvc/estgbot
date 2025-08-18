import { Message } from 'discord.js'

const keywords = [
  'astronauta',
  'ribeirinho',
  'ribeiro',
  'ribas',
  'máchine',
  'nosso lider',
]

export const ribasReact = (message: Message) => {
  const content = message.content.replace('<:ribeiro3:855147982110457877>', '') // remove emoji from content
  if (
    keywords.some((word) => content.toLowerCase().includes(word)) &&
    Math.random() <= 0.326 // 32.6% chance to react
  ) {
    message.react('🇷')
    message.react('🇮')
    message.react('🇧')
    message.react('🇦')
    message.react('🇸')
    message.react('🐐')
  }
}
