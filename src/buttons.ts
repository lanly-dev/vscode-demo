import { window, StatusBarItem, StatusBarAlignment } from 'vscode'

export default class Buttons {
  private enablePredictionBtn: StatusBarItem
  private nextBtn: StatusBarItem
  private prevBtn: StatusBarItem
  private oneLineBtn: StatusBarItem

  constructor() {
    this.enablePredictionBtn = window.createStatusBarItem(StatusBarAlignment.Right, 1)
    this.nextBtn = window.createStatusBarItem(StatusBarAlignment.Right, 2)
    this.prevBtn = window.createStatusBarItem(StatusBarAlignment.Right, 3)
    this.oneLineBtn = window.createStatusBarItem(StatusBarAlignment.Right, 4)

    this.enablePredictionBtn.text = 'Enable'
    this.nextBtn.text = '$(chevron-right)'
    this.prevBtn.text = '$(chevron-left)'
    this.oneLineBtn.text = 'One line'

    this.enablePredictionBtn.command = 'sidekick.enablePrediction'
  }
}
