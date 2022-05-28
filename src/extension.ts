// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdown-preview-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('markdown-preview-helper.toggle-preview-and-source', async () => {
		
		const activeTabInput = vscode.window.tabGroups.activeTabGroup.activeTab?.input || {};

		if (activeTabInput instanceof vscode.TabInputWebview) {		// preview is active
			console.error("Preview is active");

			const activeLine = -1; // TODO: get active line

			const editorThenable: Thenable<vscode.TextEditor> = vscode.commands.executeCommand('markdown.showSource')
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
			
			
			const revealLineInEditor = (editor: vscode.TextEditor, line: number) => {
				const position = new vscode.Position(line, 0);
				const newSelection = new vscode.Selection(position, position);
				editor.selection = newSelection;
				editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
			};
			
			if (activeLine >= 0) {
				const editor = await editorThenable;
				if (editor) revealLineInEditor(editor, activeLine);
			}
			

		} else if (activeTabInput instanceof vscode.TabInputText) { // source is active
			console.error("Source is active");

			await vscode.commands.executeCommand('workbench.action.files.save')
			await vscode.commands.executeCommand('markdown.showPreview');
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		} else {
			console.error("Not active tab");
		}

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
