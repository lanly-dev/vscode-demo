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
  private startRegex: RegExp = /\{/g
  private endRegex: RegExp = /\}/g
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    workspace.onDidChangeConfiguration((_) => this._onDidChangeCodeLenses.fire())
  }

  provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    if (!workspace.getConfiguration("sidekick").get("enableComplexity")) return []
    this.codeLenses = []

    const regex = new RegExp(this.startRegex)
    const fullText = document.getText()
    let matches
    while ((matches = regex.exec(fullText)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      const indexOfNon = line.firstNonWhitespaceCharacterIndex
      console.log('############', line.lineNumber)

      const startPosition = new Position(line.lineNumber, indexOf)
      const realStartPosition = new Position(line.lineNumber, indexOfNon)

      const theEnd = this.findEnd(document, fullText, startPosition)

      const range = new Range(realStartPosition, theEnd?.position!)
      // const range = document.getWordRangeAtPosition(startPosition, new RegExp(this.regex))
      if (range) this.codeLenses.push(new CodeLens(range, {
        title: 'hello ' + range.start.character + ' ' + range.end.character + ' ' + line.lineNumber,
        tooltip: theEnd?.text,
        command: ''
      }))
    }
    return this.codeLenses
  }

  findEnd(document: TextDocument, fullText: string, startPosition: Position) {
    const endRegex = new RegExp(this.endRegex)
    let matches
    while ((matches = endRegex.exec(fullText)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      const endPosition = new Position(line.lineNumber, indexOf + 1)
      console.log('$$$$$$', startPosition.line, line.lineNumber)
      if (startPosition.line > line.lineNumber) continue
      console.log('$$$$$$2')
      const filling = document.getText(new Range(startPosition, endPosition))
      const openCount = (filling.match(this.startRegex) || []).length
      const endCount = (filling.match(this.endRegex) || []).length
      if (openCount == endCount) return { position: endPosition, text: filling}
    }
  }
}

