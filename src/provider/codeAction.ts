import {
  CodeAction,
  CodeActionKind,
  CodeActionProvider,
  Range,
  TextDocument,
  WorkspaceEdit
} from 'vscode'
import AI from '../ai'

export default class Provider implements CodeActionProvider {
  static readonly providedCodeActionKinds = [CodeActionKind.Refactor]

  async provideCodeActions(document: TextDocument, range: Range): Promise<CodeAction[] | undefined> {
    const start = range.start
    const line = document.lineAt(start.line)
    if (!line.text.includes('//')) return
    return [await this.generateCode(document, range, line.text), this.goToSetting()]
  }

  private goToSetting(): CodeAction {
    const action = new CodeAction('Sidekick setting', CodeActionKind.Empty)
    action.command = {
      command: 'workbench.action.openSettings',
      title: 'Sidekick: setting',
      tooltip: `Go to Sidekick's setting`,
      arguments: ['sidekick']
    }
    return action
  }

  private async generateCode(document: TextDocument, range: Range, instruction: string): Promise<CodeAction> {
    const action = new CodeAction(`Sidekick generate code`, CodeActionKind.Refactor)
    action.edit = new WorkspaceEdit()
    const newText = await AI.generate(instruction)
    action.edit.insert(document.uri, range.start, newText ?? '')
    return action
  }
}
