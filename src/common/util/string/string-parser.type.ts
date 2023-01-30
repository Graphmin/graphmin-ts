/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-22 11:54
 */

export interface ParserOptions {
	string: string;
	quotes?: string[];
	whitespaces?: string[];
	commentStartSingle?: string;
	commentStartBlock?: string;
	commentEndBlock?: string;
}

export enum ParserState {
	Initial,
	InQuote,
	InNesting,
	InNumber,
	InEscapeSequence,
	InComment,
	Error
}
