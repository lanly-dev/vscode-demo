import {
  CancellationToken,
  InlineCompletionContext,
  InlineCompletionItem,
  InlineCompletionItemProvider,
  Position,
  Range,
  TextDocument
} from 'vscode'

class Provider implements InlineCompletionItemProvider {

  async provideInlineCompletionItems(
    document: TextDocument,
    position: Position,
    context: InlineCompletionContext,
    token: CancellationToken
  ): Promise<InlineCompletionItem[]> {

    let someTrackingIdCounter = 0;

    console.log('provideInlineCompletionItems triggered');


    const lineBefore = document.lineAt(position.line - 1).text;
    console.log(lineBefore)
    const text = 'helloworld'
    return [{
      text,
      range: new Range(position.line, 0, position.line, 10),
    }]
  }
}
