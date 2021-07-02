const create = ({
  fs,
  shell,
  templatePath,
  replacementKeys,
  replacements,
  clonedPath,
  logger
}) => {
  const run = () => {
    console.log('templatePath:', templatePath)
    console.log('replacementKeys:', replacementKeys)
    console.log('replacements:', replacements)
    console.log('clonedPath', clonedPath)
    cloneTemplateFiles()
    replaceFilenames()
    replaceFileContent()
    cleanupFiles()
  }

  const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1)

  const getFilenameUpdate = ({ filename }) => {
    let returnStr = filename
    switch (filename) {
      case 'controllers/[method][action][entity].js':
        const actionStr = replacements.action ? capitalizeFirst(replacements.action) : ''
        returnStr = `controllers/${replacements.method}${actionStr}${capitalizeFirst(replacements.entity)}.js`
        break
      case 'useCases/[action][entity].js':
        returnStr = `useCases/${replacements.action}${capitalizeFirst(replacements.entity)}.js`
        break
      case 'entity/[entity].js':
        returnStr = `entity/${replacements.entity}.js`
        break
      default:
        Object.keys(replacements).forEach( key => {
          if (filename.includes(`[${key}]`)){
            returnStr = filename.replace(`[${key}]`, `${capitalizeFirst(replacements[key])}`)
          }
        })
        break
    }
    return returnStr
  }

  const cloneTemplateFiles = () => {
    logger.info('Copying files...')
    shell.cp('-R', `${templatePath}/*`, clonedPath)
    logger.info('--copy complete.')
  }

  const replaceFilenames = () => {
    logger.info('Updating filenames...')
    shell.ls('-Rl', '.').forEach(file => {
      if (file.isFile()) {
        const filenameUpdate = getFilenameUpdate({ filename: file.name })
        shell.mv(`${clonedPath}/${file.name}`, `${clonedPath}/${filenameUpdate}`)
      }
    })
    logger.info('--filename updates complete.')
  }

  const replaceFirstOccurrances = () => {
    shell.ls('-Rl', '.').forEach(file => {
      if (file.isFile()) {
        Object.keys(replacements).forEach(key => {
          shell.sed('-i', `\\[${key.toUpperCase()}\\]`, replacements[key], file.name)
        })
      }
    })
  }

  const replaceFileContent = () => {
    // run full replace 3 times since shelljs's sed only replaces first occurrance and global regex /g doesn't seem to work
    replaceFirstOccurrances()
    replaceFirstOccurrances()
    replaceFirstOccurrances()
    shell.ls('-Rl', '.').forEach(file => {
      if (file.isFile()) {
        const filename = file.name
        console.log('updating filename:', filename)
        Object.keys(replacements).forEach(key => {
          shell.sed('-i', `\\[${key.toUpperCase()}\\]`, replacements[key], filename)
        })

        //update camelCase where needed
        const { method, action, entity } = replacements
        const makeUpdate = `make${method}${action}${entity}`
        const makeUpdateStr = `make${capitalizeFirst(method)}${capitalizeFirst(action)}${capitalizeFirst(entity)}`

        const actionUpdate = `${action}${entity}`
        const actionUpdateStr = `${action}${capitalizeFirst(entity)}`

        const fullUpdate = `${method}${action}${entity}`
        const fullUpdateStr = `${method}${capitalizeFirst(action)}${capitalizeFirst(entity)}`
        
        console.log(`replacing ${actionUpdate} with ${actionUpdateStr}`)
        console.log(`replacing ${fullUpdate} with ${fullUpdateStr}`)
        console.log(`replacing ${makeUpdate} with ${makeUpdateStr}`)

        shell.sed('-i', `${actionUpdate}`, actionUpdateStr, filename)
        shell.sed('-i', `${actionUpdate}`, actionUpdateStr, filename)
        shell.sed('-i', `${fullUpdate}`, fullUpdateStr, filename)
        shell.sed('-i', `${fullUpdate}`, fullUpdateStr, filename)
        shell.sed('-i', `${makeUpdate}`, makeUpdateStr, filename)
        shell.sed('-i', `${makeUpdate}`, makeUpdateStr, filename)
        shell.sed('-i', `${actionUpdate}`, actionUpdateStr, filename)
        shell.sed('-i', `${actionUpdate}`, actionUpdateStr, filename)

        shell.sed('-i', `${entity}`, capitalizeFirst(entity), filename)

        //getaddCart
        shell.sed('-i', `${method}${action}${capitalizeFirst(entity)}`, fullUpdateStr, filename)
        shell.sed('-i', `./${method}${action}${capitalizeFirst(entity)}`, fullUpdateStr, filename)
        //makegetAddCart
        shell.sed('-i', `make${method}${capitalizeFirst(action)}${capitalizeFirst(entity)}`, makeUpdateStr, filename)
        //[ENTITYLOWER]
        console.log(`filename ${filename} replacing : require('./[ENTITYLOWER]')({}).make${entity}`)
        shell.sed('-i', `\\[ENTITYLOWER\\]`, entity, filename)
        shell.sed('-i', `make${entity}`, `make${capitalizeFirst(entity)}`, filename)

      }
    })
    // final round is to re-update camelCase, better option would be running sed with exact match above, not sure if shelljs has that
    // might make and exec a .sh script if needed later
    
  }

  const cleanupFiles = () => {
    if (fs.existsSync(`${clonedPath}/_variables.js`)) {
      shell.rm(`${clonedPath}/_variables.js`)
    }
  }

  return Object.freeze({
    getFilenameUpdate,
    run
  })
}

module.exports = create
