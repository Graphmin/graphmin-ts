/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-21 19:58
 */
import { StringBuffer }  from "./string-buffer";
import { ParserOptions } from "./string-parser.type";
import { ParserState }   from "./string-parser.type";

export class StringParser {
	private state: ParserState;
	private buffer: StringBuffer;
	private quotes: string[];
	private whitespaces: string[];
	private commentStartSingle: string;
	private commentStartBlock: string;
	private commentEndBlock: string;
	private nestedLevel: number;
	private lookaheadBuffer: string[];
	private quoteStarted: string;
	private quoteStartIndex: number;
	eventEmitter: any;

	/**
	 * Creates an instance of StringParser.
	 * @param {ParserOptions} options - The options for the parser.
	 * @memberof StringParser
	 */
	constructor(options: ParserOptions) {
		this.buffer = new StringBuffer(options.string);
		this.quotes = options.quotes || ["'", '"'];
		this.whitespaces = options.whitespaces || [" ", "\t", "\n"];
		this.commentStartSingle = options.commentStartSingle || "//";
		this.commentStartBlock = options.commentStartBlock || "/*";
		this.commentEndBlock = options.commentEndBlock || "*/";
		this.nestedLevel = 0;
		this.state = ParserState.Initial;
		this.lookaheadBuffer = [];
		this.quoteStarted = "";
		this.quoteStartIndex = 0;
	}

	/**
	 * Takes the next char of the string
	 *
	 * @returns {string} - The next char in the string
	 * @memberof StringParser
	 */
	take(): string {
		if (this.lookaheadBuffer.length) {
			return this.lookaheadBuffer.shift();
		}
		return this.buffer.shift();
	}

	/**
	 * Takes until a certain string or regexp have been encountered
	 *
	 * @param {(string | RegExp)} stringOrRegExp - The string or regexp to stop taking on
	 * @returns {string} - The string taken until the stop condition
	 * @memberof StringParser
	 */
	takeUntil(stringOrRegExp: string | RegExp): string {
		let result = "";
		while (this.buffer.getLength) {
			const char = this.take();
			if (typeof stringOrRegExp === "string" && char === stringOrRegExp) {
				break;
			} else if (stringOrRegExp instanceof RegExp && stringOrRegExp.test(char)) {
				break;
			}
			result += char;
		}
		return result;
	}

	/**
	 * Skips ahead until something other that a whitespace is encountered.
	 *
	 * @memberof StringParser
	 */
	skipWhitespaces() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (!this.whitespaces.includes(char)) {
				this.lookaheadBuffer.unshift(char);
				break;
			}
		}
	}

	/**
	 * Skips ahead until a full word have been read.
	 *
	 * @returns {string} - The next word in the string
	 * @memberof StringParser
	 */
	takeNextWord(): string {
		let result = "";
		while (this.buffer.getLength) {
			const char = this.take();
			if (this.whitespaces.includes(char)) {
				break;
			}
			result += char;
		}
		return result;
	}

	/**
	 * Keeps going until a whitespace is encountered.
	 *
	 * @returns {string} - The string taken until the whitespace
	 * @memberof StringParser
	 */
	takeUntilWhitespace(): string {
		let result = "";
		while (this.buffer.getLength) {
			const char = this.take();
			if (this.whitespaces.includes(char)) {
				break;
			}
			result += char;
		}
		return result;
	}

	/**
	 * Handles quotes in the input string, and emits events when quotes are encountered.
	 *
	 * @memberof StringParser
	 */
	handleQuotes() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (this.quotes.includes(char)) {
				if (this.quoteStarted === "") {
					this.quoteStarted = char;
					this.quoteStartIndex = this.buffer.getLength();
					this.emit("onQuoteStart", char);
				} else if (char === this.quoteStarted) {
					this.emit("onQuoteEnd", this.buffer.substring(this.quoteStartIndex, this.buffer.getLength()));
					this.quoteStarted = "";
				}
			}
		}
	}

	/**
	 * Handles nested structures in the input string, and emits events when
	 * nested structures are encountered.
	 *
	 * @memberof StringParser
	 */
	handleNesting() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (char === "{" || char === "[" || char === "(") {
				this.nestedLevel++;
				this.emit("onNestingStart", char);
			} else if (char === "}" || char === "]" || char === ")") {
				this.nestedLevel--;
				this.emit("onNestingEnd", char);
			}
		}
	}

	/**
	 * Handles different types of numbers in the input string, and emits events
	 * when numbers are encountered.
	 *
	 * @memberof StringParser
	 */
	handleNumbers() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (char === ".") {
				const float = this.takeUntilWhitespace();
				this.emit("onFloat", parseFloat(float));
			} else if (char === "0" && this.buffer[0] === "x") {
				this.take(); // skip the x
				const hex = this.takeUntilWhitespace();
				this.emit("onHex", parseInt(hex, 16));
			} else if (parseInt(char)) {
				const int = this.takeUntilWhitespace();
				this.emit("onInt", parseInt(int));
			}
		}
	}

	/**
	 * Handles escape sequences in the input string, and emits events when
	 * escape sequences are encountered.
	 *
	 * @memberof StringParser
	 */
	handleEscapeSequences() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (char === "\\") {
				const nextChar = this.take();
				if (nextChar === "n" || nextChar === "r" || nextChar === "t") {
					this.emit("onEscapeSequence", nextChar);
				} else {
					this.emit("onError", "Invalid escape sequence");
				}
			}
		}
	}

	/**
	 * Handles comments in the input string, and emits events when comments
	 * are encountered.
	 *
	 * @memberof StringParser
	 */
	handleComments() {
		while (this.buffer.getLength) {
			const char = this.take();
			if (char === this.commentStartSingle) {
				this.takeUntil("\n");
				this.emit("onSingleLineComment", this.buffer.substring(0, this.buffer.getLength()));
			} else if (char === this.commentStartBlock) {
				this.takeUntil(this.commentEndBlock);
				this.emit("onBlockComment", this.buffer.substring(0, this.buffer.getLength()));
			}
		}
	}

	stripComments(): string {
		let result = "";
		while (this.buffer.getLength) {
			const char = this.take();
			if (char === this.commentStartSingle) {
				this.takeUntil("\n");
			} else if (char === this.commentStartBlock) {
				this.takeUntil(this.commentEndBlock);
			} else {
				result += char;
			}
		}
		return result;
	}

	parse() {
		while (this.buffer.getLength) {
			this.handleQuotes();
			this.handleNesting();
			this.handleNumbers();
			this.handleEscapeSequences();
			this.handleComments();
		}
		this.emit("onFinish");
	}

	/**
	 * Subscribe to events if event emitter is present.
	 * @param eventName The name of the event to subscribe to.
	 * @param listener The event listener to subscribe.
	 */
	on(eventName: string, listener: (event: any) => void): void {
		if (this.eventEmitter) {
			this.eventEmitter.on(eventName, listener);
		}
	}

	emit(event: string, data?: any) {
		// handle emitting events based on the event name and data
	}
}
