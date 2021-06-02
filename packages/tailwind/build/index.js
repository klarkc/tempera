"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;

var _lodash = _interopRequireDefault(require("lodash.camelcase"));

var _lodash2 = _interopRequireDefault(require("lodash.kebabcase"));

var _lodash3 = _interopRequireDefault(require("lodash.merge"));

var _lodash4 = _interopRequireDefault(require("lodash.mergewith"));

var matchers = _interopRequireWildcard(require("./matchers"));

var _utils = require("./utils");

var _defaultTailwindConfig = _interopRequireDefault(require("./stubs/default-tailwind-config"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(tokens, {
  extend = false,
  mustMatch = true
} = {}) {
  if (!(0, _utils.validateTokens)(tokens)) {
    throw new Error("Tokens are not in a valid format. A flat set of key-value modules is expected.");
  }

  let result = {};
  Object.entries(tokens).forEach(([tokenKey, tokenValue]) => {
    if ((0, _lodash2.default)(tokenKey).includes("component")) {
      return null;
    }

    if ((0, _lodash2.default)(tokenKey).includes("line-height")) {
      return null;
    }

    const matchingEntry = Object.entries(matchers).find(([_, matcher]) => {
      const match = (0, _lodash2.default)(tokenKey).match(matcher);
      return match && match.length;
    });

    if (mustMatch && !matchingEntry) {
      throw new Error("Unmatched token detected, if you want to skip this error you can set mustMatch option to false");
    }

    if (!matchingEntry) {
      return null;
    }

    const [matcherKey, matcherValue] = matchingEntry;

    if (!matcherKey) {
      return null;
    }

    const configKey = (0, _lodash.default)(matcherKey);
    const matchBeginningHyphen = /^-(?=\w)/gm;
    const matchEndingHyphen = /-(?!\w)/gm;
    const className = (0, _lodash2.default)(tokenKey).replace(matcherValue, "").replace(matchEndingHyphen, "").replace(matchBeginningHyphen, "");
    let setting;

    if (configKey === "fontSize") {
      const fontSizeIndex = Object.entries(tokens).filter(([key]) => (0, _lodash.default)(key).includes("fontSize")).findIndex(([_, value]) => {
        return value === tokenValue;
      });

      try {
        const lineHeight = Object.entries(tokens).filter(([key]) => (0, _lodash.default)(key).includes("lineHeight"))[fontSizeIndex][1];
        setting = [tokenValue, {
          lineHeight
        }];
      } catch (exception) {
        throw new Error("Could not find matching line height for font size. Did you include your line height tokens?");
      }
    } else if (configKey === "fontFamily") {
      setting = tokenValue.split(",").map(x => x.trimStart());
    } else {
      setting = tokenValue;
    }

    result = { ...result,
      [configKey]: { ...result[configKey],
        [className]: setting
      }
    };
  });
  const newConfig = {
    theme: result
  };

  if (extend) {
    return (0, _lodash3.default)(_defaultTailwindConfig.default, newConfig);
  }

  function customizer(defaultConfigValue, newConfigValue) {
    if (typeof defaultConfigValue === "object") {
      return newConfigValue;
    }
  }

  return (0, _lodash4.default)(_defaultTailwindConfig.default, newConfig, customizer);
}
//# sourceMappingURL=index.js.map