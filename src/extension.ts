// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { load } from 'js-yaml';
import SourceMap from "js-yaml-source-map";
import { listeners } from 'process';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('fuzzy-yaml-searcher.fuzzy-yaml-search', () => {
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

		function jumpToPosition(editor: vscode.TextEditor, lineNumber: number) {
			vscode.window.showInformationMessage(lineNumber.toString());
			let newPosition = new vscode.Position(lineNumber - 1, 0);
			console.log(newPosition);
                        editor.selection = new vscode.Selection(newPosition, newPosition);
                        editor.revealRange(new vscode.Range(newPosition, newPosition), vscode.TextEditorRevealType.InCenter);
		}

		let textEditor = vscode.window.activeTextEditor;

		if (textEditor) {
			const document = textEditor.document;
			const test_string: string = document.getText();
			const map = new SourceMap();
			const yaml_data = load(test_string, {listener: map.listen() });
			const parsed = propertiesToArray(yaml_data);

			const result = vscode.window.showQuickPick(parsed, {
				placeHolder: 'one, two or three',
				// QuickItemでフォーカスがあたった際に呼び出されるコールバック
			onDidSelectItem: item => 
				console.log(map.lookup(item).line.toString())
			})
			.then(item => jumpToPosition(textEditor, map.lookup(item).line));
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
