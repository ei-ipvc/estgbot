import { ColorResolvable } from 'discord.js'

// embeds
const defaultColor = '#2d79c7' as ColorResolvable,
  empty = '_ _'

// fun
const pea = [
  '<:peepoHapper:1157850009346244658>',
  '<:poggies:1232020108788891779>',
] as string[]
const pogEmoji = () => pea[Math.floor(Math.random() * pea.length)]

export { defaultColor, empty, pogEmoji }
