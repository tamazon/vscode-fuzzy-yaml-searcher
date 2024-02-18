// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { load } from 'js-yaml';
import SourceMap from "js-yaml-source-map";
import { listeners } from 'process';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('fuzzy-yaml-sercher.helloWorld', () => {
		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "fuzzy-yaml-sercher" is now active!');

		function propertiesToArray(obj: Object) {
			const isObject = val =>
				val && typeof val === 'object' && !Array.isArray(val);
		
			const addDelimiter = (a, b) =>
				a ? `${a}.${b}` : b;
		
			const paths = (obj = {}, head = '') => {
				return Object.entries(obj)
					.reduce((product, [key, value]) => 
						{
							let fullPath = addDelimiter(head, key);
							return isObject(value) ?
								product.concat(paths(value, fullPath))
							: product.concat(fullPath);
						}, []);
			};
		
			return paths(obj);
		}

		let textEditor = vscode.window.activeTextEditor;

		if (textEditor) {
			const document = textEditor.document;
			const test_string: string = document.getText();
			console.log(test_string);
			const map = new SourceMap();
			console.log(map)
			const yaml_data = load(test_string, {listener: map.listen() });
			console.log(yaml_data);
			const parsed = propertiesToArray(yaml_data);
			console.log(parsed);

			const result = vscode.window.showQuickPick(parsed, {
				placeHolder: 'one, two or three',
				// QuickItemでフォーカスがあたった際に呼び出されるコールバック
			onDidSelectItem: item =>
				// vscode.window.showInformationMessage(map.lookup(item.toString))
				console.log(map.lookup(item));
				// vscode.window.showInformationMessage(map.lookup(item));
			});
		}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from fuzzy-yaml-sercher!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
