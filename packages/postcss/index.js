const tinycolor = require("tinycolor2");

const transforms = require("./transforms/common");
const { extractSpecs, noop } = require("./utils");
const { getType, types } = require("../css-types");

module.exports = (options) => {
  const {
    onFinished = noop,
    onInvalid = noop,
    onValid = noop,
    specs,
  } = options;

  // find way to generalize this
  const colorSpecs = extractSpecs(specs, "Color");
  const fontSizeSpecs = extractSpecs(specs, "SizeFont");

  return {
    postcssPlugin: "postcss-scorecard",
    Once(root) {
      root.walkDecls((declaration) => {
        const { prop, value } = declaration;

        const type = getType(prop);

        const color = tinycolor(value);
        const isOfficialColor = Object.values(colorSpecs).includes(
          color.toHexString()
        );
        if (type === types.COLOR && !isOfficialColor) {
          const nearestColor = tinycolor(
            transforms.color({ colorSpecs, color })
          ).toHexString();

          onInvalid({
            type,
            prop,
            value: color.toHexString(),
            nearestValue: nearestColor,
            context: declaration,
          });

          return null;
        }

        const isOfficialFontSize = Object.values(fontSizeSpecs).includes(value);
        if ((type === types.FONT_SIZE && !isOfficialFontSize)) {
          const nearestFontSize = transforms.fontSize({
            fontSizeSpecs,
            value,
          });

          onInvalid({
            type,
            prop,
            value,
            nearestValue: nearestFontSize,
            context: declaration,
          });

          return null;
        }

        onValid({
          type,
          prop,
          value,
          context: declaration,
        });
      });

      onFinished();
    },
  };
};

module.exports.postcss = true;
