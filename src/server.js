const app = require('./app')
const knex = require('knex')
const { PORT } = require('./config')

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

app.set('db', db)
