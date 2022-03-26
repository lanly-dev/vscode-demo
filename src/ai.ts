/* eslint-disable @typescript-eslint/naming-convention */
import { window, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
// Not safe, for expired certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
export default class AI {
  public static openai: OpenAIApi | undefined

  public static init() {
    this.openai = undefined
    const apiKey = <string>workspace.getConfiguration().get('sidekick.openAiApiKey')
    if (!apiKey) {
      window.showInformationMessage('Please add token to the settings')
      return
    }
    this.openai = new OpenAIApi(new Configuration({ apiKey }))
  }

  public static async oneLine(prompt: string) {
    this.init()
    if (!this.openai) return

    const completion = await this.openai.createCompletion('text-davinci-001', {
      prompt: 'Hello world'
    })
    console.log(completion.data.choices![0].text)
  }
}
