const path = require('path')
const express = require('express')
const xss = require('xss')
const notesService = require('./folders-service')
const { json } = require('express')
const notessRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.text),
    content: xss(note.content),
    modified: folder.date_created,
  })

