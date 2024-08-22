"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitingRoom_1 = require("../controllers/waitingRoom");
const router = (0, express_1.Router)();
router.get('/listUsers', waitingRoom_1.waitingRoom);
exports.default = router;
//# sourceMappingURL=waitingRoom.js.map