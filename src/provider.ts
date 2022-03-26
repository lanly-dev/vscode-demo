import { CancellationToken, InlineCompletionContext, InlineCompletionItem, Position, Range, TextDocument } from 'vscode'

import AI from './ai'
export default class Provider {
  async provideInlineCompletionItems(
    document: TextDocument,
    position: Position,
    context: InlineCompletionContext,
    token: CancellationToken
  ): Promise<InlineCompletionItem[]> {
    const posLine = position.line
    const text = document.lineAt(posLine).text
    if (!text) return []

    const choices = await AI.predict(text)
    if (!choices?.length) return []
    const results = choices.map(({ text }) => {
      return { text, range: new Range(posLine, position.character, posLine, text?.length ?? 0) }
    })
    return results
  }
}
