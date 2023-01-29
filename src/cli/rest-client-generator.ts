/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-14 02:53
 */

import { readFileSync }                                                 from "fs";
import { writeFileSync }                                                from 'fs';
import { createPrinter, createSourceFile, Node, Program, ScriptTarget } from 'typescript';
import { createProgram, parseJsonConfigFileContent, readConfigFile } from 'typescript';
import { MetaDataKeys }                                              from "../constants";

interface ApiControllerDecorator {
	version: string;
	basePath: string;
}

interface EndpointDecorator {
	path: string;
	httpMethod: string;
	parameters: any;
}

import { IsString, IsNumber, IsOptional } from 'class-validator';

enum ParameterType {
	String = 'string',
	Number = 'number'
}

function CliParams(params: { name: string, type: ParameterType, optional: boolean }[]) {
	return function(target: any) {
		for (const param of params) {
			let decorator = '';
			if (param.type === ParameterType.String) {
				decorator = 'IsString()';
			} else if (param.type === ParameterType.Number) {
				decorator = 'IsNumber()';
			}
			if (param.optional) {
				decorator += '@IsOptional()';
			}
			Reflect.defineMetadata(param.name, decorator, target.prototype);
		}
	}
}

class Generator {
	private program: Program;
	private controllers: any[];
	private baseUrl: string;

	/*@CliParams({


			   })
*/
	constructor() {
		const filePath = "";
		const { config }  = readConfigFile('./tsconfig.json', (filePath) => {
			return readFileSync(filePath).toString();
		});
		/*
		const { options } = null; /* parseJsonConfigFileContent(config, (filePath) => {
			return readFileSync(filePath).toString();
		}, './');
		*/
		this.program      = null; //createProgram([ './src/index.ts' ], options);
		this.controllers  = [];
		this.baseUrl      = ""; //Reflect.getMetadata('baseUrl', App);
	}

	public generate() {
		const sourceFile = this.program.getSourceFiles().find((f) => f.fileName.endsWith('index.ts'));
		let clientCode   = `import axios from 'axios';\n\n`;
/*
		sourceFile.forEachChild((node: Node) => {
			if (node.decorators) {
				node.decorators.forEach((decorator) => {
					const decoratorName = decorator.expression.getText();
					if (decoratorName === MetaDataKeys.apiController) {
						const decoratorData = decorator.expression.arguments[ 0 ];
						const basePath = decoratorData.properties.find(
							(prop) => prop.name.getText() === MetaDataKeys.basePath
						).initializer.getText();

						this.controllers.push({ className: node.name.getText(), basePath });
					}
				});
			}
			if (node.members) {
				node.members.forEach((member) => {
					if (member.decorators) {
						member.decorators.forEach((decorator) => {
							const decoratorName = decorator.expression.getText();
							if (decoratorName === MetaDataKeys.Endpoint) {
								const path       = decorator.expression.arguments[ 0 ].properties.find((prop) => prop.name.getText() === 'path')
																					  .initializer.getText();
								const httpMethod = decorator.expression.arguments[ 0 ].properties.find((prop) => prop.name.getText() === 'httpMethod')
																					  .initializer.getText();
								const parameters = decorator.expression.arguments[ 0 ].properties.find((prop) => prop.name.getText() === 'parameters')
																					  .initializer.getText();
								this.controllers.forEach((controller) => {
									if (controller.className === node.name.getText()) {
										controller.endpoints = controller.endpoints || [];
										controller.endpoints.push(
											{
												path,
												httpMethod,
												parameters,
												methodName: member.name.getText()
											});
									}
								});
							}
						});
					}
				});
			}
		});
*/
		this.controllers.forEach((controller: any) => {
			const { className, basePath, endpoints } = controller;

			clientCode += `class ${ className }Client {\n`;

			endpoints.forEach((endpoint: any) => {
				const { path, httpMethod, parameters, methodName } = endpoint;
				clientCode += `  public async ${ methodName }(${ parameters.split(' ').join(', ') }) {\n`;
				clientCode += `    const response = await axios.${ httpMethod.toLowerCase() }(\`${ this.baseUrl }${ basePath }${ path }\`, { ${ parameters.split(' ')
																																						  .join(', ') } });\n`;
				clientCode += `    return response.data;\n`;
				clientCode += `  }\n`;
			});

			clientCode += `}\n\n`;
		});

		clientCode += `export default {\n`;
		this.controllers.forEach((controller: any) => {
			clientCode += `  ${ controller.className }Client,\n`;
		});
		clientCode += `}\n`;

// Create a new TypeScript SourceFile from the generated client code
		const clientAst = createSourceFile('client.ts', clientCode, ScriptTarget.Latest);

// Use the printer to convert the AST to the TypeScript code
		const printer = createPrinter();
		const output  = printer.printFile(clientAst);

// Write the generated code to a file
		writeFileSync('./client.ts', output);
		console.log('Client generated successfully');
	}
}

const generator = new Generator();
generator.generate();
