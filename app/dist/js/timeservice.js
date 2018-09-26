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
var TimeService = (function () {
    function TimeService() {
    }
    TimeService.prototype.convertToReadableTime = function (time) {
        var hours = Math.floor(time / 60);
        var minutes = time % 60;
        var ending;
        if (hours < 12) {
            ending = "AM";
        }
        else if (hours > 12) {
            ending = "PM";
            hours = hours - 12;
        }
        if (hours == 12) {
            ending = "PM";
        }
        else if (hours == 0) {
            hours = hours + 12;
            ending = "AM";
        }
        if (minutes >= 10) {
            return hours.toString() + ":" + minutes.toString() + " " + ending;
        }
        else {
            return hours.toString() + ":0" + minutes.toString() + " " + ending;
        }
    };
    TimeService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TimeService);
    return TimeService;
}());
exports.TimeService = TimeService;
//# sourceMappingURL=timeservice.js.map