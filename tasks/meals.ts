import * as cron from 'node-cron'

module.exports = {
  execute() {
    cron.schedule('30 20 * * 1,2,3,4,5', () => {
      console.log('Notificar para o jantar')
    })
  },
}
