"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandles_1 = require("./app/middlewares/globalErrorHandles");
const routenotFound_1 = require("./app/middlewares/routenotFound");
const routers_1 = require("./app/routers");
const envVars_1 = require("./app/config/envVars");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: envVars_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", routers_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to ride booking api"
    });
});
app.use(globalErrorHandles_1.globalError);
app.use(routenotFound_1.routeNotFound);
exports.default = app;
