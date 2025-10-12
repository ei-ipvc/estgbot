import { SlashCommandBuilder } from 'discord.js'
import axios from "axios"

const ELECTION_HOMEPAGE_URL = "https://www.autarquicas2025.mai.gov.pt/resultados/territorio-nacional?local=2272"
const ELECTION_DATA_URL = "https://www.autarquicas2025.mai.gov.pt/service/api/Result/territory"
const USER = "356797115298611200"

const phrases = [
  "NAME arrasa com uns impressionantes **VOTES!**",
  "NAME mostra quem manda com **VOTES**!",
  "NAME deixa Mortágua com orgulho. **VOTES**!",
  "NAME simplesmente imparável — ninguém esperava VOTES (nem ele)!",
  "NAME para a câmara municipal quando? **VOTES**!",
  "NAME. Valeu a pena ir levar os panfletos. **VOTES**!"
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
    const data = (await axios.post(ELECTION_DATA_URL, {
      "electionId": 1,
      "territoryId": "2272",
      "organId": 4
    })).data.data

    if(data.currentResults.votingState == "Unpublished")
      return interaction.reply({
        embeds: [{
          title: "Autárquicas Beiriz 2025",
          url: ELECTION_HOMEPAGE_URL,
          description: `Lá na terra do <@${USER}> **não sabem contar**.\nResultados ainda não foram lançados!`,
          thumbnail: {
            url: "https://lusojornal.com/wp-content/uploads/2017/07/Beblocoesquerda.png"
          },
          color: 0xbf4040
        }]
      })

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
            .replace("VOTES", `${beVotes} ${beVotes == 1 ? 'voto' : 'votos'}`),
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
