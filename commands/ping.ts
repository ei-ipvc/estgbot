import { SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Comando para testar a latência do bot'),
  async execute(interaction: { reply: (arg0: string) => void }) {
    interaction.reply('🏓')
  },
}
