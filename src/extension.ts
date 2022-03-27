import { ExtensionContext, commands, languages, workspace } from 'vscode'
import Buttons from './buttons'
import CaProvider from './provider/codeAction'
import ClProvider from './provider/codeLens'
import IcProvider from './provider/inlineCompletion'
import OpenAi from './ai'
let buttons: Buttons | null = null

export function activate(context: ExtensionContext) {
  buttons = new Buttons
  const codeLens = new ClProvider
  const { providedCodeActionKinds } = CaProvider
  OpenAi.init()
  const rc = commands.registerCommand
  context.subscriptions.concat([
    rc('sidekick.oneLine', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.enablePrediction', () => enablePrediction()),
    rc('sidekick.refactor', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refNext', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refPrev', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refCancel', () => OpenAi.oneLine('helloworld')),
    languages.registerCodeActionsProvider('*', new CaProvider(codeLens), { providedCodeActionKinds }),
    languages.registerCodeLensProvider('*', codeLens),
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, new IcProvider())
  ])

}

async function enablePrediction() {
  const cf = workspace.getConfiguration()
  const flag = cf.get('sidekick.enablePrediction')
  await cf.update('sidekick.enablePrediction', !flag)
  if (buttons) buttons.refresh()
}

export function deactivate() {}
