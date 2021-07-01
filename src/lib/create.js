const prompt = require('prompt')
const shell = require('shelljs')
const fs = require('fs')
const colors = require("colors/safe")

prompt.message = colors.yellow("Replace")

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default'
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`
  const localPath = process.cwd()

  if (fs.existsSync(templatePath)) {
    logger.info('Copying files…')
    shell.cp('-R', `${templatePath}/*`, localPath)
    logger.info('✔ copy complete.')
  } else {
    logger.error(`The requested template for ${args.template} wasn't found.`)
    process.exit(1)
  }

  try {
    const variables = require(`${templatePath}/_variables`)
    console.log('variables : ', variables)

    if (fs.existsSync(`${localPath}/_variables.js`)) {
      shell.rm(`${localPath}/_variables.js`)
    }

    logger.info('Please fill the following values…')

    // Ask for variable values
    prompt.start().get(variables, (e, result) => {

      // Replace variable values in all files
      shell.ls('-Rl', '.').forEach(entry => {
        if (entry.isFile()) {
          // Replace '[VARIABLE]` with the corresponding variable value from the prompt
          variables.forEach(variable => {
            shell.sed('-i', `\\[${variable.toUpperCase()}\\]`, result[variable], entry.name)
          })

          // Insert current year in files
          shell.sed('-i', '\\[YEAR\\]', new Date().getFullYear(), entry.name)
        }
      })

      logger.info('✔ Success!');
    })
  } catch(e) {
    console.error(e.message)
  }
}