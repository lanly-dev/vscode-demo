import { window, StatusBarItem, StatusBarAlignment, workspace } from 'vscode'

export default class Buttons {
  private enablePredictionBtn: StatusBarItem

  constructor() {
    this.enablePredictionBtn = window.createStatusBarItem(StatusBarAlignment.Right, 1)
    this.enablePredictionBtn.command = 'sidekick.prediction.enable'

    this.refresh()
    this.enablePredictionBtn.show()
  }

  refresh() {
    const cf = workspace.getConfiguration()
    const flag = cf.get('sidekick.enablePrediction')
    if (flag) this.enablePredictionBtn.text = 'Enable'
    else this.enablePredictionBtn.text = 'Disable'
  }
}
