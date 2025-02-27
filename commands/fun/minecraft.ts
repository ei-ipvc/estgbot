import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

interface ServerDebugInfo {
  ping: boolean
  query: boolean
  srv: boolean
  querymismatch: boolean
  ipinsrv: boolean
  cnameinsrv: boolean
  animatedmotd: boolean
  cachehit: boolean
  cachetime: number
  cacheexpire: number
  apiversion: number
}

interface ServerProtocol {
  version: number
  name?: string
}

interface ServerMap {
  raw: string
  clean: string
  html: string
}

interface Motd {
  raw: string[]
  clean: string[]
  html: string[]
}

interface Player {
  name: string
  uuid: string
}

interface Plugin {
  name: string
  version: string
}

interface Mod {
  name: string
  version: string
}

interface Info {
  raw: string[]
  clean: string[]
  html: string[]
}

interface OnlineMinecraftServerStatus {
  online: true
  ip: string
  port: number
  hostname?: string
  debug: ServerDebugInfo
  version: string
  protocol?: ServerProtocol
  icon?: string
  software?: string
  map: ServerMap
  gamemode?: string
  serverid?: string
  eula_blocked?: boolean
  motd: Motd
  players: {
    online: number
    max: number
    list?: Player[]
  }
  plugins?: Plugin[]
  mods?: Mod[]
  info?: Info
}

interface OfflineMinecraftServerStatus {
  online: false
  ip?: string
  port?: number
  hostname?: string
  debug: ServerDebugInfo
}

type MinecraftServerStatus =
  | OnlineMinecraftServerStatus
  | OfflineMinecraftServerStatus

export const getMinecraftServerStatus =
  async (): Promise<MinecraftServerStatus> => {
    const url = `https://api.mcsrvstat.us/3/minecraft.capaz.dev`

    const response = await fetch(url)
    return await response.json()
  }

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Verificar estado do servidor de minecraft'),
  async execute(interaction: {
    reply: (arg0: { embeds: EmbedBuilder[] }) => void
  }) {
    const server = await getMinecraftServerStatus()

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setThumbnail('https://i.imgur.com/JUlnLT6.png')
      .setDescription(`${server.hostname}:${server.port}`)
      .setTitle('Minecraft EI')

    if (server.online)
      embed.addFields(
        {
          name: 'Versão',
          value: server.version,
        },
        {
          name: `A Jogar ${server.players.online}/${server.players.max}`,
          value: server.players.list?.map((x) => x.name).join('\n') ?? ' ',
        },
      )
    else
      embed.addFields({
        name: 'Servidor offline <:pepeHands:766303912696610827>',
        value: ' ',
      })

    interaction.reply({ embeds: [embed] })
  },
}
