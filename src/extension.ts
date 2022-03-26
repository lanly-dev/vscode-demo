import { ExtensionContext, commands, languages } from 'vscode'
import OpenAi from './ai'
import Provider from './Provider'
import Buttons from './buttons'

export function activate(context: ExtensionContext) {
  const buttons = new Buttons()
  const provider = new Provider()
  const rc = commands.registerCommand
  OpenAi.init()
  OpenAi.predict('hellworld')
  context.subscriptions.concat([
    rc('sidekick.oneLine', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.prediction', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refactor', () => OpenAi.oneLine('helloworld')),
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider)
  ])

}

export function deactivate() { }
