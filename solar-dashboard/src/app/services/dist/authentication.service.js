"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthenticationService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var core_2 = require("@angular/core");
var users = [
    { id: 1, firstName: 'Manoj', lastName: 'Kumar', username: 'manoj', password: 'manoj', countries: ['ES'] },
    { id: 2, firstName: 'Joao', lastName: 'Valentim', username: 'joaov', password: 'joaov', countries: [] }
];
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService() {
        this.cookieService = core_1.inject(ngx_cookie_service_1.CookieService);
        this.authenticated = core_2.signal(false);
        this.currentUser = core_2.signal(null);
        this.authenticated.set(this.isAuthenticated());
        var user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser.set(JSON.parse(user));
        }
    }
    AuthenticationService.prototype.login = function (body) {
        var _this = this;
        return this.authenticate(body).pipe(operators_1.map(function (user) {
            var userData = user.body;
            _this.cookieService.set('token', 'loggedin', new Date(new Date().setFullYear(new Date().getFullYear() + 1)), '/');
            localStorage.setItem('currentUser', JSON.stringify(userData));
            _this.currentUser.set(userData);
            _this.authenticated.set(true);
            return user;
        }));
    };
    AuthenticationService.prototype.authenticate = function (body) {
        var username = body.username, password = body.password;
        var user = users.find(function (x) { return x.username === username && x.password === password; });
        if (!user) {
            return this.error('Username or password is incorrect');
        }
        return this.success({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            countries: user.countries
        });
    };
    // success code and body
    AuthenticationService.prototype.success = function (body) {
        return rxjs_1.of(new http_1.HttpResponse({ status: 200, body: body }));
    };
    // for error handling
    AuthenticationService.prototype.error = function (error) {
        return rxjs_1.throwError({ error: { error: error } });
    };
    // clear cookie during logout
    AuthenticationService.prototype.logout = function () {
        this.cookieService["delete"]('token');
        localStorage.removeItem('currentUser');
        this.authenticated.set(false);
        this.currentUser.set(null);
        return this.success('Logged out successfully');
    };
    // default login check if cookie is present already
    AuthenticationService.prototype.isAuthenticated = function () {
        var value = this.cookieService.get('token');
        if (value) {
            return true;
        }
        return false;
    };
    AuthenticationService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
