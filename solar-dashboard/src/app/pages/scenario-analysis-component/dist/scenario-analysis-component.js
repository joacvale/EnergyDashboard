"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScenarioAnalysisComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("../../enums");
var solar_panel_service_1 = require("../../services/solar-panel.service");
var dynamic_table_component_1 = require("../../components/dynamic-table-component/dynamic-table-component");
var ScenarioAnalysisComponent = /** @class */ (function () {
    function ScenarioAnalysisComponent() {
        var _this = this;
        this.solarPanelService = core_1.inject(solar_panel_service_1.SolarPanelService);
        this.viewMode = core_1.signal(enums_1.ViewMode.TABLE);
        this.offerUnits = core_1.computed(function () {
            return _this.solarPanelService.offerUnitData();
        });
        core_1.effect(function () {
            _this.solarPanelService.selectedCountry();
            _this.solarPanelService.loadOfferUnitsData();
        });
    }
    //showTable()
    ScenarioAnalysisComponent.prototype.showTable = function () {
        this.viewMode.set(enums_1.ViewMode.TABLE);
    };
    //showChart()
    ScenarioAnalysisComponent.prototype.showChart = function () {
        this.viewMode.set(enums_1.ViewMode.CHART);
    };
    ScenarioAnalysisComponent = __decorate([
        core_1.Component({
            selector: 'app-scenario-analysis-component',
            standalone: true,
            imports: [dynamic_table_component_1.DynamicTableComponent],
            templateUrl: './scenario-analysis-component.html',
            styleUrl: './scenario-analysis-component.scss'
        })
    ], ScenarioAnalysisComponent);
    return ScenarioAnalysisComponent;
}());
exports.ScenarioAnalysisComponent = ScenarioAnalysisComponent;
