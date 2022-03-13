import { ExtensionContext, commands, } from 'vscode'
import OpenAi from './ai'

export function activate(context: ExtensionContext) {
  OpenAi.init()
  let disposable = commands.registerCommand('sidekick.oneLine', () => OpenAi.oneLine('helloworld'))
  context.subscriptions.push(disposable)
}

export function deactivate() { }
