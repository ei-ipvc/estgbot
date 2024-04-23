import { SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Comando de teste'),
  async execute(interaction: {
    reply: (arg0: string) => void
    createdTimestamp: number
  }) {
    return interaction.reply(
      `🏓 \`${Date.now() - interaction.createdTimestamp}ms\``,
    )
  },
}
