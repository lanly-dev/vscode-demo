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

import Ai from '../ai'

export default class Provider implements CodeLensProvider {
  private codeLenses: CodeLens[] = []
  private startRegex: RegExp = /\{/g
  private endRegex: RegExp = /\}/g
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    workspace.onDidChangeConfiguration((_) => this._onDidChangeCodeLenses.fire())
    // clear
  }

  async provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
    if (!workspace.getConfiguration('sidekick').get('enableComplexity')) return []
    this.codeLenses = []

    const regex = new RegExp(this.startRegex)
    const fullText = document.getText()
    let matches
    while ((matches = regex.exec(fullText)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      const indexOfNon = line.firstNonWhitespaceCharacterIndex

      const startPosition = new Position(line.lineNumber, indexOf)
      const realStartPosition = new Position(line.lineNumber, indexOfNon)

      // TODO: format tooltip
      const endInfo = this.findEnd(document, fullText, realStartPosition)

      const range = new Range(realStartPosition, endInfo?.position!)
      const content = endInfo?.text
      if (!content) continue
      // const bigO = await Ai.complexity(content)
      
      if (range) this.codeLenses.push(new CodeLens(range, {
        title: 'bigO'!,
        tooltip: endInfo?.text,
        command: ''
      }))
    }
    return this.codeLenses
  }

  private nextRef() {
    // save

  }

  private prevRef() {

  }

  private cancleRef() {

  }

  private replace() {

  }

  private select() {
    
  }

  private findEnd(document: TextDocument, fullText: string, startPosition: Position) {
    const endRegex = new RegExp(this.endRegex)
    let matches
    while ((matches = endRegex.exec(fullText)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line)
      const indexOf = line.text.indexOf(matches[0])
      const endPosition = new Position(line.lineNumber, indexOf + 1)
      if (startPosition.line > line.lineNumber) continue
      const filling = document.getText(new Range(startPosition, endPosition))
      const openCount = (filling.match(this.startRegex) || []).length
      const endCount = (filling.match(this.endRegex) || []).length 
      if (openCount == endCount) return { position: endPosition, text: filling }
    }
  }
}

