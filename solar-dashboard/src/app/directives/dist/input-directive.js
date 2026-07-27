"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InputDirective = void 0;
var core_1 = require("@angular/core");
var InputDirective = /** @class */ (function () {
    function InputDirective() {
        this.elementRef = core_1.inject(core_1.ElementRef(), input = this.elementRef.nativeElement);
    }
    InputDirective.prototype.onBlur = function () {
        var normalizedValue = this.input.value.replaceAll(',', '.');
        var value = Number(normalizedValue);
        if (!!!value) {
            return;
        }
        this.elementRef.nativeElement.value =
            value.toFixed(2);
    };
    InputDirective.prototype.onInput = function () {
        this.input.value = this.input.value.replace(/[^0-9,.]/g, '');
    };
    __decorate([
        core_1.HostListener('blur')
    ], InputDirective.prototype, "onBlur");
    __decorate([
        core_1.HostListener('input')
    ], InputDirective.prototype, "onInput");
    InputDirective = __decorate([
        core_1.Directive({
            selector: '[appInputDirective]',
            standalone: true
        })
    ], InputDirective);
    return InputDirective;
}());
exports.InputDirective = InputDirective;
