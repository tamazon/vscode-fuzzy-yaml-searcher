// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { load } from 'js-yaml';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fuzzy-yaml-sercher" is now active!');


	const result = vscode.window.showQuickPick(['one>two>tree', 'two>tree', 'three'], {
		placeHolder: 'one, two or three',
		// QuickItemでフォーカスがあたった際に呼び出されるコールバック
	onDidSelectItem: item =>
				vscode.window.showInformationMessage(`Let's go`)
	});

	let textEditor = vscode.window.activeTextEditor;
	if (textEditor) {
		const document = textEditor.document;
		const test_string: string = document.getText();
		console.log(test_string);
		const yaml_data = load(test_string);
		console.log(yaml_data);
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	let disposable = vscode.commands.registerCommand('fuzzy-yaml-sercher.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from fuzzy-yaml-sercher!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
