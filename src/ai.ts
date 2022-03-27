/* eslint-disable @typescript-eslint/naming-convention */
import { commands, window, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
// Not safe, for expired certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default class AI {
  static openai: OpenAIApi | undefined

  static init() {
    console.log('testing')
    this.openai = undefined
    const apiKey = <string>workspace.getConfiguration().get('sidekick.openAiApiKey')
    if (!apiKey) {
      window
        .showInformationMessage('Please add OpenAI token to the settings', 'Setting')
        .then(() => commands.executeCommand('workbench.action.openSettings', 'sidekick.openAiApiKey'))
      return
    }

    if (!apiKey.includes('sk-') || apiKey.length !== 51) {
      window
        .showErrorMessage('Invalid OpenAI token format', 'Setting')
        .then(() => commands.executeCommand('workbench.action.openSettings', 'sidekick.openAiApiKey'))
      return
    }

    this.openai = new OpenAIApi(new Configuration({ apiKey }))
  }

  static async oneLine(input: string) {
    this.init()
    if (!this.openai) return

    const prompt = 'Use list comprehension to convert this into one line of JavaScript:\n\n' + input
    const response = await this.openai.createCompletion('code-davinci-002', {
      prompt,
      temperature: 0,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    return response
  }

  static async predict(prompt: string) {
    this.init()
    if (!this.openai) return

    const completion = await this.openai.createCompletion('text-davinci-001', { prompt })
    return completion.data.choices
  }

  static async refactor(input: string) {
    this.init()
    if (!this.openai) return

    const prompt = 'Refactor this code:\n\n' + input
    const response = await this.openai.createCompletion('code-davinci-002', {
      prompt,
      temperature: 0,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    return response
  }
}
