import { window } from 'vscode'
import axios from 'axios'

export default class OpenAi {
  public static token = null

  public static async oneLine() {
    if (!this.hasToken()) return
    let data
    try {
      data = await axios.get('https://api.github.com/users/github')
    } catch (error) {
      //@ts-ignore
      window.showErrorMessage(error)
    }
    return data
  }

  private static hasToken() {
    if (!this.token) {
      window.showInformationMessage('need token')
      return false
    }
    return true
  }
}
