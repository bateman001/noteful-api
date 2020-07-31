const path = require('path')
const express = require('express')
const xss = require('xss')
const foldersService = require('./folders-service')
const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name),
    date_created: folder.date_created,
  })
  
foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')

        foldersService.getAllFolders(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { name, date_created } = req.body
        newFolder = {name, date_created}

        for (const [key, value] of Object.entries(newFolder)){
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        }

        newFolder.date_created = date_created;

        foldersService.insertFolder(knexInstance, newFolder)
            .then(folder => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                .json(serializeFolder(folder))
            })
            .catch(next)

    })

foldersRouter 
    .route('/:folder_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')

        foldersService.getById(knexInstance, req.params.folder_id)
            .then(folder => {
                    if (!folder) {
                      return res.status(404).json({
                        error: { message: `Folder doesn't exist` }
                      })
                    }
                    res.folder = folder
                    next()
            })
            .catch(next)    
    })
    .get((req, res, next) => {
        res.json(serializeFolder(res.folder))
    })
    .delete((req, res, next) => {
        foldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
          )
            .then(numRowsAffected => {
              res.status(204).end()
            })
            .catch(next)
      
    })
    .patch(jsonParser, (req, res, next) => {
        const {name, date_created} = req.body
        const FolderToUpdate = {name, date_created}

        const numberOfValues = Object.values(FolderToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must contain either 'name' or 'date_created'`
            }
          })
    
        foldersService.updateFolder(req.app.get('db'), req.params.folder_id, FolderToUpdate)
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    });

    module.exports = foldersRouter
    
