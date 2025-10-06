import { SlashCommandBuilder } from 'discord.js'
import axios from "axios"

const ELECTION_HOMEPAGE_URL = "https://www.eleicoes.mai.gov.pt/autarquicas2021/resultados/territorio-nacional?local=LOCAL-131300"
const ELECTION_DATA_URL = "https://www.eleicoes.mai.gov.pt/autarquicas2021/assets/static/territory-results/territory-results-LOCAL-131315-CM.json"
const USER = "356797115298611200"

const phrases = [
  "NAME arrasa com uns impressionantes **VOTES votos!**",
  "NAME mostra quem manda com **VOTES votos**!",
  "NAME deixa Mortágua com orgulho. **VOTES votos**!",
  "NAME simplesmente imparável — ninguém esperava VOTES votos (nem ele)!",
  "NAME para a câmara municipal quando? **VOTES votos**!",
  "NAME. Valeu a pena ir levar os panfletos. **VOTES votos**!"
]

function isWinning(partyResults: any): boolean {
  return partyResults[0].acronym == "B.E."
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autarquicas')
    .setDescription(
      'Apoiar o nosso candidato!',
    ),
  async execute(interaction: {
    reply: (arg0: {
      embeds: any[]
    }) => void
  }) {
    const data = (await axios.get(ELECTION_DATA_URL)).data

    const beData = data.currentResults.resultsParty.find((x: any) => x.acronym == "B.E.")
    const beVotes = beData.votes.toString()

    return interaction.reply({
      embeds: [{
        title: "Autárquicas Beiriz 2025",
        url: ELECTION_HOMEPAGE_URL,
        description: isWinning(data.currentResults.resultsParty)
          ? `WTF? O <@${USER}> ESTÁ A GANHAR?`
          : phrases[Math.floor(Math.random() * phrases.length)]
            .replace("NAME", `<@${USER}>`)
            .replace("VOTES", beVotes),
        fields: data.currentResults.resultsParty.map((party: any) => ({
          name: party.acronym,
          value: `${party.votes} votos (${party.percentage}%)`
        })),
        thumbnail: {
          url: "https://lusojornal.com/wp-content/uploads/2017/07/Beblocoesquerda.png"
        },
        color: 0xbf4040
      }]
    })
  },
}
