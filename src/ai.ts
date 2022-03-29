/* eslint-disable @typescript-eslint/naming-convention */
import { Configuration, OpenAIApi } from 'openai'
import { window, workspace } from 'vscode'
import Utility from './utility'
// Not safe, for expired certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default class AI {
  static openai: OpenAIApi | undefined

  static init() {
    this.openai = undefined
    const apiKey = <string>workspace.getConfiguration().get('sidekick.openAiApiKey')
    if (!apiKey) {
      window
        .showInformationMessage('Please add OpenAI token to the settings', 'Setting')
        .then(() => Utility.openSetting('sidekick.openAiApiKey'))
      return
    }

    if (!apiKey.includes('sk-') || apiKey.length !== 51) {
      window
        .showErrorMessage('Invalid OpenAI token format', 'Setting')
        .then(() => Utility.openSetting('sidekick.openAiApiKey'))
      return
    }

    this.openai = new OpenAIApi(new Configuration({ apiKey }))
  }

  static async complexity(input: string) {
    this.init()
    if (!this.openai) return

    const prompt = 'The time complexity of this function is\n\n' + input
    const response = await this.openai.createCompletion('text-davinci-002', {
      prompt,
      temperature: 0,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    console.log(response)
    return response.data.choices?.[0].text?.replaceAll('\n', '')
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

  static async makeHelper() {}
}
