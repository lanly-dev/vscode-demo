import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  EventEmitter,
  Position,
  TextDocument,
  workspace
} from 'vscode'

export default class CodelensProvider implements CodeLensProvider {
  private codeLenses: CodeLens[] = []
  private regex: RegExp
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    this.regex = /(.+)/g

    workspace.onDidChangeConfiguration(_ => this._onDidChangeCodeLenses.fire())
  }

  provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    if (!workspace.getConfiguration('codelens-sample').get('enableComplexity')) return []
    this.codeLenses = []
    const regex = new RegExp(this.regex)
    const text = document.getText()
    let matches
    while ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      const position = new Position(line.lineNumber, indexOf)
      const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
      if (range) this.codeLenses.push(new CodeLens(range))
    }
    return this.codeLenses
  }

  resolveCodeLens(codeLens: CodeLens, token: CancellationToken) {
    if (!workspace.getConfiguration('sidekick').get('enableComplexity')) return
    codeLens.command = {
      title: 'Calculate complexity',
      tooltip: 'Calculate complexity',
      command: 'sidekick.complexity',
      arguments: ['Argument 1', false]
    }
    return codeLens
  }
}
