import {
  CodeAction,
  CodeActionKind,
  CodeActionProvider,
  CodeLensProvider,
  Range,
  TextDocument,
  WorkspaceEdit
} from 'vscode'

export default class Provider implements CodeActionProvider {
  static readonly providedCodeActionKinds = [CodeActionKind.QuickFix]
  codeLens: CodeLensProvider

  constructor(codeLens: CodeLensProvider) {
    this.codeLens = codeLens
  }

  provideCodeActions(document: TextDocument, range: Range): CodeAction[] | undefined {
    if (!this.isFunction(document, range)) return
    return [this.refactor(document, range), this.goToSetting()]
  }

  private isFunction(document: TextDocument, range: Range) {
    const start = range.start
    const line = document.lineAt(start.line)
    return line.text.includes('function')
  }

  private refactor(document: TextDocument, range: Range): CodeAction {
    const fix = new CodeAction(`Sidekick refactor function`, CodeActionKind.Refactor)
    fix.edit = new WorkspaceEdit()
    fix.edit.replace(document.uri, new Range(range.start, range.start.translate(0, 2)), 'something')
    return fix
  }

  private calComplexity(document: TextDocument, range: Range): CodeAction {
    const fix = new CodeAction(`Sidekick calculate complexity`, CodeActionKind.Empty)
    fix.edit = new WorkspaceEdit()
    fix.edit.replace(document.uri, new Range(range.start, range.start.translate(0, 2)), 'something')
    return fix
  }

  private goToSetting(): CodeAction {
    const action = new CodeAction('Sidekick setting', CodeActionKind.Empty)
    action.command = {
      command: 'workbench.action.openSettings',
      title: 'Sidekick setting',
      tooltip: 'Go to setting.',
      arguments: ['sidekick']
    }
    return action
  }
}
