"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var httpservice_1 = require('./httpservice');
var timeservice_1 = require('./timeservice');
var AppComponent = (function () {
    function AppComponent(_httpService, _timeService) {
        this._httpService = _httpService;
        this._timeService = _timeService;
        this.schedules = null;
        this.estab = null;
        this.times = null;
        this.first = true;
        this.second = false;
        this.timesArray = {};
        this.establishmentArray = {};
        this.duplicateToID = null;
        this.headerSwitch = true;
        this.dataSwitch = {};
        this.editing = {
            name: null,
            id: null
        };
        this.timeObject = {
            open: 0,
            close: 0,
            day: 1,
            name: "Normal",
            establishment_id: null,
            building_id: null
        };
        this.initialize();
    }
    AppComponent.prototype.initialize = function () {
        var _this = this;
        this._httpService.getBuildings()
            .subscribe(function (data) { return _this.schedules = data; }, function (error) { return console.log(error); }, function () { return console.log("Request Complete"); });
    };
    AppComponent.prototype.editBuilding = function (id, name) {
        var _this = this;
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
            .subscribe(function (data) {
            _this.estab = data;
            console.log(data);
            for (var i = 0; i < data.resource.length; i++) {
                _this.establishmentArray[i] = false;
            }
            _this.establishmentArray[-1] = false;
        }, function (error) { return console.log(error); }, function () { return console.log("Request Complete"); });
        this._httpService.getTimesByBuildingId(id)
            .subscribe(function (data) {
            _this.times = data;
            for (var i = 0; i < data.resource.length; i++) {
                _this.timesArray[i] = false;
            }
        }, function (error) { return console.log(error); }, function () { return console.log("Request Complete"); });
    };
    AppComponent.prototype.resetTimesData = function (id) {
        var _this = this;
        this.timesArray = {};
        this.times = null;
        this._httpService.getTimesByBuildingId(id)
            .subscribe(function (data) {
            _this.times = data;
            for (var i = 0; i < data.resource.length; i++) {
                _this.timesArray[i] = false;
            }
        }, function (error) { return console.log(error); }, function () { return console.log("Request Complete"); });
    };
    AppComponent.prototype.editHours = function (index) {
        this.timesArray[index] = true;
    };
    AppComponent.prototype.saveHours = function (index, obj) {
        this.timesArray[index] = false;
        console.log(obj);
        this._httpService.modifyTimesRecord(obj.idtimes, JSON.stringify(obj))
            .subscribe(function (data) { return console.log(data); }, function (error) { return console.log(error); }, function () { return console.log("Updated Record"); });
    };
    AppComponent.prototype.cancelEditHours = function (index) {
        this.timesArray[index] = false;
        this.editBuilding(this.editing.id, this.editing.name);
    };
    AppComponent.prototype.addHours = function (index, establishment_id) {
        this.establishmentArray[index] = true;
        this.timeObject.building_id = this.editing.id;
        this.timeObject.establishment_id = establishment_id;
    };
    AppComponent.prototype.saveNewHours = function (index) {
        var _this = this;
        this.establishmentArray[index] = false;
        var wrapper = {
            resource: []
        };
        wrapper.resource[0] = this.timeObject;
        this._httpService.addTimesRecord(JSON.stringify(wrapper))
            .subscribe(function (data) {
            console.log(data);
            _this.resetTimesData(_this.editing.id);
            _this.resetTimeObject();
        }, function (error) { return console.log(error); }, function () { return console.log("Updated Record"); });
    };
    AppComponent.prototype.cancelAddHours = function (index) {
        this.establishmentArray[index] = false;
        this.resetTimeObject();
    };
    AppComponent.prototype.duplicateHours = function (obj) {
        var _this = this;
        delete obj.idtimes;
        var wrapper = {
            resource: []
        };
        wrapper.resource[0] = obj;
        this._httpService.addTimesRecord(JSON.stringify(wrapper))
            .subscribe(function (data) {
            console.log(data);
            _this.resetTimesData(_this.editing.id);
        }, function (error) { return console.log(error); }, function () { return console.log("Updated Record"); });
    };
    AppComponent.prototype.duplicateAllHours = function (establishment_id) {
        var _this = this;
        this._httpService.getTimesByEstablishmentId(establishment_id)
            .subscribe(function (data) {
            for (var i = 0; i < data.resource.length; i++) {
                delete data.resource[i].idtimes;
                data.resource[i].establishment_id = _this.duplicateToID;
            }
            _this._httpService.addTimesRecord(JSON.stringify(data))
                .subscribe(function (data) {
                console.log(data);
                _this.resetTimesData(_this.editing.id);
            }, function (error) { return console.log(error); }, function () { return console.log("Updated Record"); });
        }, function (error) { return console.log(error); }, function () { return console.log("Updated Records"); });
    };
    AppComponent.prototype.deleteHours = function (obj) {
        var _this = this;
        this._httpService.deleteTimesRecord(obj.idtimes)
            .subscribe(function (data) {
            console.log(data);
            _this.resetTimesData(_this.editing.id);
        }, function (error) { return console.log(error); }, function () { return console.log("Deleted Record"); });
    };
    AppComponent.prototype.resetTimeObject = function () {
        this.timeObject.open = 0;
        this.timeObject.close = 0;
        this.timeObject.name = "Normal";
        this.timeObject.day = 1;
        this.timeObject.establishment_id = null;
        this.timeObject.building_id = null;
    };
    AppComponent.prototype.convertToReadableTime = function (time) {
        return this._timeService.convertToReadableTime(time);
    };
    AppComponent.prototype.returnToPage = function (pageNum) {
        if (pageNum == 1) {
            this.second = false;
            this.first = true;
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'admin-app',
            templateUrl: 'partials/admin.html',
            providers: [httpservice_1.HTTPService, timeservice_1.TimeService]
        }), 
        __metadata('design:paramtypes', [httpservice_1.HTTPService, timeservice_1.TimeService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=admin.component.js.map