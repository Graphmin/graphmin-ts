/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-22 12:00
 */
import { StringParser } from "../../common/util/string/string-parser";

class SQLParser {
	private parser: StringParser;
	private currentWord: string;
	private ast: any;

	constructor(sql: string) {
		this.parser = new StringParser({ string: sql });
		this.currentWord = "";
		this.ast = {
			type: "query",
			body: []
		};

		this.parser.on("onWord", (word: string) => {
			this.currentWord = word;
		});
		this.parser.on("onFinish", () => {
			console.log(this.ast);
		});
	}

	parse() {
		this.parser.parse();
	}
}

const sql = "SELECT * FROM users WHERE age > 20 AND name = 'John Smith'";
const sqlParser = new SQLParser(sql);
sqlParser.parse();
