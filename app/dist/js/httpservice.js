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
require('rxjs/add/operator/map');
var http_1 = require('@angular/http');
var HTTPService = (function () {
    function HTTPService(_http) {
        this._http = _http;
        this.preloadedData = {};
    }
    HTTPService.prototype.getOptions = function (sending) {
        var header = new http_1.Headers();
        if (sending) {
            header.append('Content-Type', 'application/json');
        }
        header.append('X-DreamFactory-Api-Key', 'dc11d4c76d3a151a008dccf6c8913951b29a6cbc2206c4eb5c4132182d341132');
        var options = new http_1.RequestOptions({
            headers: header
        });
        return options;
    };
    HTTPService.prototype.getBuildings = function () {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/buildings', this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getEstablishmentsById = function (id) {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/establishment?filter=building_id%3D' + id, this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getEstablishments = function () {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/establishment', this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getTimesByBuildingId = function (id) {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/times?&order=day%20ASC%2C%20open%20ASC&filter=building_id%3D' + id, this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getTimesByBuildingIdAndDayAndTime = function (id, day, time) {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/times?filter=(building_id%3D' + id + ')%20AND%20(day%3D' + day + ')%20AND%20((close%3E' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC', this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getTimesByDayAndTime = function (day, time) {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/times?filter=(day%3D' + day + ')%20AND%20((close%3E' + time + ')%20OR%20(close%3D0))&order=establishment_id%2C%20open%20ASC', this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.getTimesByEstablishmentId = function (id) {
        return this._http.get('http://df.nathanwreggit.com/api/v2/food/_table/times?order=day%20ASC&filter=establishment_id%3D' + id, this.getOptions(false))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.modifyTimesRecord = function (id, data) {
        return this._http.put('http://df.nathanwreggit.com/api/v2/food/_table/times/' + id, data, this.getOptions(true))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.addTimesRecord = function (data) {
        return this._http.post('http://df.nathanwreggit.com/api/v2/food/_table/times', data, this.getOptions(true))
            .map(function (res) { return res.json(); });
    };
    HTTPService.prototype.deleteTimesRecord = function (id) {
        var options = this.getOptions(true);
        options["method"] = http_1.RequestMethod.Delete;
        options["body"] = JSON.stringify({ ids: [id] });
        return this._http.request('http://df.nathanwreggit.com/api/v2/food/_table/times', options)
            .map(function (res) { return res.json(); });
    };
    HTTPService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HTTPService);
    return HTTPService;
}());
exports.HTTPService = HTTPService;
//# sourceMappingURL=httpservice.js.map