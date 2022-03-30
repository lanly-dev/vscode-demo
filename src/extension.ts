import { ExtensionContext, commands, languages, workspace } from 'vscode'
import Ai from './ai'
import Buttons from './buttons'
import Utility from './utility'
import CaProvider from './provider/codeAction'
import ClProvider from './provider/codeLens'
import IcProvider from './provider/inlineCompletion'

let buttons: Buttons | null = null

export function activate(context: ExtensionContext) {
  buttons = new Buttons()
  const { providedCodeActionKinds } = CaProvider
  const clp = new ClProvider()
  Ai.init()
  const rc = commands.registerCommand
  context.subscriptions.concat([
    rc('sidekick.prediction.enable', () => enableFeature('enablePrediction')),
    rc('sidekick.setting', () => Utility.openSetting('sidekick')),
    rc('sidekick.oneLine', () => Ai.oneLine('helloworld')),
    rc('sidekick.refactor.cancel', () => clp.cancelRefactor()),
    rc('sidekick.refactor.next', () => Ai.oneLine('helloworld')),
    rc('sidekick.refactor.previous', () => Ai.oneLine('helloworld')),
    rc('sidekick.refactor.start', (range, text) => clp.startRefactor(range, text)),
    rc('sidekick.refactor.select', (range) => clp.select(range)),
    rc('sidekick.refactor', () => Ai.oneLine('helloworld')),
    languages.registerCodeActionsProvider('*', new CaProvider, { providedCodeActionKinds }),
    languages.registerCodeLensProvider('*', clp),
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, new IcProvider())
  ])
}

async function enableFeature(setting: string) {
  const cf = workspace.getConfiguration('sidekick')
  const flag = cf.get(setting)
  await cf.update(setting, !flag)
  if (buttons) buttons.refresh()
}

export function deactivate() {}
