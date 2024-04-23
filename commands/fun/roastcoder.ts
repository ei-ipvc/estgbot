import { SlashCommandBuilder } from 'discord.js'

const roasts = [
  'o garbage collector se pudesse, limparia o teu código em vez de memória.',
  'até o Project Diagnostics do IDE crashava ao tentar perceber os erros do teu código.',
  'nem para PHP serve.',
  'nem o Ribeiro consegue usá-lo.',
  'nem o IDE perceberia que linguagem de programação estás a usar.',
  'o Copilot se pudesse, mandava-te foder.',
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roastcoder')
    .setDescription('Da roast a um eng., cada vez que fizer asneiras'),
  async execute(interaction: { reply: (arg0: string) => void }) {
    interaction.reply(
      `O teu código é tão merda que ${
        roasts[Math.floor(Math.random() * roasts.length)]
      }`,
    )
  },
}
