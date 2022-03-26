import { ExtensionContext, commands, languages, window, } from 'vscode'
import OpenAi from './ai'
import Provider from './Provider'

export function activate(context: ExtensionContext) {
  OpenAi.init()
  let disposable = commands.registerCommand('sidekick.oneLine', () => OpenAi.oneLine('helloworld'))
  const provider = new Provider()
  let d = languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider )
  context.subscriptions.concat([disposable, d])
}

export function deactivate() { }
