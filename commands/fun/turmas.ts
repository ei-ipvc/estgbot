import { SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('turmas')
    .setDescription('A pergunta que não quer calar'),
  async execute(interaction: { reply: (arg0: string) => void }) {
    interaction.reply(
      'https://media.giphy.com/media/daPCSjwus6UR2JxRX1/giphy.gif',
    )
  },
}
