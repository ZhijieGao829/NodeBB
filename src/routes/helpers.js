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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryRoute = exports.setupApiRoute = exports.setupAdminPageRoute = exports.setupPageRoute = void 0;
const winston_1 = __importDefault(require("winston"));
const middleware_1 = __importDefault(require("../middleware"));
const helpers_1 = __importDefault(require("../controllers/helpers"));
// router, name, middleware(deprecated), middlewares(optional), controller
function setupPageRoute(router, name, middleware, middlewares, controller) {
    //if (args.length === 5) {
    //    winston.warn(`[helpers.setupPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    //}
    middlewares = [
        middleware.authenticateRequest,
        middleware.maintenanceMode,
        middleware.registrationComplete,
        middleware.pluginHooks,
        ...middlewares,
        middleware.pageView,
    ];
    router.get(name, middleware.busyCheck, middlewares, middleware.buildHeader, tryRoute(controller));
    router.get(`/api${name}`, middlewares, tryRoute(controller));
}
exports.setupPageRoute = setupPageRoute;
;
// router, name, middleware(deprecated), middlewares(optional), controller
function setupAdminPageRoute(...args) {
    const [router, name] = args;
    const middlewares = args.length > 3 ? args[args.length - 2] : [];
    const controller = args[args.length - 1];
    if (args.length === 5) {
        winston_1.default.warn(`[helpers.setupAdminPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    }
    router.get(name, middleware_1.default.admin.buildHeader, middlewares, tryRoute(controller));
    router.get(`/api${name}`, middlewares, tryRoute(controller));
}
exports.setupAdminPageRoute = setupAdminPageRoute;
;
// router, verb, name, middlewares(optional), controller
function setupApiRoute(...args) {
    const [router, verb, name] = args;
    let middlewares = args.length > 4 ? args[args.length - 2] : [];
    const controller = args[args.length - 1];
    middlewares = [
        middleware_1.default.authenticateRequest,
        middleware_1.default.maintenanceMode,
        middleware_1.default.registrationComplete,
        middleware_1.default.pluginHooks,
        ...middlewares,
    ];
    router[verb](name, middlewares, tryRoute(controller, (err, res) => {
        helpers_1.default.formatApiResponse(400, res, err);
    }));
}
exports.setupApiRoute = setupApiRoute;
;
function tryRoute(controller, handler) {
    // `handler` is optional
    if (controller && controller.constructor && controller.constructor.name === 'AsyncFunction') {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield controller(req, res, next);
                }
                catch (err) {
                    if (handler) {
                        return handler(err, res);
                    }
                    next(err);
                }
            });
        };
    }
    return controller;
}
exports.tryRoute = tryRoute;
;
