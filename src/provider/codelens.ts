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
  private currText: string = ''
  private currChoices: string[] | undefined
  private currChoiceIndex: number = 0

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
      const prevCmd = this.currChoiceIndex ? 'sidekick.refactor.previous' : ''
      this.codeLenses.push(
        new CodeLens(this.currRefRange, {
          title: 'Previous',
          command: prevCmd
        })
      )
      const nextCmd = this.currChoiceIndex + 1 !== this.currChoices?.length ? 'sidekick.refactor.next' : ''
      this.codeLenses.push(
        new CodeLens(this.currRefRange, {
          title: 'Next',
          command: nextCmd
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

  async startRefactor(range: Range, currText: string) {
    this.currRefRange = range
    this.currText = currText
    await this.getRefactors()
    this.replace()
  }

  nextRefactor() {
    this.currChoiceIndex++
    this.replace()
  }

  prevRefactor() {
    this.currChoiceIndex--
    this.replace()
  }

  cancelRefactor() {
    this.currChoiceIndex = 0
    this.currChoices = []
    this.replace('cancel')
    this.currRefRange = undefined
    this._onDidChangeCodeLenses.fire()
  }

  replace(action?: string) {
    if (!this.currChoices) return
    const text = action ? this.currText : this.currChoices[this.currChoiceIndex]
    console.log(this.currChoices)
    const activeTe = window.activeTextEditor
    activeTe?.edit(editBuilder => {
      if (!this.currRefRange) return
      editBuilder.replace(this.currRefRange, text)
      const lines = text.split(/\r\n|\r|\n/)
      const lCount = lines.length
      const lChar = lines.pop()?.length
      activeTe.selection = new Selection(this.currRefRange.start, new Position(lCount, lChar ?? 0))
      this._onDidChangeCodeLenses.fire()
    })
  }

  select(range: Range) {
    const activeTe = window.activeTextEditor
    if (activeTe) activeTe.selection = new Selection(range.start, range.end)
  }

  private async getRefactors() {
    if (!this.currText) return
    console.log(this.currText)
    const n = workspace.getConfiguration('sidekick').get('nRefactors', 1)
    this.currChoices = await Ai.refactor(this.currText, n)
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
