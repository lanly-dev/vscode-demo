import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  EventEmitter,
  Position,
  Range,
  TextDocument,
  workspace
} from 'vscode'

export default class Provider implements CodeLensProvider {
  private codeLenses: CodeLens[] = []
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    workspace.onDidChangeConfiguration(_ => this._onDidChangeCodeLenses.fire())
  }

  provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    this.codeLenses = []
    const text = document.getText()
    let matches
    // while ((matches = regex.exec(text)) !== null) {
    //   const line = document.lineAt(document.positionAt(matches.index).line)
    //   const indexOf = line.text.indexOf(matches[0])
    //   const position = new Position(line.lineNumber, indexOf)
    //   const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
    //   if (range) this.codeLenses.push(new CodeLens(range))
    // }
    return this.codeLenses
  }
  resolveCodeLens(codeLens: CodeLens, token: CancellationToken) {
    codeLens.command = {
      title: 'Sidekick calculate complexity',
      command: ''
    }
    return codeLens
  }
}
