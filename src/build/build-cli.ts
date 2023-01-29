/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-24
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */


import { Command } from 'commander';
import { prompt, list, checkbox, password, confirm } from 'inquirer';

const program = new Command();

program
	.command('wizard')
	.alias('w')
	.description('Run the CLI wizard')
	.action(async () => {
		// first list
		const firstList = await prompt(
			[
				{
					type   : 'list',
					name   : 'firstChoice',
					message: 'Please select an option:',
					choices: [ 'Option 1', 'Option 2', 'Option 3' ],
				},
			]
		);

		// based on first list selection, show second list
		let secondList = [];
		if (firstList.firstChoice === 'Option 1') {
			secondList = await prompt([
										  {
											  type   : 'list',
											  name   : 'secondChoice',
											  message: 'Please select a sub-option:',
											  choices: [ 'Sub-option 1', 'Sub-option 2' ],
										  },
									  ]);
		}
		else if (firstList.firstChoice === 'Option 2') {
			secondList = await prompt([
										  {
											  type   : 'list',
											  name   : 'secondChoice',
											  message: 'Please select a sub-option:',
											  choices: [ 'Sub-option 3', 'Sub-option 4' ],
										  },
									  ]);
		}
		else {
			secondList = await prompt([
										  {
											  type   : 'list',
											  name   : 'secondChoice',
											  message: 'Please select a sub-option:',
											  choices: [ 'Sub-option 5', 'Sub-option 6' ],
										  },
									  ]);
		}

		// yes/no question
		const confirmChoice = await prompt([
											   {
												   type   : 'confirm',
												   name   : 'confirm',
												   message: 'Are you sure you want to continue?',
												   default: true,
											   },
										   ]);

		if (!confirmChoice.confirm) {
			console.log('Exiting wizard...');
			return;
		}

		// checkbox list
		const checkboxChoice = await prompt([
												{
													type   : 'checkbox',
													name   : 'checkbox',
													message: 'Please select additional options:',
													choices: [ 'Option A', 'Option B', 'Option C' ],
												},
											]);

		// text input
		const textInput = await prompt([
										   {
											   type   : 'input',
											   name   : 'text',
											   message: 'Please enter some text:',
										   },
									   ]);

		// show selections
		console.log('Your selections:');
		console.log(`First choice: ${ firstList.firstChoice }`);
		console.log(`Second choice: ${ secondList.secondChoice }`);
		console.log(`Additional options: ${ checkboxChoice.checkbox.join(', ') }`);
		console.log(`Text input: ${ textInput.text }`);
	});

program.parse(process.argv);
