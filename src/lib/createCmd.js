const prompt = require('prompt')
const shell = require('shelljs')
const fs = require('fs')
const colors = require('colors/safe')

prompt.message = colors.yellow('Replace')

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default'
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`
  const replacementKeys = require(`${templatePath}/_variables`)
  const clonedPath = process.cwd()

  if (!fs.existsSync(templatePath)) {
    throw new Error('templatePath does not exist.')
  }

  prompt.start().get(replacementKeys, (e, replacements) => {
    create({ shell, templatePath, replacementKeys, replacements, clonedPath, logger }).run()
  })
}