"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.HTTPError = HTTPError;
class NotFoundError extends HTTPError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
