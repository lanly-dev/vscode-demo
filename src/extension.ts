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
    rc('sidekick.generate', () => action('G')),
    rc('sidekick.helper', () => action('H')),
    rc('sidekick.oneLine', () => action('O')),
    rc('sidekick.refactor', () => action('R')),

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

async function action(flag: string) {
  const selectedText = Utility.getTextSelection()
  if (!selectedText) return
  let newText
  if (flag === 'G') newText = await Ai.generate(selectedText)
  else if (flag === 'H') newText = await Ai.makeHelper(selectedText)
  else if (flag === 'O') newText = await Ai.oneLine(selectedText)
  else {
    const textArray = await Ai.refactor(selectedText, 1)
    newText = textArray ? textArray[0] : undefined
  }
  if (!newText) return
  Utility.insertTextRightAfter(newText)
}

export function deactivate() { }
