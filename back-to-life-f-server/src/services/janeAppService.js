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
exports.getPractitioners = void 0;
const axios_1 = __importDefault(require("axios"));
const JANE_API_BASE_URL = "https://your-janeapp-api-url.com"; // Replace with actual JaneApp API base URL
const JANE_API_KEY = process.env.JANE_API_KEY; // Store your JaneApp API key in .env
const janeApi = axios_1.default.create({
    baseURL: JANE_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${JANE_API_KEY}`,
        "Content-Type": "application/json",
    },
});
// Example: Fetch practitioners
const getPractitioners = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield janeApi.get("/practitioners");
    return response.data;
});
exports.getPractitioners = getPractitioners;
// Add more endpoint functions as needed
