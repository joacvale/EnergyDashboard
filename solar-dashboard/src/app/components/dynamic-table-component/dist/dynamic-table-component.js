"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.DynamicTableComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var DynamicTableComponent = /** @class */ (function () {
    function DynamicTableComponent() {
        this.offerUnit = core_1.input.required();
        this.tableData = [
            {
                rowName: 'Volume',
                field: 'volume'
            },
            {
                rowName: 'Price',
                field: 'price'
            },
            {
                rowName: 'Net Position',
                field: 'netPosition'
            },
            {
                rowName: 'DAM Price',
                field: 'damPrice'
            }
        ];
        this.displayedColumns = __spreadArrays([
            'field'
        ], Array.from({ length: 96 }, function (_, i) { return "q" + (i + 1); }));
        this.hours = Array.from({ length: 24 }, function (_, i) { return ({
            label: "H" + (i + 1)
        }); });
    }
    DynamicTableComponent.prototype.getValue = function (quarter, field) {
        return quarter[field];
    };
    DynamicTableComponent.prototype.setValue = function (quarter, field, value) {
        quarter[field] = Number(value.toFixed(2));
    };
    DynamicTableComponent.prototype.save = function () { };
    DynamicTableComponent = __decorate([
        core_1.Component({
            selector: 'app-dynamic-table-component',
            imports: [forms_1.FormsModule],
            standalone: true,
            templateUrl: './dynamic-table-component.html',
            styleUrl: './dynamic-table-component.scss'
        })
    ], DynamicTableComponent);
    return DynamicTableComponent;
}());
exports.DynamicTableComponent = DynamicTableComponent;
