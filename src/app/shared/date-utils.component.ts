import {DatePipe} from "@angular/common";

export function dateConversion(bsonDate: any): string | null {
    console.log("Dat: ", bsonDate);
    if (bsonDate === undefined || bsonDate.$date === undefined) {
        return "-";
    }
    return new DatePipe('de-De').transform(bsonDate.$date, 'yyyy-MM-dd HH:mm:ss');
}