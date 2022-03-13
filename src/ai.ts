import { window, workspace } from 'vscode'
//@ts-ignore
import { OpenAI } from 'gpt-x'

export default class AI {
  public static openAi: any

  public static init() {
    const { get, has } = workspace.getConfiguration()
    const keyStr = 'sidekick.openAiApiKey'
    const hasKey = has(keyStr)
    if (hasKey) this.openAi = new OpenAI(get(keyStr)!)
    else window.showInformationMessage('Please add token to the settings')
  }

  public static async oneLine(prompt: string) {
    !this.openAi && this.init(); return

    console.log('prompt')
    return prompt
  }
}
