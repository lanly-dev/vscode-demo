import { commands, Range, window } from 'vscode'

export default class Utility {
  static openSetting(setting: string) {
    commands.executeCommand('workbench.action.openSettings', setting)
  }

  static getTextSelection() {
    const activeTe = window.activeTextEditor
    const start = activeTe?.selection.start
    const end = activeTe?.selection.end
    if (!start || !end) return
    return activeTe?.document.getText(new Range(start, end))
  }

  static insertTextRightAfter(text: String) {
  }
}
