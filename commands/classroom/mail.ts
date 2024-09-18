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
  email?: string
}
const getTeachersEmails = async () => {
  const emailsHtml = await getEmailsWebsite()
  const $ = cheerio.load(emailsHtml)

  const teachers: Teacher[] = []

  $('.link-005').each((_, el) => {
    const fullName = $(el).find('.link-005-item-title').text(),
      email = $(el)
        .find('.link-005-email a')
        .attr('href')
        ?.replace('mailto:', '')

    if (teachers.some((teacher) => teacher.fullName === fullName)) {
      return
    }

    teachers.push({
      fullName,
      email,
    })
  })

  return teachers
}
function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
const getMailByTeacherName = async (fullName: string) => {
  const teachers = await getTeachersEmails()
  const nameTokens = normalize(fullName).toLowerCase().split(' ')

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
    options: { get: (arg0: string) => { value: any } }

    deferReply: () => any
    editReply: (arg0: { content: string; embeds: EmbedBuilder[] }) => any
    reply: (arg0: string) => any
  }) {
    const embed = new EmbedBuilder().setColor(defaultColor).setTitle('Emails')

    const searchName = interaction.options.get('nome').value
    await interaction.deferReply()

    const words = searchName.split(' ')

    let query = 'SELECT * FROM mails WHERE 1=1'
    const params: string[] = []

    words.forEach((word: string) => {
      query += ' AND fullName LIKE ? COLLATE NOCASE'
      params.push(`%${word}%`)
    })

    query += ' ORDER BY fullName ASC LIMIT 10'

    const emails = db.prepare(query).all(params) as {
      fullName: string
      email: string
    }[]

    if (emails.length) {
      emails.forEach(({ fullName, email }) => {
        embed.addFields({
          name: fullName,
          value: email,
        })
      })
      await interaction.editReply({ content: '', embeds: [embed] })
    }

    // cross-check emails with the website
    const teachers = await getMailByTeacherName(searchName)
    if (teachers.length) {
      embed.data.fields = []

      teachers.map(({ fullName, email }) => {
        db.prepare(
          'INSERT OR IGNORE INTO mails (fullName, email) VALUES (?, ?)',
        ).run(fullName, email)

        embed.addFields({
          name: fullName,
          value: email || 'Email não encontrado',
        })
      })
    }

    if (!emails.length && !teachers.length)
      embed.setDescription(
        'Não foi possível encontrar o docente que procuras <:sadge:1232239200615665726>',
      )

    await interaction.editReply({ content: '', embeds: [embed] })
  },
}
