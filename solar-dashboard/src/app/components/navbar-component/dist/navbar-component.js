"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavbarComponent = void 0;
var core_1 = require("@angular/core");
var toolbar_1 = require("@angular/material/toolbar");
var icon_1 = require("@angular/material/icon");
var button_1 = require("@angular/material/button");
var select_1 = require("@angular/material/select");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var core_2 = require("@angular/core");
var sidenav_1 = require("@angular/material/sidenav");
var core_3 = require("@angular/core");
var solar_panel_service_1 = require("../../services/solar-panel.service");
var core_4 = require("@angular/core");
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent() {
        this.solarPanelService = core_4.inject(solar_panel_service_1.SolarPanelService);
        this.menuClick = core_3.output();
        this.title = 'Solar Energy Dashboard';
        this.icon = 'light_mode';
        this.isLogged = false;
    }
    NavbarComponent.prototype.login = function () {
        this.isLogged = true;
    };
    NavbarComponent.prototype.logout = function () {
        this.isLogged = false;
    };
    NavbarComponent.prototype.openSidepanel = function () {
        this.menuClick.emit();
    };
    Object.defineProperty(NavbarComponent.prototype, "selectedCountry", {
        get: function () {
            return this.solarPanelService.selectedCountry();
        },
        enumerable: false,
        configurable: true
    });
    NavbarComponent.prototype.updateCountry = function (country) {
        this.solarPanelService.selectedCountry.set(country);
    };
    NavbarComponent = __decorate([
        core_1.Component({
            selector: 'app-navbar',
            standalone: true,
            imports: [toolbar_1.MatToolbarModule, icon_1.MatIconModule, button_1.MatButtonModule, select_1.MatSelectModule, forms_1.FormsModule, router_1.RouterLink, sidenav_1.MatSidenavModule],
            templateUrl: './navbar-component.html',
            styleUrl: './navbar-component.scss',
            changeDetection: core_2.ChangeDetectionStrategy.OnPush
        })
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
