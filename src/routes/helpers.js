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
exports.setupApiRoute = exports.setupAdminPageRoute = exports.setupPageRoute = exports.tryRoute = void 0;
const winston_1 = __importDefault(require("winston"));
const middleware_1 = __importDefault(require("../middleware"));
const helpers_1 = __importDefault(require("../controllers/helpers"));
// The next line calls controller and handler that has not been updated to TS yet
// eslint-disable-next-line
function tryRoute(controller, handler) {
    // `handler` is optional
    // The next line calls controller has not been updated to TS yet
    // eslint-disable-next-line
    if (controller && controller.constructor && controller.constructor.name === 'AsyncFunction') {
        // The next line calls next that has not been updated to TS yet
        // eslint-disable-next-line
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // The next line calls controller and handler that has not been updated to TS yet
                    // eslint-disable-next-line
                    yield controller(req, res, next);
                }
                catch (err) {
                    // The next line calls handler that has not been updated to TS yet
                    // eslint-disable-next-line
                    if (handler) {
                        // The next line calls handler that has not been updated to TS yet
                        // eslint-disable-next-line
                        return handler(err, res);
                    }
                    // The next line calls next that has not been updated to TS yet
                    // eslint-disable-next-line
                    next(err);
                }
            });
        };
    }
    // The next line calls controller that has not been updated to TS yet
    // eslint-disable-next-line
    return controller;
}
exports.tryRoute = tryRoute;
// router, name, middleware(deprecated), middlewares(optional), controller
// The next line calls middleware, middlewares and controller that has not been updated to TS yet
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
function setupPageRoute(router, name, middleware, middlewares, controller) {
    // The next line calls  middlewares that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (middlewares) {
        winston_1.default.warn(`[helpers.setupPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    }
    // The next lines calls  middlewares that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    middlewares = [middleware.authenticateRequest, middleware.maintenanceMode,
        // eslint-disable-next-line
        middleware.registrationComplete, middleware.pluginHooks, middlewares, middleware.pageView];
    // The next line calls  middlewares and middleware that has not been updated to TS yet
    // eslint-disable-next-line
    router.get(name, middleware.busyCheck, middlewares, middleware.buildHeader, tryRoute(controller));
    // The next line calls  middlewares and controller that has not been updated to TS yet
    // eslint-disable-next-line
    router.get(`/api${name}`, middlewares, tryRoute(controller));
}
exports.setupPageRoute = setupPageRoute;
// router, name, middleware(deprecated), middlewares(optional), controller
function setupAdminPageRoute(router, name, middleware, middlewares, controller) {
    // The next line calls  middlewares and controller that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (middlewares) {
        winston_1.default.warn(`[helpers.setupPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    }
    // The next line calls middlewares and middleware that has not been updated to TS yet
    // eslint-disable-next-line
    router.get(name, middleware.admin.buildHeader, middlewares, tryRoute(controller));
    // The next line calls  middlewares that has not been updated to TS yet
    // eslint-disable-next-line
    router.get(`/api${name}`, middlewares, tryRoute(controller));
}
exports.setupAdminPageRoute = setupAdminPageRoute;
// router, verb, name, middlewares(optional), controller
// The next line calls  middlewares and controller that has not been updated to TS yet
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
function setupApiRoute(router, verb, name, middlewares, controller) {
    // The next line calls  middleware that has not been updated to TS yet
    // eslint-disable-next-line
    middlewares = [middleware_1.default.authenticateRequest, middleware_1.default.maintenanceMode,
        // The next line calls  middlewares that has not been updated to TS yet
        // eslint-disable-next-line
        middleware_1.default.registrationComplete, middleware_1.default.pluginHooks, middlewares];
    // The next line calls  middlewares, controller that has not been updated to TS yet
    // eslint-disable-next-line
    router[verb](name, middlewares, tryRoute(controller, (err, res) => {
        helpers_1.default.formatApiResponse(400, res, err);
    }));
}
exports.setupApiRoute = setupApiRoute;
