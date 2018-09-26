import {Component} from '@angular/core';
import {HTTPService} from './httpservice';
import {TimeService} from './timeservice';

@Component({
    selector: 'admin-app',
    templateUrl: 'partials/admin.html',
	providers: [HTTPService, TimeService]
})
export class AppComponent { 
	schedules = null;
	estab = null;
	times = null;
	first = true;
	second = false;
	
	timesArray = {};
	establishmentArray = {};
	
	duplicateToID = null;
	
	headerSwitch = true;
	
	dataSwitch = {};
	
	editing = {
		name:null,
		id:null
	};
	
	timeObject = {
		open:0,
		close:0,
		day:1,
		name:"Normal",
		establishment_id:null,
		building_id:null
	};
	
	
	
	constructor (private _httpService:HTTPService, private _timeService:TimeService) {
		this.initialize()
	}
	
	initialize() {
		this._httpService.getBuildings()
		.subscribe(
			data => this.schedules = data,
			error => console.log(error),
			() => console.log("Request Complete")
		);
	}
	
	editBuilding(id, name) {
		this.editing.name = name;
		this.editing.id = id;
		this.first = false;
		this.second = true;
		
		this.timesArray = {};
		this.establishmentArray = {};
		
		this.duplicateToID = null;
		
		this.estab = null;
		this.times = null;
		
		this._httpService.getEstablishmentsById(id)
		.subscribe(
			data => {
				this.estab = data
				console.log(data);
				for(var i = 0; i < data.resource.length; i++) {
					this.establishmentArray[i] = false;
				}
				this.establishmentArray[-1] = false;
			},
			error => console.log(error),
			() => console.log("Request Complete")
		);
		
		this._httpService.getTimesByBuildingId(id)
		.subscribe(
			data => {
				this.times = data;
				for(var i = 0; i < data.resource.length; i++) {
					this.timesArray[i] = false;
				}
			},
			error => console.log(error),
			() => console.log("Request Complete")
		);		
	}
	
	resetTimesData(id) {
		this.timesArray = {};
		this.times = null;
		
		this._httpService.getTimesByBuildingId(id)
		.subscribe(
			data => {
				this.times = data;
				for(var i = 0; i < data.resource.length; i++) {
					this.timesArray[i] = false;
				}
			},
			error => console.log(error),
			() => console.log("Request Complete")
		);
	}
	
	editHours(index) {
		this.timesArray[index] = true;
	}
	
	saveHours(index, obj) {
		this.timesArray[index] = false;
		
		console.log(obj);
			
		this._httpService.modifyTimesRecord(obj.idtimes, JSON.stringify(obj))
		.subscribe(
			data => console.log(data),
			error => console.log(error),
			() => console.log("Updated Record")
		);
	}
	
	cancelEditHours(index) {
		this.timesArray[index] = false;
		this.editBuilding(this.editing.id, this.editing.name);
	}
	
	addHours(index, establishment_id) {
		this.establishmentArray[index] = true;
		this.timeObject.building_id = this.editing.id;
		this.timeObject.establishment_id = establishment_id;
	}
	
	saveNewHours(index) {
		this.establishmentArray[index] = false;
		
		var wrapper = {
			resource:[]
		};
		wrapper.resource[0] = this.timeObject;
		
		this._httpService.addTimesRecord(JSON.stringify(wrapper))
		.subscribe(
			data => {
				console.log(data)
				this.resetTimesData(this.editing.id);
				this.resetTimeObject();
			},
			error => console.log(error),
			() => console.log("Updated Record")
		);
	}
	
	cancelAddHours(index) {
		this.establishmentArray[index] = false;
		this.resetTimeObject();
	}
	
	duplicateHours(obj) {
		
		delete obj.idtimes;
		
		var wrapper = {
			resource:[]
		};
		wrapper.resource[0] = obj;
		
		this._httpService.addTimesRecord(JSON.stringify(wrapper))
		.subscribe(
			data => {
				console.log(data)
				this.resetTimesData(this.editing.id);
			},
			error => console.log(error),
			() => console.log("Updated Record")
		);
	}
	
	duplicateAllHours(establishment_id) {
		
		this._httpService.getTimesByEstablishmentId(establishment_id)
		.subscribe(
			data => {
				
				for (var i = 0; i < data.resource.length; i++) {
					delete data.resource[i].idtimes
					data.resource[i].establishment_id = this.duplicateToID;
				}
				
				this._httpService.addTimesRecord(JSON.stringify(data))
				.subscribe(
					data => {
						console.log(data);
						this.resetTimesData(this.editing.id);
					},
					error => console.log(error),
					() => console.log("Updated Record")
				);
		
			},
			error => console.log(error),
			() => console.log("Updated Records")
		);
	}
	
	deleteHours(obj) {
		this._httpService.deleteTimesRecord(obj.idtimes)
		.subscribe(
			data => {
				console.log(data);
				this.resetTimesData(this.editing.id);
			},
			error => console.log(error),
			() => console.log("Deleted Record")
		);
	}
	
	resetTimeObject() {
		this.timeObject.open = 0;
		this.timeObject.close = 0;
		this.timeObject.name = "Normal";
		this.timeObject.day = 1;
		this.timeObject.establishment_id = null;
		this.timeObject.building_id = null;
	}
	 
	convertToReadableTime(time) {
		return this._timeService.convertToReadableTime(time);
	}
	
	returnToPage(pageNum) {
		if(pageNum == 1) {
			this.second = false;
			this.first = true;
		}
	}
}