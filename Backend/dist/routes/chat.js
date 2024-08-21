"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("../controllers/chat");
const router = (0, express_1.Router)();
/* router.get('/', getMessages); */
router.post('/createUser', chat_1.createUser);
exports.default = router;
//# sourceMappingURL=chat.js.map