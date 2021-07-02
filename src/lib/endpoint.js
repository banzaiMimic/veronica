const create = ({
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
  }

  const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1)

  const getFilenameUpdate = ({ filename }) => {
    let returnStr
    switch (filename) {
      case 'controllers/[method][action][entity].js':
        const actionStr = replacements.action ? capitalizeFirst(replacements.action) : ''
        returnStr = `controllers/${replacements.method}${actionStr}${capitalizeFirst(replacements.entity)}.js`
        break
      case 'useCases/[action][entity].js':
        returnStr = `useCases/${replacements.action}${capitalizeFirst(replacements.entity)}.js`
        break
      default:
        Object.keys(replacements).forEach( key => {
          if (filename.includes(`[${key}]`)){
            returnStr = filename.replace(`[${key}]`, `${capitalizeFirst(replacements[key])}`)
          }
        })
        break
    }
    console.log(`filename update for ${filename} : ${returnStr}`)
    return returnStr
  }

  const cloneTemplateFiles = () => {
    logger.info('Copying files...')
    const test = shell.cp('-R', `${templatePath}/*`, clonedPath)
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

  return Object.freeze({
    getFilenameUpdate,
    run
  })
}

module.exports = create
