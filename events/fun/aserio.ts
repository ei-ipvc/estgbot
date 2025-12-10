import { Message } from 'discord.js'

export const checkAserio = (message: Message) => {
  let msg = message.content.toLowerCase()
  if (msg.includes('aserio') || msg.includes('asserio'))
    message.reply('https://i.imgur.com/NjE7ZYm.png')
}
