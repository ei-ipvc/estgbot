import { Message } from 'discord.js'

export const checkTap = (message: Message) => {
  if (/\btap\b/gm.test(message.content.toLowerCase()))
    message.reply('<@159799471142600704>')
}
