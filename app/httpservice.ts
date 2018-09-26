import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';

@Injectable()
export class HTTPService {
	constructor(private _http: Http) {}

	// Stores entire day's data based on the current time when the page loads (for quicker page response times)
	// Stored in building_id : dataObj
	// dataObj = {
	//		hours: [],
	//		establishments: []	
	// }
	// Allows quick retrieval and adding to the currentMarker object in the App Component
	preloadedData = {

	};
	
	getOptions(sending) {
		var header = new Headers();
		
		if(sending) {
			header.append('Content-Type', 'application/json')
		}
		
		header.append('X-DreamFactory-Api-Key', '75f0b3d9f136e62b94890857444cc398e3ec52c28c5e4616aa02088d660733dc')
		
		var options = new RequestOptions({
		  headers: header
		});
		
		return options;
	}
	
	getBuildings() {
		return this._http.get('http://localhost:81/api/v2/food/_table/buildings', this.getOptions(false))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	getEstablishmentsById(id) {
		//console.log(id);
		return this._http.get('http://localhost:81/api/v2/food/_table/establishment?filter=building_id%3D' + id, this.getOptions(false))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}

	getEstablishments() {
		//console.log(id);
		return this._http.get('http://localhost:81/api/v2/food/_table/establishment', this.getOptions(false))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	getTimesByBuildingId(id) {
		return this._http.get('http://localhost:81/api/v2/food/_table/times?&order=day%20ASC%2C%20open%20ASC&filter=building_id%3D' + id, this.getOptions(false))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	getTimesByBuildingIdAndDayAndTime(id, day, time) {
			//console.log('http://localhost:81/api/v2/food/_table/times?filter=(building_id%3D' + id + ')%20AND%20(day%3D' + day + ')%20AND%20((close%3E%3D' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC');
			return this._http.get('http://localhost:81/api/v2/food/_table/times?filter=(building_id%3D' + id + ')%20AND%20(day%3D' + day + ')%20AND%20((close%3E' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC', this.getOptions(false))
			//Extract the HTTP response to a JSON object
			.map(res => res.json());
	}

	getTimesByDayAndTime(day, time) {
			//console.log('http://localhost:81/api/v2/food/_table/times?filter=(day%3D' + day + ')%20AND%20((close%3E%3D' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC');
			return this._http.get('http://localhost:81/api/v2/food/_table/times?filter=(day%3D' + day + ')%20AND%20((close%3E' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC', this.getOptions(false))
			//Extract the HTTP response to a JSON object
			.map(res => res.json());
	}
	
	getTimesByEstablishmentId(id) {
		return this._http.get('http://localhost:81/api/v2/food/_table/times?order=day%20ASC&filter=establishment_id%3D' + id, this.getOptions(false))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	modifyTimesRecord(id, data) {	
		return this._http.put('http://localhost:81/api/v2/food/_table/times/' + id, data, this.getOptions(true))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	addTimesRecord(data) {		
		return this._http.post('http://localhost:81/api/v2/food/_table/times', data, this.getOptions(true))
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
	
	deleteTimesRecord(id) {
		var options = this.getOptions(true);
		options["method"] = RequestMethod.Delete;
		options["body"] = JSON.stringify({ids: [id]})
		
		return this._http.request('http://localhost:81/api/v2/food/_table/times', options)
		//Extract the HTTP response to a JSON object
		.map(res => res.json());
	}
}