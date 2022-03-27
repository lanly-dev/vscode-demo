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
  private regex: RegExp
  private title: string
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    this.title = 'hello'
    // for js, ts
    this.regex = /function \w+\s*\(.*?\)\s*{.+?(?<=})/g
    workspace.onDidChangeConfiguration((_) => this._onDidChangeCodeLenses.fire())
  }

  provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    if (!workspace.getConfiguration("sidekick").get("enableComplexity")) return []
    this.codeLenses = []
    const regex = new RegExp(this.regex)
    const text = document.getText()
    console.debug(text)
    // console.log(regex.exec(text))
    let matches
    while ((matches = regex.exec(text)) !== null) {
      console.debug('#####################')
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      console.log(indexOf)
      const position = new Position(line.lineNumber, indexOf)
      const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
      if (range) this.codeLenses.push(new CodeLens(range))
    }
    return this.codeLenses
  }

  resolveCodeLens(codeLens: CodeLens, token: CancellationToken) {
    if (!workspace.getConfiguration("sidekick").get("enableComplexity") || !this.title) return null
    codeLens.command = {
      title: this.title,
      command: ''
    }
    return codeLens
  }
}
