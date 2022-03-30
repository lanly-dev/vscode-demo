import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  EventEmitter,
  Position,
  Range,
  Selection,
  TextDocument,
  window,
  workspace
} from 'vscode'

import Ai from '../ai'

export default class Provider implements CodeLensProvider {
  private codeLenses: CodeLens[] = []
  private endRegex: RegExp = /\}/g
  private startRegex: RegExp = /\{/g

  private currRefRange: Range | undefined
  private currText: string | undefined

  private textSaves: string[] = []
  private currentIndex: number = -1

  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    workspace.onDidChangeConfiguration(_ => {
      this._onDidChangeCodeLenses.fire()
    })
  }

  async provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
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

      if (!content || !range) continue

      if (workspace.getConfiguration('sidekick').get('enableComplexity')) {
        // const bigO = await Ai.complexity(content)
        this.codeLenses.push(
          new CodeLens(range, {
            title: 'bigO'!,
            tooltip: endInfo?.text,
            command: 'sidekick.refactor.select',
            arguments: [range]
          })
        )
      }
      if (this.currRefRange && this.currRefRange.start.line === range.start.line) continue
      this.codeLenses.push(
        new CodeLens(range, {
          title: 'refactor'!,
          command: 'sidekick.refactor.start',
          arguments: [range, endInfo.text]
        })
      )
    }
    if (this.currRefRange) {
      const prevCmd = this.textSaves.length ? 'sidekick.refactor.previous' : ''
      this.codeLenses.push(
        new CodeLens(this.currRefRange, {
          title: 'Previous',
          command: prevCmd
        })
      )
      this.codeLenses.push(
        new CodeLens(this.currRefRange, {
          title: 'Next',
          command: 'sidekick.refactor.next'
        })
      )
      this.codeLenses.push(
        new CodeLens(this.currRefRange, {
          title: 'Cancel',
          command: 'sidekick.refactor.cancel'
        })
      )
    }
    return this.codeLenses
  }

  startRefactor(range: Range, currText: string) {
    this.currRefRange = range
    this.currText = currText
  }

  nextRefactor() {
    this.currentIndex++
  }

  prevRefactor() {
    this.currentIndex--
  }

  cancelRefactor() {
    this.currRefRange = undefined
    this._onDidChangeCodeLenses.fire()
  }

  replace() { }

  select(range: Range) {
    new Selection(range.start, range.end)
    const activeTe = window.activeTextEditor
    if (activeTe) activeTe.selection = new Selection(range.start, range.end)

  }

  private async getNewRefactor() {
    if(!this.currText) return
    const choices = Ai.refactor(this.currText)
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
      if (openCount === endCount) return { position: endPosition, text: filling }
    }
  }
}
