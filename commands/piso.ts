import { SlashCommandBuilder } from 'discord.js'

const images = [
  '1232048623999516814',
  '1232048624159162510',
  '1232048623983001752',
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('piso')
    .setDescription('Mostra a planta de um piso selecionado da ESTG')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('número')
        .setDescription('Piso a mostrar')
        .setChoices(
          { name: '1', value: '0' },
          { name: '2', value: '1' },
          { name: '3', value: '2' },
        ),
    ),
  async execute(interaction: {
    options: { get: (arg0: string) => { value: any } }
    reply: (arg0: { content: string }) => void
    channel: { send: (arg0: { content: string }) => void }
  }) {
    const piso = Number(interaction.options.get('número').value)
    interaction.reply({
      content: `https://cdn.discordapp.com/app-assets/1230618188727849141/${images[piso]}.png?size=4096`,
    })
  },
}
