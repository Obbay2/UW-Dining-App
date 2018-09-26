import {Component, ViewChild, ViewChildren} from '@angular/core';
import {HTTPService} from './httpservice';
import {TimeService} from './timeservice';
import {SebmGoogleMap, SebmGoogleMapMarker} from 'angular2-google-maps/core';
import {MapTypeStyle} from 'angular2-google-maps/core';

@Component({
    selector: 'my-app',
    templateUrl: 'partials/main.html',
	providers: [HTTPService, TimeService]
})
export class AppComponent {	

	@ViewChild(SebmGoogleMap) private sebmGoogMap: SebmGoogleMap;
	@ViewChildren(SebmGoogleMapMarker) markers: Array<SebmGoogleMapMarker>;

	schedules = null;
	visible = false;
	
	d = new Date();
	day = this.d.getDay();
	hour = (this.d.getHours() * 60) + this.d.getMinutes();
	date = this.d.toDateString();
	
	tick = null;
	polling = false;

	public styles: MapTypeStyle[] = [
        {
            featureType: "poi",
            elementType: "all",
            stylers: [
                {visibility: "off"}
            ]
        }
    ];
	
	allMarkers = [
	
	]
	
	currentMarker = {
		name: "",
		id: "",
		lat: "",
		lng: "",
		establishments: [],
		hours: []
	}
	
	map = {
		lat: 47.6568976,
		lng: -122.3088962,
		zoom: 16,
		height: '100%',
		draggable: true
	}

	window = {
		innerWidth: 0
	}

	loaded = false;
	mapVisible = false;
	
	clicked(markerData, index) {
		this.window.innerWidth = window.innerWidth;
		this.currentMarker = markerData;

		if(this.loaded) {
			this.visible = true;
			this.currentMarker.hours = this._httpService.preloadedData[markerData.id].hours;
			this.currentMarker.establishments = this._httpService.preloadedData[markerData.id].establishments;
			this.map.height = '20%';
			this.map.draggable = false;
			this.sebmGoogMap.triggerResize();
			console.log(this.currentMarker);
		}
	}

	mapClicked() {
		if(this.map.height != '100%') {
			this.visible = false;
			this.map.height = '100%';
			this.map.draggable = true;
			this.sebmGoogMap.triggerResize();
		}
	}
	
	constructor (private _httpService:HTTPService, private _timeService:TimeService) {
		
		// If we are on a small screen make the map less zoomed in
		if(window.innerWidth < 1024) {
			this.map.zoom = 15;
		}

		console.log(this.day);
		console.log(this.convertToReadableTime(this.hour));

		this.toggleTick();
		this.constructCoords();
		this.loadData();
	}

	loadData() {
		this._httpService.getBuildings()
		.subscribe(
			data => {
				for(var i = 0; i < data.resource.length; i++) {
					this._httpService.preloadedData[data.resource[i].idBuildings] = {};
					this._httpService.preloadedData[data.resource[i].idBuildings]["establishments"] = [];
					this._httpService.preloadedData[data.resource[i].idBuildings]["hours"] = [];	
				}
			},
			error => console.log(error),
			() => this.loadEstablishments());
	}

	loadEstablishments () {
		this._httpService.getEstablishments()
		.subscribe(
			data => {

				for(var i = 0; i < data.resource.length; i++) {
					data.resource[i]["hours"] = [];
					this._httpService.preloadedData[data.resource[i].building_id]["establishments"].push(data.resource[i]);
				}
				
				
			},
			error => console.log(error),
			() => this.loadTimes());
	}

	loadTimes() {
		this._httpService.getTimesByDayAndTime(this.day, this.hour)
		.subscribe(
			data => {
				for(var i = 0; i < data.resource.length; i++) {
					if(data.resource[i].establishment_id == null) {
						this._httpService.preloadedData[data.resource[i].building_id]["hours"].push(data.resource[i]);
					} else {
						for(var j = 0; j < this._httpService.preloadedData[data.resource[i].building_id]["establishments"].length; j++) {
							if(data.resource[i].establishment_id == this._httpService.preloadedData[data.resource[i].building_id]["establishments"][j].idestablishment) {
								this._httpService.preloadedData[data.resource[i].building_id]["establishments"][j]["hours"].push(data.resource[i]);
							}
						}
					}
				}
			},
			error => console.log(error),
			() => {
				this.loaded = true;
				var temp = setTimeout(() => this.showMap(), 800);
			});
	}

	showMap(){
		this.mapVisible = true;	
	}
	
	constructCoords() {
		this._httpService.getBuildings()
		.subscribe(
			data => {
				
				for(var i = 0; i < data.resource.length; i++) {
					var obj = {
						name: data.resource[i].NAME,
						id: data.resource[i].idBuildings,
						lat: data.resource[i].LAT,
						lng: data.resource[i].LNG,
						establishments: [],
						hours:[]
					}
					this.allMarkers.push(obj);
				}
			},
			error => console.log(error),
			() => console.log("Loaded Markers")
		);	
	}
	
	convertToReadableTime(time) {
		return this._timeService.convertToReadableTime(time);
	}
	
	toggleTick() {
		if(!this.polling) {
			clearInterval(this.tick);
			this.tick = null;
			this.resetTime();
			this.tick = setInterval(() => this.timeTick(), 60000);
			this.polling = true;
		} else {
			clearInterval(this.tick);
			this.tick = null;
			this.resetTime();
			this.tick = setInterval(() => this.timeTick(), 25);
			this.polling = false;
		}
	}
	
	timeTick(){ 
		this.d.setTime(this.d.getTime() + 60000);
		this.day = this.d.getDay();
		this.hour = (this.d.getHours() * 60) + this.d.getMinutes();
		this.date = this.d.toDateString();
	}
	
	resetTime(){
		this.d = new Date();
		this.day = this.d.getDay();
		this.hour = (this.d.getHours() * 60) + this.d.getMinutes();
		this.date = this.d.toDateString();
	}
		
}