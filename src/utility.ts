import { commands } from 'vscode'

export default class Utility {
  static openSetting(setting: string) {
    commands.executeCommand('workbench.action.openSettings', setting)
  }
}
