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
        .setName('piso')
        .setDescription('Número do piso a mostrar')
        .setChoices(
          { name: 'Piso 1', value: '0' },
          { name: 'Piso 2', value: '1' },
          { name: 'Piso 3', value: '2' },
        ),
    ),
  async execute(interaction: {
    options: { get: (arg0: string) => { value: any } }
    reply: (arg0: { content: string }) => void
    channel: { send: (arg0: { content: string }) => void }
  }) {
    const piso = Number(interaction.options.get('piso').value)
    interaction.reply({
      content: `https://cdn.discordapp.com/app-assets/1230618188727849141/${images[piso]}.png?size=4096`,
    })
    if (Math.random() <= 0.149) {
      // 15% chance of sending goIPVC message
      interaction.channel.send({
        content:
          '**Nota:** Podes facilmente vêr todos os pisos através da aplicação [goIPVC](https://github.com/ei-estg/goipvc/)! 📱<:booba:1232053843831816202>',
      })
    }
  },
}
