import {Injectable} from '@angular/core';

export interface TimeRange {
    value: string;
    viewValue: string;
}

const TimeRanges: Array<TimeRange> = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'LastHour', viewValue: 'Last Hour'},
    {value: 'Last3Hours', viewValue: 'Last 3 Hours'},
    {value: 'Last6Hours', viewValue: 'Last 6 Hours'},
    {value: 'Last12Hours', viewValue: 'Last 12 Hours'},
];

export interface Topx {
    value: number;
    viewValue: string;
}

const TopXs: Array<Topx> = [
    {value: 5, viewValue: 'Top 5'},
    {value: 10, viewValue: 'Top 10'},
    {value: -1, viewValue: 'All'},
];

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor() {
    }

    getAnimation() {
        return {enabled: false};
    }

    getRanges(): TimeRange[] {
        return TimeRanges;
    }

    getDefaultRange(): string {
        return TimeRanges[0].value;
    }

    getTopxs(): Topx[] {
        return TopXs;
    }

    getDefaultTopx(): number {
        return TopXs[0].value;
    }

    getStartTime(choice: string): Date {
        let date = new Date();
        let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds());
        let startTime = new Date(now_utc)
        if (choice == 'Today') {
            startTime.setHours(0, 0, 0, 0);
        } else if (choice == 'LastHour') {
            startTime.setHours(startTime.getHours() - 1);
        } else if (choice == 'Last3Hours') {
            startTime.setHours(startTime.getHours() - 3);
        } else if (choice == 'Last6Hours') {
            startTime.setHours(startTime.getHours() - 6);
        } else if (choice == 'Last12Hours') {
            startTime.setHours(startTime.getHours() - 12);
        }
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        return startTime;
    }

    getEndTime(): Date {
        let endTime = new Date();
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);
        return endTime;
    }
}