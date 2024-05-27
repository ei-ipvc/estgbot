import Database from 'better-sqlite3'

import { Client, Collection, GatewayIntentBits } from 'discord.js'

import fs from 'fs'
import path from 'path'

require('dotenv').config()

const db = new Database('./database.db')

interface CustomClient extends Client {
  cmds: Collection<any, any>
}
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
}) as CustomClient

// commands
client.cmds = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const cmdFolders = fs.readdirSync(foldersPath)
console.log('Loading commands...')
for (const folder of cmdFolders) {
  console.log(`${folder}:`)
  const cmdsPath = path.join(foldersPath, folder)
  const cmdFiles = fs
    .readdirSync(cmdsPath)
    .filter((file: string) => file.endsWith('.js'))
  for (const file of cmdFiles) {
    const filePath = path.join(cmdsPath, file)
    const cmd = require(filePath)
    if ('data' in cmd && 'execute' in cmd) {
      client.cmds.set(cmd.data.name, cmd)
      console.log(`\t[ + ] ${cmd.data.name}`)
    } else
      console.error(
        `The cmd @${filePath} is missing a required "data" or "execute" property.`,
      )
  }
}
console.log('')

// events
const evtsPath = path.join(__dirname, 'events')
const evtFiles = fs
  .readdirSync(evtsPath)
  .filter((file: string) => file.endsWith('.js'))

console.log('Loading events...')
for (const file of evtFiles) {
  const filePath = path.join(evtsPath, file)
  const evt = require(filePath)
  console.log(`[ + ] ${evt.name}`)
  if (evt.once) client.once(evt.name, (...args: any) => evt.execute(...args))
  else client.on(evt.name, (...args: any) => evt.execute(...args))
}
console.log('')

// tasks
const tasksPath = path.join(__dirname, 'tasks')
const taskFiles = fs
  .readdirSync(tasksPath)
  .filter((file: string) => file.endsWith('.js'))

for (const file of taskFiles) {
  const filePath = path.join(tasksPath, file)
  const task = require(filePath)
  task.execute()
}

client.login(process.env.TOKEN)

export { client, db }
