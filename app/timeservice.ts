import {Injectable} from '@angular/core';

@Injectable()
export class TimeService {

	convertToReadableTime(time) {
		var hours = Math.floor(time/60);
		var minutes = time % 60;
		var ending;

		if(hours < 12){
			ending = "AM";
		} else if (hours > 12) {
			ending = "PM";
			hours = hours - 12;
		}
		
		if (hours == 12) {
			ending = "PM";
		} else if (hours == 0) {
			hours = hours + 12;
			ending = "AM";
		}
		
		if(minutes >= 10){
			return hours.toString() + ":" + minutes.toString() + " " + ending;
		} else {
			return hours.toString() + ":0" + minutes.toString() + " " + ending;
		}
	}
}