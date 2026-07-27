"use strict";
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
exports.__esModule = true;
exports.OfferUnitStore = void 0;
var core_1 = require("@angular/core");
var signals_1 = require("@ngrx/signals");
var solar_panel_service_1 = require("../services/solar-panel.service");
var rxjs_1 = require("rxjs");
;
var initialState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    errorValues: {},
    loading: false,
    error: null
};
exports.OfferUnitStore = signals_1.signalStore({ providedIn: 'root' }, signals_1.withState(initialState), signals_1.withMethods(function (store, solarPanelService) {
    if (solarPanelService === void 0) { solarPanelService = core_1.inject(solar_panel_service_1.SolarPanelService); }
    return ({
        loadOfferUnits: function () { return __awaiter(void 0, void 0, void 0, function () {
            var country_1, response, filteredData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signals_1.patchState(store, {
                            loading: true,
                            error: null,
                            editedValues: {},
                            errorValues: {}
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        country_1 = solarPanelService.selectedCountry();
                        return [4 /*yield*/, rxjs_1.firstValueFrom(solarPanelService.getOfferUnits())];
                    case 2:
                        response = _a.sent();
                        filteredData = response.data.filter(function (ou) { return ou.country === country_1; });
                        signals_1.patchState(store, {
                            tableData: structuredClone(filteredData),
                            originalData: structuredClone(filteredData)
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        signals_1.patchState(store, {
                            error: 'Failed to load offer units'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        signals_1.patchState(store, {
                            loading: false
                        });
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); },
        updateCell: function (offerUnitId, quarterNumber, field, value) {
            signals_1.patchState(store, {
                error: null
            });
            try {
                var updatedTableData = structuredClone(store.tableData());
                var offerUnit = updatedTableData.find(function (ou) { return ou.id === offerUnitId; });
                var selectedQuarter = offerUnit === null || offerUnit === void 0 ? void 0 : offerUnit.quarters.find(function (q) { return q.quarter === quarterNumber; });
                if (selectedQuarter) {
                    selectedQuarter[field] = Number(value);
                }
                signals_1.patchState(store, {
                    tableData: updatedTableData
                });
                this.updateEditedValues(offerUnitId, quarterNumber, field, Number(value));
                this.updateErrorValues(offerUnitId, quarterNumber, field, value);
            }
            catch (error) {
                signals_1.patchState(store, {
                    error: 'Failed to update cell'
                });
            }
        },
        updateEditedValues: function (offerUnitId, quarterNumber, field, value) {
            signals_1.patchState(store, {
                error: null
            });
            try {
                var id = offerUnitId + '-' + quarterNumber + '-' + field;
                var editedValuesCopy = structuredClone(store.editedValues());
                var originalData = store.originalData();
                var originalOfferUnit = originalData.find(function (ou) { return ou.id === offerUnitId; });
                var originalQuarter = originalOfferUnit === null || originalOfferUnit === void 0 ? void 0 : originalOfferUnit.quarters.find(function (q) { return q.quarter === quarterNumber; });
                if (originalQuarter) {
                    if (originalQuarter[field] === value) {
                        delete editedValuesCopy[id],
                            signals_1.patchState(store, {
                                editedValues: editedValuesCopy
                            });
                    }
                    else {
                        editedValuesCopy[id] = value;
                        signals_1.patchState(store, {
                            editedValues: editedValuesCopy
                        });
                    }
                }
            }
            catch (error) {
                signals_1.patchState(store, {
                    error: 'Failed to update editedValues'
                });
            }
        },
        isCellEdited: function (offerUnitId, quarterNumber, field) {
            var id = offerUnitId + '-' + quarterNumber + '-' + field;
            return id in store.editedValues();
        },
        clearChanges: function () {
            signals_1.patchState(store, {
                error: null
            });
            try {
                signals_1.patchState(store, {
                    tableData: structuredClone(store.originalData()),
                    editedValues: {},
                    errorValues: {},
                    error: null,
                    loading: false
                });
            }
            catch (error) {
                signals_1.patchState(store, {
                    error: 'Failed to clear changes'
                });
            }
        },
        updateErrorValues: function (offerUnitId, quarterNumber, field, value) {
            signals_1.patchState(store, {
                error: null
            });
            var id = offerUnitId + '-' + quarterNumber + '-' + field;
            var updatedErrorValues = structuredClone(store.errorValues());
            if (this.getError(value)) {
                updatedErrorValues[id] = 'The value on ' + id + ' has: ' + this.getError(value);
                signals_1.patchState(store, {
                    errorValues: updatedErrorValues
                });
            }
            else {
                if (updatedErrorValues[id]) {
                    delete updatedErrorValues[id];
                    signals_1.patchState(store, {
                        errorValues: updatedErrorValues
                    });
                }
            }
        },
        getError: function (value) {
            if (value > 99999.99) {
                return "6 or more characters";
            }
            return false;
        }
    });
}), signals_1.withComputed(function (store) { return ({
    modifiedCellsCount: core_1.computed(function () {
        return Object.keys(store.editedValues()).length;
    }),
    getErrorMessages: core_1.computed(function () {
        return Object.values(store.errorValues());
    })
}); }));
