import { Events } from 'discord.js'

const err = {
  content:
    'Ocorreu um erro ao executar este comando <:feelsWeak:1192128377486852130>\nO erro foi reportado automaticamente aos devs.',
  ephemeral: true,
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: {
    isChatInputCommand: () => any
    client: { cmds: { get: (arg0: any) => any } }
    commandName: string
    replied: any
    deferred: any
    followUp: (arg0: { content: string; ephemeral: boolean }) => any
    reply: (arg0: { content: string; ephemeral: boolean }) => any
  }) {
    if (!interaction.isChatInputCommand()) return

    const cmd = interaction.client.cmds.get(interaction.commandName)
    try {
      await cmd.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred)
        await interaction.followUp(err)
      else await interaction.reply(err)
    }
  },
}
