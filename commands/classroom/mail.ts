import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { defaultColor } from '../../global.js'
import * as cheerio from 'cheerio'

import { db } from '../../index'

const getEmailsWebsite = async () => {
  const req = await fetch('https://www.ipvc.pt/estg/a-escola/corpo-docente/')
  if (req.ok) return await req.text()
  throw Error()
}
interface Teacher {
  fullName: string
  role: string
  email?: string
}
const getTeachersEmails = async () => {
  const emailsHtml = await getEmailsWebsite()
  const $ = cheerio.load(emailsHtml)

  const teachers: Teacher[] = []

  $('.link-005').each((_, el) => {
    const email = $(el)
      .find('.link-005-email a')
      .attr('href')
      ?.replace('mailto:', '')

    teachers.push({
      fullName: $(el).find('.link-005-item-title').text(),
      role: $(el).find('.link-005-item-subtitle').text(),
      email: email,
    })
  })

  return teachers
}
function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
const getMailByTeacherName = async (fullName: string) => {
  const teachers = await getTeachersEmails()
  const nameTokens = fullName.toLowerCase().split(' ')

  return teachers
    .filter(({ fullName: teacherFullName }) =>
      nameTokens.every((nameInputToken) =>
        normalize(teacherFullName).toLowerCase().includes(nameInputToken),
      ),
    )
    .slice(0, 10)
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mail')
    .setDescription(
      'Encontra o email de um docente da ESTG, através do seu nome',
    )
    .addStringOption((option) =>
      option
        .setName('nome')
        .setDescription('Nome do docente')
        .setRequired(true),
    ),
  async execute(interaction: {
    reply: (arg0: string) => any
    options: { get: (arg0: string) => { value: any } }
    editReply: (arg0: { content: string; embeds: EmbedBuilder[] }) => any
  }) {
    const embed = new EmbedBuilder().setColor(defaultColor).setTitle('Emails')

    const searchName = interaction.options.get('nome').value
    await interaction.reply('A procurar...')

    const words = searchName.split(' ')
    let query = 'SELECT * FROM mails WHERE 1=1'
    const params = []
    for (let i = 0; i < words.length; i++) {
      query += ` AND fullName LIKE ?`
      params.push(`%${words[i]}%`)
    }
    query += ' ORDER BY fullName ASC LIMIT 10'

    const emails = db.prepare(query).all(params) as {
      fullName: string
      email: string
    }[]

    if (emails.length) {
      emails.map(({ fullName, email }) => {
        embed.addFields({
          name: fullName,
          value: email,
        })
      })
      await interaction.editReply({ content: '', embeds: [embed] })
    }

    // reset fields & we're going to cross-check emails with the website
    embed.data.fields = []

    const teachers = await getMailByTeacherName(searchName)
    teachers.map(({ fullName, email }) => {
      db.prepare(
        'INSERT OR IGNORE INTO mails (fullName, email) VALUES (?, ?)',
      ).run(fullName, email)

      embed.addFields({
        name: fullName,
        value: email || 'Email não encontrado',
      })
    })

    if (!teachers.length)
      embed.setDescription(
        'Não foi possível encontrar o docente que procuras <:sadge:1232239200615665726>',
      )

    await interaction.editReply({ content: '', embeds: [embed] })
  },
}
