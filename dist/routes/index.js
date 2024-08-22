"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitingRoom_1 = __importDefault(require("../routes/waitingRoom"));
const chat_1 = __importDefault(require("../routes/chat"));
const router = (0, express_1.Router)();
router.use(waitingRoom_1.default);
router.use(chat_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map