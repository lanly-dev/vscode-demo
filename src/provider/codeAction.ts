import { CodeAction, CodeActionKind, CodeActionProvider, Range, TextDocument, WorkspaceEdit } from 'vscode'
const COMMAND = 'code-actions-sample.command'
export default class Emojizer implements CodeActionProvider {
  public static readonly providedCodeActionKinds = [CodeActionKind.QuickFix]

  public provideCodeActions(document: TextDocument, range: Range): CodeAction[] | undefined {
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
    const action = new CodeAction('Learn more...', CodeActionKind.Empty)
    action.command = {
      command: COMMAND,
      title: 'Learn more about emojis',
      tooltip: 'This will open the unicode emoji page.'
    }
    return action
  }
}
