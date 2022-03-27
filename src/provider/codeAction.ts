import { CodeAction, CodeActionKind, CodeActionProvider, commands, Range, TextDocument, WorkspaceEdit } from 'vscode'
export default class Emojizer implements CodeActionProvider {
  static readonly providedCodeActionKinds = [CodeActionKind.QuickFix]

  provideCodeActions(document: TextDocument, range: Range): CodeAction[] | undefined {
    if (!this.isAtStartOfSmiley(document, range)) return

    const replaceWithSmileyCatFix = this.createFix(document, range, '😺')

    const replaceWithSmileyFix = this.createFix(document, range, '😀')
    // Marking a single fix as `preferred` means that users can apply it with a
    // single keyboard shortcut using the `Auto Fix` command.
    replaceWithSmileyFix.isPreferred = true

    const replaceWithSmileyHankyFix = this.createFix(document, range, '💩')

    const commandAction = this.createCommand()

    return [replaceWithSmileyCatFix, replaceWithSmileyFix, replaceWithSmileyHankyFix, commandAction]
  }

  private isAtStartOfSmiley(document: TextDocument, range: Range) {
    const start = range.start
    const line = document.lineAt(start.line)
    return line.text[start.character] === ':' && line.text[start.character + 1] === ')'
  }

  private createFix(document: TextDocument, range: Range, emoji: string): CodeAction {
    const fix = new CodeAction(`Convert to ${emoji}`, CodeActionKind.QuickFix)
    fix.edit = new WorkspaceEdit()
    fix.edit.replace(document.uri, new Range(range.start, range.start.translate(0, 2)), emoji)
    return fix
  }

  private createCommand(): CodeAction {
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
