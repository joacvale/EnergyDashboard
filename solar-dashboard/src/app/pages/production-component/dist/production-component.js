"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductionComponent = void 0;
var table_1 = require("@angular/material/table");
var button_1 = require("@angular/material/button");
var icon_1 = require("@angular/material/icon");
var chips_1 = require("@angular/material/chips");
var card_1 = require("@angular/material/card");
var dialog_1 = require("@angular/material/dialog");
var solar_panel_service_1 = require("../../services/solar-panel.service");
var panel_dialog_component_1 = require("../../components/panel-dialog-component/panel-dialog-component");
var ng2_charts_1 = require("ng2-charts");
var core_1 = require("@angular/core");
var page_state_component_1 = require("../../components/page-state-component/page-state-component");
var paginator_1 = require("@angular/material/paginator");
var table_2 = require("@angular/material/table");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var snack_bar_1 = require("@angular/material/snack-bar");
var snack_bar_2 = require("@angular/material/snack-bar");
var enums_1 = require("../../enums");
var ProductionComponent = /** @class */ (function () {
    function ProductionComponent() {
        var _this = this;
        this.solarPanelService = core_1.inject(solar_panel_service_1.SolarPanelService);
        this.dialog = core_1.inject(dialog_1.MatDialog);
        this.viewMode = core_1.signal(enums_1.ViewMode.TABLE);
        this.filter = "";
        this.dataSource = new table_2.MatTableDataSource();
        this.snackBar = core_1.inject(snack_bar_1.MatSnackBar);
        this.totalToday = core_1.computed(function () {
            return _this.solarPanelService
                .productionData()
                .reduce(function (total, item) { return total + item.production; }, 0);
        });
        this.peakHour = core_1.computed(function () {
            var data = _this.solarPanelService.productionData();
            if (!data.length) {
                return '-';
            }
            var peak = data.reduce(function (max, current) {
                return current.production > max.production
                    ? current
                    : max;
            });
            return "H" + peak.hour;
        });
        this.priceLineData = core_1.computed(function () {
            return _this.solarPanelService.energyPriceData().map(function (item) { return item.price; });
        });
        this.barChartData = core_1.computed(function () {
            var productionData = _this.solarPanelService.productionData();
            var energyPrices = _this.solarPanelService.energyPriceData();
            var priceData = productionData.map(function (hour) {
                var energyPrice = energyPrices.find(function (price) { return price.hour === hour.hour; });
                return energyPrice ? energyPrice.price : null;
            });
            return {
                labels: productionData.map(function (item) { return "H" + item.hour; }),
                datasets: [
                    {
                        label: 'Production',
                        data: productionData.map(function (item) {
                            return item.type === 'production' ? item.production : null;
                        }),
                        backgroundColor: 'rgba(39, 174, 96, 0.8)'
                    },
                    {
                        label: 'Limited',
                        data: productionData.map(function (item) {
                            return item.type === 'limited' ? item.production : null;
                        }),
                        backgroundColor: 'rgba(155, 89, 182, 0.8)'
                    },
                    {
                        label: 'Idle',
                        data: productionData.map(function (item) {
                            return item.type === 'idle' ? item.production : null;
                        }),
                        backgroundColor: 'rgba(52, 152, 219, 0.8)'
                    },
                    {
                        type: 'line',
                        label: 'Energy Price',
                        data: priceData,
                        borderColor: '#000000',
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        pointRadius: 1.5,
                        tension: 0.1,
                        yAxisID: 'yPrice',
                        spanGaps: true,
                        segment: {
                            borderDash: function (ctx) {
                                return ctx.p0.skip || ctx.p1.skip //if previous point or next point is null - skip. if skip 6px draw, 6 px space. else normal line
                                    ? [6, 6]
                                    : [];
                            }
                        }
                    }
                ]
            };
        });
        this.barChartType = 'bar';
        this.barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var _a;
                            var productionItem = _this.solarPanelService.productionData()[context.dataIndex];
                            var priceItem = (_a = _this.solarPanelService.energyPriceData().find(function (p) { return p.hour === productionItem.hour; })) === null || _a === void 0 ? void 0 : _a.price;
                            return productionItem.type + ": " + productionItem.production + " MW : " + priceItem + " $ pMWH";
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 25,
                    title: {
                        display: true,
                        text: 'MW'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                yPrice: {
                    position: 'right',
                    min: 0,
                    max: 40,
                    title: {
                        display: true,
                        text: '€ / MWH'
                    }
                }
            }
        };
        this.columnsToDisplay = [
            'id',
            'location',
            'capacity',
            'todayProduction',
            'status',
            'actions'
        ];
        core_1.effect(function () {
            _this.dataSource.data = _this.solarPanelService.panels();
        });
    }
    ProductionComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.paginator = this.paginator;
    };
    ProductionComponent.prototype.showTable = function () {
        this.viewMode.set(enums_1.ViewMode.TABLE);
    };
    ProductionComponent.prototype.showChart = function () {
        this.viewMode.set(enums_1.ViewMode.CHART);
    };
    ProductionComponent.prototype.deletePanel = function (panel) {
        var _this = this;
        var dialogRef = this.dialog.open(panel_dialog_component_1.PanelDialogComponent, {
            width: '500px',
            data: {
                mode: enums_1.DialogMode.DELETE,
                panel: panel
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.snackBar.open('Painel apagado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
            }
        });
    };
    ProductionComponent.prototype.addPanel = function () {
        var _this = this;
        var dialogRef = this.dialog.open(panel_dialog_component_1.PanelDialogComponent, {
            width: '500px',
            data: {
                mode: enums_1.DialogMode.ADD
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.snackBar.open('Painel criado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
            }
        });
    };
    ProductionComponent.prototype.updatePanel = function (panel) {
        var _this = this;
        var dialogRef = this.dialog.open(panel_dialog_component_1.PanelDialogComponent, {
            width: '500px',
            data: {
                mode: enums_1.DialogMode.EDIT,
                panel: panel
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.snackBar.open('Painel atualizado com sucesso', 'Fechar', { duration: 3000, verticalPosition: 'top' });
            }
        });
    };
    ProductionComponent.prototype.filteredSolarPanels = function (location) {
        var panels = this.solarPanelService.panels();
        var filteredPanels = panels.filter(function (panel) { return panel.location.toLowerCase().includes(location.toLowerCase()); });
        this.dataSource.data = filteredPanels;
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], ProductionComponent.prototype, "paginator");
    ProductionComponent = __decorate([
        core_1.Component({
            selector: 'app-production-component',
            standalone: true,
            imports: [form_field_1.MatFormFieldModule, input_1.MatInputModule, button_1.MatButtonModule, card_1.MatCardModule, table_1.MatTableModule, paginator_1.MatPaginatorModule, icon_1.MatIconModule, chips_1.MatChipsModule, dialog_1.MatDialogModule, ng2_charts_1.BaseChartDirective, page_state_component_1.PageStateComponent, snack_bar_2.MatSnackBarModule],
            templateUrl: './production-component.html',
            styleUrl: './production-component.scss',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], ProductionComponent);
    return ProductionComponent;
}());
exports.ProductionComponent = ProductionComponent;
