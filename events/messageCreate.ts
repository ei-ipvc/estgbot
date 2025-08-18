import { Events, Message } from 'discord.js'
// automod
import { checkPrivateInfo } from './automod/private.js'
import { checkBadGifs } from './automod/badGifs.js'
import { checkBadImgs } from './automod/badImgs.js'
import { sendCalendar } from './automod/sendCalendar.js'

// fun
import { checkAserio } from './fun/aserio.js'
import { ribasReact } from './fun/ribas.js'
import { checkTap } from './fun/tap.js'

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return

    // automod / private
    await checkPrivateInfo(message)
    await checkBadImgs(message)
    checkBadGifs(message)
    sendCalendar(message)

    // fun
    checkAserio(message)
    ribasReact(message)
    checkTap(message)
  },
}
