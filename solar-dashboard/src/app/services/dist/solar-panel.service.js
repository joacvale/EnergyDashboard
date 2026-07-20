"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.SolarPanelService = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_2 = require("@angular/common/http");
var authentication_service_1 = require("./authentication.service");
var SolarPanelService = /** @class */ (function () {
    function SolarPanelService() {
        var _this = this;
        this.http = core_1.inject(http_1.HttpClient);
        this.apiUrl = 'http://localhost:3000/api';
        //four signals for state management
        this.panels = core_1.signal([]); //list of solar panels - default empty array
        this.productionData = core_1.signal([]); //list of production data - default empty array
        this.energyPriceData = core_1.signal([]); //list of energy price data - default empty array~
        this.countryData = core_1.signal([]);
        this.selectedCountry = core_1.signal('');
        this.authenticationService = core_1.inject(authentication_service_1.AuthenticationService);
        this.loading = core_1.signal(false); //loading state - default false
        this.error = core_1.signal(null); //error state - default null
        //two computed properties
        this.getTotalProduction = core_1.computed(function () {
            return _this.panels().reduce(function (total, panel) { return total + panel.todayProduction; }, 0);
        });
        this.getActivePanelsCount = core_1.computed(function () {
            return _this.panels().filter(function (panel) { return panel.status === 'Active'; }).length;
        });
        this.loadPanels();
        this.loadProductionData();
        this.loadEnergyPriceData();
        this.loadCountryData();
    }
    //get all panels
    SolarPanelService.prototype.loadPanels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var country_1, params, response, filteredData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        country_1 = this.selectedCountry();
                        params = new http_1.HttpParams();
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.get(this.apiUrl + "/panels", { params: params }))];
                    case 2:
                        response = _a.sent();
                        filteredData = response.data.filter(function (panels) { return panels.country === country_1; });
                        this.panels.set(filteredData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_1.status + " " + error_1.message);
                        }
                        else if (error_1 instanceof Error) {
                            this.error.set("Error: " + error_1.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //get all production data
    SolarPanelService.prototype.loadProductionData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var country_2, response, filteredData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        country_2 = this.selectedCountry();
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.get(this.apiUrl + "/production"))];
                    case 2:
                        response = _a.sent();
                        filteredData = response.data.filter(function (productionData) { return productionData.country === country_2; });
                        this.productionData.set(filteredData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_2.status + " " + error_2.message);
                        }
                        else if (error_2 instanceof Error) {
                            this.error.set("Error: " + error_2.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //get all energy price
    SolarPanelService.prototype.loadEnergyPriceData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var country_3, response, filteredData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        country_3 = this.selectedCountry();
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.get(this.apiUrl + "/energy-prices"))];
                    case 2:
                        response = _a.sent();
                        filteredData = response.data.filter(function (energyPrice) { return energyPrice.country === country_3; });
                        this.energyPriceData.set(filteredData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_3.status + " " + error_3.message);
                        }
                        else if (error_3 instanceof Error) {
                            this.error.set("Error: " + error_3.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //get all countries
    SolarPanelService.prototype.loadCountryData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.get(this.apiUrl + "/countries"))];
                    case 2:
                        response = _a.sent();
                        this.countryData.set(response.data);
                        return [3 /*break*/, 5];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_4.status + " " + error_4.message);
                        }
                        else if (error_4 instanceof Error) {
                            this.error.set("Error: " + error_4.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //add panel
    SolarPanelService.prototype.addPanel = function (panel) {
        return __awaiter(this, void 0, void 0, function () {
            var newPanel_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.post(this.apiUrl + "/panels", panel))];
                    case 2:
                        newPanel_1 = _a.sent();
                        this.panels.update(function (panels) { return __spreadArrays(panels, [
                            newPanel_1
                        ]); });
                        return [4 /*yield*/, this.loadPanels()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_5 = _a.sent();
                        if (error_5 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_5.status + " " + error_5.message);
                        }
                        else if (error_5 instanceof Error) {
                            this.error.set("Error: " + error_5.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //update panel
    SolarPanelService.prototype.updatePanel = function (panel) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedPanel_1, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http.put(this.apiUrl + "/panels/" + panel.id, panel))];
                    case 2:
                        updatedPanel_1 = _a.sent();
                        this.panels.update(function (panels) { return panels.map(function (p) { return p.id === panel.id ? updatedPanel_1 : p; }); });
                        return [4 /*yield*/, this.loadPanels()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_6 = _a.sent();
                        if (error_6 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_6.status + " " + error_6.message);
                        }
                        else if (error_6 instanceof Error) {
                            this.error.set("Error: " + error_6.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //delete panel
    SolarPanelService.prototype.deletePanel = function (panelId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error.set(null);
                        this.loading.set(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.http["delete"](this.apiUrl + "/panels/" + panelId))];
                    case 2:
                        _a.sent();
                        this.panels.update(function (panels) { return panels.filter(function (p) { return p.id !== panelId; }); });
                        return [4 /*yield*/, this.loadPanels()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_7 = _a.sent();
                        if (error_7 instanceof http_2.HttpErrorResponse) {
                            this.error.set("Server error: " + error_7.status + " " + error_7.message);
                        }
                        else if (error_7 instanceof Error) {
                            this.error.set("Error: " + error_7.message);
                        }
                        else {
                            this.error.set('Unknown error occurred');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.loading.set(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SolarPanelService.prototype.setCountry = function (countryId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.selectedCountry.set(countryId);
                this.loadPanels();
                this.loadProductionData();
                this.loadEnergyPriceData();
                this.loadCountryData();
                return [2 /*return*/];
            });
        });
    };
    SolarPanelService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], SolarPanelService);
    return SolarPanelService;
}());
exports.SolarPanelService = SolarPanelService;
