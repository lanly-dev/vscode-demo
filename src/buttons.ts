import { window, StatusBarItem, StatusBarAlignment } from 'vscode'

export class Buttons {
  private enablePredictBtn: StatusBarItem
  private nextBtn: StatusBarItem
  private prevBtn: StatusBarItem
  private oneLine: StatusBarItem

  constructor() {
    this.enablePredictBtn = window.createStatusBarItem(StatusBarAlignment.Right, 1)
    this.nextBtn = window.createStatusBarItem(StatusBarAlignment.Right, 2)
    this.prevBtn = window.createStatusBarItem(StatusBarAlignment.Right, 3)
    this.oneLine = window.createStatusBarItem(StatusBarAlignment.Right, 4)

    this.enablePredictBtn.text = 'Enable'
    this.nextBtn.text = '$(chevron-right)'
    this.prevBtn.text = '$(chevron-left)'
    this.oneLine.text = 'One line'
  }
}
