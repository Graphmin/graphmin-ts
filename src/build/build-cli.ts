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


	});

program.parse(process.argv);
