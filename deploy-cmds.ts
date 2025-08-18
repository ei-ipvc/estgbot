// raw.githubusercontent.com/discordjs/guide/main/code-samples/creating-your-bot/cmd-deployment/deploy-cmds.js
import { REST, Routes } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'
require('dotenv').config()

const cmds = []
// Grab all the cmd folders from the cmds directory you created earlier
const foldersPath = path.join(__dirname, 'dist/commands')

// Grab all the cmd files from the cmds directory you created earlier
const cmdsPath = path.join(foldersPath)
const cmdFiles = fs
  .readdirSync(cmdsPath)
  .filter((file: string) => file.endsWith('.js'))
// Grab the SlashCommandBuilder#toJSON() output of each cmd's data for deployment
for (const file of cmdFiles) {
  const filePath = path.join(cmdsPath, file)
  const cmd = require(filePath)
  if ('data' in cmd && 'execute' in cmd) {
    cmds.push(cmd.data.toJSON())
  } else {
    console.log(
      `[WARNING] The cmd at ${filePath} is missing a required "data" or "execute" property.`,
    )
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN!)

// and deploy your cmds!
;(async () => {
  try {
    console.log(`Started refreshing ${cmds.length} application (/) cmds.`)

    // The put method is used to fully refresh all cmds with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENTID!,
        process.env.SERVERID!,
      ),
      {
        body: cmds,
      },
    )) as any

    console.log(`Successfully reloaded ${data.length} application (/) cmds.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
