const prompt = require('prompt')
const shell = require('shelljs')
const fs = require('fs')
const colors = require("colors/safe")

prompt.message = colors.yellow("Replace")

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default'
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`
  const clonedPath = process.cwd()

  if (fs.existsSync(templatePath)) {
    logger.info('Copying files…')
    shell.cp('-R', `${templatePath}/*`, clonedPath)
    logger.info('✔ copy complete.')
  } else {
    logger.error(`The requested template for ${args.template} wasn't found.`)
    process.exit(1)
  }

  try {
    const variables = require(`${templatePath}/_variables`)

    if (fs.existsSync(`${clonedPath}/_variables.js`)) {
      shell.rm(`${clonedPath}/_variables.js`)
    }

    logger.info('Parameters :')
    logger.info('[method] : http method i.e. get, post, put, delete, patch')
    logger.info('[action] : *optional action : will be placed in filename i.e. <method><action><entity>')
    logger.info('[entity] : core object usually mapping to mongo i.e. cart')

    const getFilenameUpdate = ({filename, variable}) => {
      let returnStr = filename.replace(`[${variables[0]}]`, values[variable].toLowerCase())

      let action = values[variable].toLowerCase()
      if (action) {
        action = action[0].toUpperCase() + action.slice(1)
        returnStr = returnStr.replace(`[${variables[1]}]`, action)
      }
      let entity = values[variable].toLowerCase()
      entity = entity[0].toUpperCase() + entity.slice(1)
      returnStr = returnStr.replace(`[${variables[2]}]`, entity)
      returnStr = returnStr.replace(' ', '')
      return returnStr
    }

    const replaceFilename = ({file, values}) => {
      try {
        variables.forEach(variable => {
          if (file.name.includes(`[${variable}]`)){
            const filenameUpdate = getFilenameUpdate({filename: file.name, variable})
            shell.mv(`${clonedPath}/${file.name}`, `${clonedPath}/${filenameUpdate}`)
          }
        })
      } catch(e) {
        console.error(e.message)
      }
    }

    const replaceFileContent = ({file, values}) => {
      variables.forEach(variable => {
        if (!file.name.includes('[')) {
          shell.sed('-i', `\\[${variable.toUpperCase()}\\]`, values[variable], file.name)
        }
      })
    }

    prompt.start().get(variables, (e, values) => {

      shell.ls('-Rl', '.').forEach(file => {
        if (file.isFile()) {
          replaceFilename({file, values})
          replaceFileContent({file, values})
        }
      })
      logger.info('✔ Success!');
    })
  } catch(e) {
    console.error(e.message)
  }
}