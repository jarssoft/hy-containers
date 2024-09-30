const express = require('express')
const suuretkaupungit = require('./kaupungit.js')
const maaseutu = require('./maaseutu.js')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/api/cities', (request, response) => {
  response.json(maaseutu)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})