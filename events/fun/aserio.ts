import { Message } from 'discord.js'

export const checkAserio = (message: Message) => {
  if (message.content.toLowerCase().includes('aserio'))
    message.reply('https://i.imgur.com/NjE7ZYm.png')
}
