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
var express = require('express');
var PORT = process.env.PORT || 5000;
var puppeteer = require('puppeteer');
var processargv_1 = require("./processargv");
console.log("--help to show help");
processargv_1.cmdlineHelp();
var destination = processargv_1.cmdlineOptions();
function extractList(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluate(function (data) {
                        var titles = document.querySelectorAll(".menu-list__title");
                        var obj = { foods: [] };
                        Array.from(titles).forEach(function (title) {
                            var lis = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                                .map(function (li) {
                                var findtitle = li.querySelector(".item_title") || li.querySelector(".menu-list__item-title");
                                return {
                                    "title": findtitle.innerHTML,
                                    "description": li.querySelector(".desc__content").innerHTML,
                                    "price": li.querySelector(".menu-list__item-price").innerHTML
                                };
                            });
                            obj.foods.push({ title: title.innerHTML, content: lis });
                        });
                        return [obj];
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, list, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 9]);
                    return [4 /*yield*/, puppeteer.launch({
                            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                        })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.setRequestInterception(true)];
                case 3:
                    _a.sent();
                    page.on('request', function (req) {
                        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                            req.abort();
                        }
                        else {
                            req["continue"]();
                        }
                    });
                    return [4 /*yield*/, page.goto(destination)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, extractList(page)];
                case 5:
                    list = _a.sent();
                    ;
                    return [3 /*break*/, 9];
                case 6:
                    err_1 = _a.sent();
                    if (!browser) return [3 /*break*/, 8];
                    return [4 /*yield*/, browser.close()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: throw "parsing failed";
                case 9: 
                // should I close the browser???
                return [4 /*yield*/, browser.close()];
                case 10:
                    // should I close the browser???
                    _a.sent();
                    return [2 /*return*/, list];
            }
        });
    });
}
;
function decode(s) {
    return decodeURIComponent(s.toUpperCase().trim());
}
express()
    .get('/foods', function get(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var list, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res.writeHead(200, {
                        "Content-Type": "application/json; charset=utf-8"
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, run()];
                case 2:
                    list = _a.sent();
                    if (req.query.id) {
                        list = list[0].foods.filter(function (f) { return decode(f.title) == decode(req.query.id); });
                        if (list.length === 0)
                            throw "invalid query parameter";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    res.end(JSON.stringify({ err: err_2 }));
                    return [3 /*break*/, 4];
                case 4:
                    res.end(JSON.stringify(list));
                    return [2 /*return*/];
            }
        });
    });
})
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
