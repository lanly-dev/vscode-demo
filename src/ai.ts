/* eslint-disable @typescript-eslint/naming-convention */
import { window, workspace } from 'vscode'
//@ts-ignore
import { OpenAI } from 'gpt-x'
import axios from 'axios'

export default class AI {
  public static key: string | undefined

  public static init() {
    this.key = workspace.getConfiguration().get('sidekick.openAiApiKey')
    !this.key && window.showInformationMessage('Please add token to the settings')
  }

  public static async oneLine(prompt: string) {
    this.init()
    if (!this.key) return
    console.log(this.key)
    const { Configuration, OpenAIApi } = require('openai')

    const configuration = new Configuration({
      apiKey: this.key
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createCompletion('text-davinci-001', {
      prompt: 'Hello world'
    })
    console.log(completion.data.choices[0].text)
  }
}
