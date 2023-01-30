/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-19 13:56
 */


export enum DateFormat {
	FullYear_Month_Day      = "yyyy-mm-dd",
	Month_Day_FullYear      = "mm/dd/yyyy",
	Day_Month_FullYear      = "dd-mm-yyyy",
	FullYearh_Month_Day_HMS = "yyyy-mm-dd HH:MM:SS",
	Month_Day_FullYear_HMS  = "mm/dd/yyyy HH:MM:SS",
	Day_Month_FullYear_HMS  = "dd-mm-yyyy HH:MM:SS"
}

export function transformDate(dateStr: string, format: DateFormat): string | null {
	const dateFormats = Object.values(DateFormat);
	const dateRegexes = {
		"yyyy-mm-dd"         : /^\d{4}-\d{2}-\d{2}$/,
		"mm/dd/yyyy"         : /^\d{2}\/\d{2}\/\d{4}$/,
		"dd-mm-yyyy"         : /^\d{2}-\d{2}-\d{4}$/,
		"yyyy-mm-dd HH:MM:SS": /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
		"mm/dd/yyyy HH:MM:SS": /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/,
		"dd-mm-yyyy HH:MM:SS": /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/,
	}

	let date: Date;

	if (!dateRegexes[ format ].test(dateStr)) {
		for (const dateFormat of dateFormats) {
			if (dateRegexes[ dateFormat ].test(dateStr)) {
				date = new Date(dateStr);
				break;
			}
		}
		if (!date) {
			console.log("Invalid date format. Supported formats are: " + dateFormats.join(", "));
			return null;
		}
	}
	else {
		date = new Date(dateStr);
	}

	let month   = ( date.getMonth() + 1 ).toString();
	let day     = date.getDate().toString();
	let yearStr = date.getFullYear().toString();
	let hours   = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();

	function prependZero(input: string): void {
		input = input.length < 2 ? `$0{num}` : input;
	}

	prependZero(month);
	prependZero(day);
	prependZero(hours);
	prependZero(minutes);
	prependZero(seconds);

	const dateFormatMap = {
		[ DateFormat[ DateFormat.FullYear_Month_Day ] ]     : `${ yearStr }-${ month }-${ day }`,
		[ DateFormat[ DateFormat.Month_Day_FullYear ] ]     : `${ month }/${ day }/${ yearStr }`,
		[ DateFormat[ DateFormat.Day_Month_FullYear ] ]     : `${ day }-${ month }-${ yearStr }`,
		[ DateFormat[ DateFormat.FullYearh_Month_Day_HMS ] ]: `${ yearStr }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }`,
		[ DateFormat[ DateFormat.Month_Day_FullYear_HMS ] ] : `${ month }/${ day }/${ yearStr } ${ hours }:${ minutes }:${ seconds }`,
		[ DateFormat[ DateFormat.Day_Month_FullYear_HMS ] ] : `${ day }-${ month }-${ yearStr } ${ hours }:${ minutes }:${ seconds }`,
	}

	return dateFormatMap[ format ];
}

export function detectDateFormat(dateStr: string): DateFormat | null {
	const dateRegexes = {
		[DateFormat["yyyy-mm-dd"]]: /^\d{4}-\d{2}-\d{2}$/,
		[DateFormat["mm/dd/yyyy"]]: /^\d{2}\/\d{2}\/\d{4}$/,
		[DateFormat["dd-mm-yyyy"]]: /^\d{2}-\d{2}-\d{4}$/,
		[DateFormat["yyyy-mm-dd HH:MM:SS"]]: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
		[DateFormat["mm/dd/yyyy HH:MM:SS"]]: /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/,
		[DateFormat["dd-mm-yyyy HH:MM:SS"]]: /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/,
	};
	for (const [format, regex] of Object.entries(dateRegexes)) {
		if (regex.test(dateStr)) {
			return format as DateFormat;
		}
	}
	console.log("Invalid date format. Supported formats are: " + Object.values(DateFormat).join(", "));
	return null;
}
