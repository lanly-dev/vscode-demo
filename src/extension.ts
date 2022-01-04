import { ExtensionContext, commands, window } from 'vscode'
import OpenAi from './openAi'

export function activate(context: ExtensionContext) {

  let disposable = commands.registerCommand('demo.oneLine', () => {
    OpenAi.oneLine()
  })

  context.subscriptions.push(disposable)
}

// export function deactivate() {}
