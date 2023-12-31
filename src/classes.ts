export class UserInfo {
	courses = {} as {[name: string]: Course};
	startYear = 2022;
	degreeLength = 4;
}

export class Course {
	streams = [] as Stream[];
	prerequisites = [] as string[];
	completed = false;
	year = 0;
	sem = "" as "S1" | "S2" | "";
	title = ""
}

export class Stream {
	classes = [] as ClassItem[]
	streamNum = "";
}

export class ClassItem {
	startHour = 8;
	endHour = 9;
	day = 0;
}