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
var core_2 = require('angular2-google-maps/core');
var AppComponent = (function () {
    function AppComponent(_httpService, _timeService) {
        this._httpService = _httpService;
        this._timeService = _timeService;
        this.schedules = null;
        this.visible = false;
        this.d = new Date();
        this.day = this.d.getDay();
        this.hour = (this.d.getHours() * 60) + this.d.getMinutes();
        this.date = this.d.toDateString();
        this.tick = null;
        this.polling = false;
        this.styles = [
            {
                featureType: "poi",
                elementType: "all",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        this.allMarkers = [];
        this.currentMarker = {
            name: "",
            id: "",
            lat: "",
            lng: "",
            establishments: [],
            hours: []
        };
        this.map = {
            lat: 47.6568976,
            lng: -122.3088962,
            zoom: 16,
            height: '100%',
            draggable: true
        };
        this.window = {
            innerWidth: 0
        };
        this.loaded = false;
        this.mapVisible = false;
        if (window.innerWidth < 1024) {
            this.map.zoom = 15;
        }
        console.log(this.day);
        console.log(this.convertToReadableTime(this.hour));
        this.toggleTick();
        this.constructCoords();
        this.loadData();
    }
    AppComponent.prototype.clicked = function (markerData, index) {
        this.window.innerWidth = window.innerWidth;
        this.currentMarker = markerData;
        if (this.loaded) {
            this.visible = true;
            this.currentMarker.hours = this._httpService.preloadedData[markerData.id].hours;
            this.currentMarker.establishments = this._httpService.preloadedData[markerData.id].establishments;
            this.map.height = '20%';
            this.map.draggable = false;
            this.sebmGoogMap.triggerResize();
            console.log(this.currentMarker);
        }
    };
    AppComponent.prototype.mapClicked = function () {
        if (this.map.height != '100%') {
            this.visible = false;
            this.map.height = '100%';
            this.map.draggable = true;
            this.sebmGoogMap.triggerResize();
        }
    };
    AppComponent.prototype.loadData = function () {
        var _this = this;
        this._httpService.getBuildings()
            .subscribe(function (data) {
            for (var i = 0; i < data.resource.length; i++) {
                _this._httpService.preloadedData[data.resource[i].idBuildings] = {};
                _this._httpService.preloadedData[data.resource[i].idBuildings]["establishments"] = [];
                _this._httpService.preloadedData[data.resource[i].idBuildings]["hours"] = [];
            }
        }, function (error) { return console.log(error); }, function () { return _this.loadEstablishments(); });
    };
    AppComponent.prototype.loadEstablishments = function () {
        var _this = this;
        this._httpService.getEstablishments()
            .subscribe(function (data) {
            for (var i = 0; i < data.resource.length; i++) {
                data.resource[i]["hours"] = [];
                _this._httpService.preloadedData[data.resource[i].building_id]["establishments"].push(data.resource[i]);
            }
        }, function (error) { return console.log(error); }, function () { return _this.loadTimes(); });
    };
    AppComponent.prototype.loadTimes = function () {
        var _this = this;
        this._httpService.getTimesByDayAndTime(this.day, this.hour)
            .subscribe(function (data) {
            for (var i = 0; i < data.resource.length; i++) {
                if (data.resource[i].establishment_id == null) {
                    _this._httpService.preloadedData[data.resource[i].building_id]["hours"].push(data.resource[i]);
                }
                else {
                    for (var j = 0; j < _this._httpService.preloadedData[data.resource[i].building_id]["establishments"].length; j++) {
                        if (data.resource[i].establishment_id == _this._httpService.preloadedData[data.resource[i].building_id]["establishments"][j].idestablishment) {
                            _this._httpService.preloadedData[data.resource[i].building_id]["establishments"][j]["hours"].push(data.resource[i]);
                        }
                    }
                }
            }
        }, function (error) { return console.log(error); }, function () {
            _this.loaded = true;
            var temp = setTimeout(function () { return _this.showMap(); }, 800);
        });
    };
    AppComponent.prototype.showMap = function () {
        this.mapVisible = true;
    };
    AppComponent.prototype.constructCoords = function () {
        var _this = this;
        this._httpService.getBuildings()
            .subscribe(function (data) {
            for (var i = 0; i < data.resource.length; i++) {
                var obj = {
                    name: data.resource[i].NAME,
                    id: data.resource[i].idBuildings,
                    lat: data.resource[i].LAT,
                    lng: data.resource[i].LNG,
                    establishments: [],
                    hours: []
                };
                _this.allMarkers.push(obj);
            }
        }, function (error) { return console.log(error); }, function () { return console.log("Loaded Markers"); });
    };
    AppComponent.prototype.convertToReadableTime = function (time) {
        return this._timeService.convertToReadableTime(time);
    };
    AppComponent.prototype.toggleTick = function () {
        var _this = this;
        if (!this.polling) {
            clearInterval(this.tick);
            this.tick = null;
            this.resetTime();
            this.tick = setInterval(function () { return _this.timeTick(); }, 60000);
            this.polling = true;
        }
        else {
            clearInterval(this.tick);
            this.tick = null;
            this.resetTime();
            this.tick = setInterval(function () { return _this.timeTick(); }, 25);
            this.polling = false;
        }
    };
    AppComponent.prototype.timeTick = function () {
        this.d.setTime(this.d.getTime() + 60000);
        this.day = this.d.getDay();
        this.hour = (this.d.getHours() * 60) + this.d.getMinutes();
        this.date = this.d.toDateString();
    };
    AppComponent.prototype.resetTime = function () {
        this.d = new Date();
        this.day = this.d.getDay();
        this.hour = (this.d.getHours() * 60) + this.d.getMinutes();
        this.date = this.d.toDateString();
    };
    __decorate([
        core_1.ViewChild(core_2.SebmGoogleMap), 
        __metadata('design:type', core_2.SebmGoogleMap)
    ], AppComponent.prototype, "sebmGoogMap", void 0);
    __decorate([
        core_1.ViewChildren(core_2.SebmGoogleMapMarker), 
        __metadata('design:type', Array)
    ], AppComponent.prototype, "markers", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'partials/main.html',
            providers: [httpservice_1.HTTPService, timeservice_1.TimeService]
        }), 
        __metadata('design:paramtypes', [httpservice_1.HTTPService, timeservice_1.TimeService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map