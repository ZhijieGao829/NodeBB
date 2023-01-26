
import { Router, Request , Response } from 'express';
import winston from 'winston';
import middleware from '../middleware';
import controllerHelpers from '../controllers/helpers';


// router, name, middleware(deprecated), middlewares(optional), controller

// The next line calls middleware, middlewares and controller that has not been updated to TS yet
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
export function setupPageRoute(router:Router, name:string, middleware, middlewares, controller){

    // The next line calls  middlewares that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if(middlewares){
        winston.warn(`[helpers.setupPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    }

    // The next line calls  middlewares that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    middlewares = [
        middleware.authenticateRequest,
        middleware.maintenanceMode,
        middleware.registrationComplete,
        middleware.pluginHooks,
        ...middlewares,
        middleware.pageView,
    ];

    // The next line calls  middlewares and middleware that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    router.get(
        name,
        middleware.busyCheck,
        middlewares,
        middleware.buildHeader,
        tryRoute(controller)
    );

    // The next line calls  middlewares and controller that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    router.get(`/api${name}`, middlewares, tryRoute(controller));
};

// router, name, middleware(deprecated), middlewares(optional), controller
export function setupAdminPageRoute(router:Router, name:string, middleware, middlewares, controller) {
    
    // The next line calls  middlewares and controller that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if(middlewares){
        winston.warn(`[helpers.setupPageRoute(${name})] passing \`middleware\` as the third param is deprecated, it can now be safely removed`);
    }
    router.get(name, middleware.admin.buildHeader, middlewares, tryRoute(controller));
    router.get(`/api${name}`, middlewares, tryRoute(controller));
};

// router, verb, name, middlewares(optional), controller
export function setupApiRoute(...args) {
    const [router, verb, name] = args;
    let middlewares = args.length > 4 ? args[args.length - 2] : [];
    const controller = args[args.length - 1];

    middlewares = [
        middleware.authenticateRequest,
        middleware.maintenanceMode,
        middleware.registrationComplete,
        middleware.pluginHooks,
        ...middlewares,
    ];

    router[verb](name, middlewares, tryRoute(controller, (err, res) => {
        controllerHelpers.formatApiResponse(400, res, err);
    }));
};

export function tryRoute(controller:Controller, handler?:boolean) {
    // `handler` is optional
    if (controller && controller.constructor && controller.constructor.name === 'AsyncFunction') {
        return async function (req:Request, res:Response, next) {
            try {
                await controller(req, res, next);
            } catch (err:unknown) {
                if (handler) {
                    return handler(err, res);
                }

                next(err);
            }
        };
    }
    return controller;
};
