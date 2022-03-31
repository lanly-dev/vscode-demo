import { ExtensionContext, commands, languages, workspace } from 'vscode'
import Ai from './ai'
import Buttons from './buttons'
import Utility from './utility'
import CaProvider from './provider/codeAction'
import ClProvider from './provider/codeLens'
import IcProvider from './provider/inlineCompletion'

let buttons = new Buttons()

export function activate(context: ExtensionContext) {
  const { providedCodeActionKinds } = CaProvider
  const clp = new ClProvider()
  Ai.init()
  const rc = commands.registerCommand
  context.subscriptions.concat([
    rc('sidekick.helper', () => helper()),
    rc('sidekick.oneLine', () => oneLine()),
    rc('sidekick.refactor', () => refactor()),
  
    rc('sidekick.prediction.enable', () => enableFeature('enablePrediction')),
    rc('sidekick.refactor.cancel', () => clp.cancelRefactor()),
    rc('sidekick.refactor.next', () => clp.nextRefactor()),
    rc('sidekick.refactor.previous', () => clp.prevRefactor()),
    rc('sidekick.refactor.select', (range) => clp.select(range)),
    rc('sidekick.refactor.start', (range, text) => clp.startRefactor(range, text)),
    rc('sidekick.setting', () => Utility.openSetting('sidekick')),
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

function oneLine() {
  throw new Error('Function not implemented.')
}

function refactor() {
  throw new Error('Function not implemented.')
}

function helper() {
  throw new Error('Function not implemented.')
}

export function deactivate() {}
