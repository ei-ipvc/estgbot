import { SlashCommandBuilder } from 'discord.js'

const gifs = [
  'https://media0.giphy.com/media/UfjQ4GvNMHlf1lBhOW/giphy.gif',
  'https://64.media.tumblr.com/tumblr_ly5tbgg9yj1qert2ho1_500.gif',
  'https://66.media.tumblr.com/521a199d71761032d3d6526b173063a7/tumblr_ooef1eyDxa1u521p1o1_500.gif',
  'https://64.media.tumblr.com/5bcf00a47daf396dc4c2831bc570e361/c7d90793f78490ac-4c/s400x600/0542026f14ae3d0b76ed70f1dd8e485af2b5aa60.gif',
  'https://c.tenor.com/kHxFsNtIQBYAAAAM/got-weed-happy.gif',
  'https://c.tenor.com/DU0O001vBSYAAAAM/chris-tucker-smoke.gif',
  'https://c.tenor.com/YtC70TuDxekAAAAM/vader-darth.gif',
  'https://c.tenor.com/qUVaVQTNxCQAAAAM/steven-colbert-baguette.gif',
  'https://c.tenor.com/GGsZ7_cG2bAAAAAM/smoke-cigarettes.gif',
  'https://c.tenor.com/8LSToAJJFSsAAAAM/smoke-weed.gif',
  'https://c.tenor.com/hqpfoL3c5WwAAAAM/puss-pass.gif',
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rodaesse')
    .setDescription(
      'Envia um charuto virtual para os que precisam descomprimir',
    ),
  async execute(interaction: { reply: (arg0: string) => void }) {
    interaction.reply(gifs[Math.floor(Math.random() * gifs.length)])
  },
}
