import {
  CancellationToken,
  InlineCompletionContext,
  InlineCompletionItem,
  Position,
  Range,
  TextDocument,
  workspace
} from 'vscode'
import AI from '../ai'

export default class Provider {
  async provideInlineCompletionItems(
    document: TextDocument,
    position: Position,
    context: InlineCompletionContext,
    token: CancellationToken
  ): Promise<InlineCompletionItem[]> {

    const posLine = position.line
    const text = document.lineAt(posLine).text

    const cf = workspace.getConfiguration()
    const flag = cf.get('sidekick.enablePrediction')

    if (!text || !flag) return []

    const choices = await AI.predict(text)
    if (!choices?.length) return []

    const results = choices.map(({ text }) => {
      return { text, range: new Range(posLine, position.character, posLine, text?.length ?? 0) }
    })
    // console.log('inline triggered', results)
    return results
  }
}
