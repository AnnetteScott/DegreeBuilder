export class UserInfo {
	courses = {} as {[name: string]: Course};
}

export class Course {
	streams = [] as Stream[];
}

export class Stream {
	year = 2023;
	sem = "" as "S1" | "S2";
	streamNum = "";
	startHour = 1;
	endHour = 2;
	day = 0;
}