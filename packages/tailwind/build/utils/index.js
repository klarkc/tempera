"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTokens = validateTokens;

function validateTokens(tokens) {
  return !!tokens && typeof tokens === "object" && Object.entries(tokens).every(([_, value]) => typeof value !== "object");
}
//# sourceMappingURL=index.js.map