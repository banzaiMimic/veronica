const prompt = require('prompt')
const shell = require('shelljs')
const fs = require('fs')
const colors = require('colors/safe')
prompt.message = colors.yellow('Replace')

const createEndpoint = require('./endpoint')

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default'
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`
  const replacementKeys = require(`${templatePath}/_variables`)
  const clonedPath = process.cwd()

  console.log('args:', args)

  if (!fs.existsSync(templatePath)) {
    throw new Error('templatePath does not exist.')
  }

  prompt.start().get(replacementKeys, (e, replacements) => {
    switch (args.template) {
      case 'endpoint':
        if (!replacements.method || !replacements.action || !replacements.entity) {
          throw new Error('all parameters must have value. if basic, post method should have add as action')
        }
        createEndpoint({ fs, shell, templatePath, replacements, clonedPath, logger }).run()
        break
      default:
        break
    }
  })
}