import {
  CancellationToken,
  InlineCompletionContext,
  InlineCompletionItem,
  InlayHintsProvider,
  Position,
  Range,
  TextDocument
} from 'vscode'

export default class Provider {

  async provideInlineCompletionItems(
    document: TextDocument,
    position: Position,
    context: InlineCompletionContext,
    token: CancellationToken
  ): Promise<InlineCompletionItem[]> {
    console.log('provideInlineCompletionItems triggered');
    const lineBefore = document.lineAt(position.line - 1).text;
    console.log(lineBefore)
    return [{ insertText: 'helloworld', range: new Range(position.line, 0, position.line, 10) }]
  }

}
