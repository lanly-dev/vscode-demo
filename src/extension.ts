import { ExtensionContext, commands, languages, workspace } from 'vscode'
import OpenAi from './ai'
import icProvider from './Provider/inlineCompletion'
import Buttons from './buttons'

export function activate(context: ExtensionContext) {
  const buttons = new Buttons()
  const icp = new icProvider()
  const rc = commands.registerCommand
  OpenAi.init()
  context.subscriptions.concat([
    rc('sidekick.oneLine', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.enablePrediction', () => enablePrediction()),
    rc('sidekick.refactor', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refNext', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refPrev', () => OpenAi.oneLine('helloworld')),
    rc('sidekick.refCancel', () => OpenAi.oneLine('helloworld')),
    languages.registerInlineCompletionItemProvider({ pattern: '**' }, icp)
  ])
}

function enablePrediction() {
  const cf = workspace.getConfiguration()
  const flag = cf.get('sidekick.enablePrediction')
  cf.update('sidekick.enablePrediction', !flag)
}

export function deactivate() {}
