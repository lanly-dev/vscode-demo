import { ExtensionContext, commands, languages, workspace } from 'vscode'
import Buttons from './buttons'
// import CaProvider from './provider/codeAction'
import ClProvider from './provider/codeLens'
import IcProvider from './provider/inlineCompletion'
import Ai from './ai'
let buttons: Buttons | null = null

export function activate(context: ExtensionContext) {
  buttons = new Buttons
  // const { providedCodeActionKinds } = CaProvider
  const clp = new ClProvider
  Ai.init()
  const rc = commands.registerCommand
  context.subscriptions.concat([
    rc('sidekick.oneLine', () => Ai.oneLine('helloworld')),
    rc('sidekick.enablePrediction', () => enablePrediction()),
    rc('sidekick.refactor', () => Ai.oneLine('helloworld')),
    rc('sidekick.addRef', (range) => clp.addRef(range)),
    rc('sidekick.refNext', () => Ai.oneLine('helloworld')),
    rc('sidekick.refPrev', () => Ai.oneLine('helloworld')),
    rc('sidekick.refCancel', () => Ai.oneLine('helloworld')),
    // languages.registerCodeActionsProvider('*', new CaProvider, { providedCodeActionKinds }),
    languages.registerCodeLensProvider('*', clp),
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, new IcProvider())
  ])

}

async function enablePrediction() {
  const cf = workspace.getConfiguration('sidekick')
  const flag = cf.get('enablePrediction')
  await cf.update('enablePrediction', !flag)
  if (buttons) buttons.refresh()
}

export function deactivate() { }
