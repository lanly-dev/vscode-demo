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
    const apiKey = <string>workspace.getConfiguration('sidekick').get('openAiApiKey')
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
      frequency_penalty: 0,
      max_tokens: 64,
      presence_penalty: 0,
      prompt,
      temperature: 0,
      top_p: 1
    })
    console.log(response)
    return response.data.choices?.[0].text?.replaceAll('\n', '')
  }

  static async generate(prompt: string) {
    this.init()
    if (!this.openai) return

    const response = await this.openai.createCompletion("code-davinci-002", {
      prompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    if (!response.data.choices) return
    return response.data.choices[0].text
  }

  static async makeHelper(prompt: string) {
    return ''
  }

  static async oneLine(input: string) {
    this.init()
    if (!this.openai) return

    const prompt = 'Use list comprehension to convert this into one line of JavaScript:\n\n' + input
    const response = await this.openai.createCompletion('code-davinci-002', {
      frequency_penalty: 0,
      max_tokens: 60,
      presence_penalty: 0,
      prompt,
      temperature: 0,
      top_p: 1
    })
    return response
  }

  static async predict(prompt: string) {
    this.init()
    if (!this.openai) return

    const n = workspace.getConfiguration('sidekick').get('nPredictions', 1)
    const completion = await this.openai.createCompletion('text-davinci-001', { prompt, n })
    return completion.data.choices ?? []
  }

  static async refactor(input: string, n: number) {
    this.init()
    if (!this.openai) return

    const prompt = '// Rewrite this function as efficient function\n\n' + input + '\n\n// efficient function:'
    const response = await this.openai.createCompletion('code-davinci-002', {
      frequency_penalty: 0,
      max_tokens: 512,
      n,
      presence_penalty: 0,
      prompt,
      temperature: 0,
      top_p: 1,
    })
    if (!response.data.choices) return []
    return response.data.choices?.map(elm => elm.text! )
  }
}
