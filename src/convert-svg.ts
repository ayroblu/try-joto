import * as svgson from "svgson";
import { parsePath } from "./parseSvgPath";
// require("util").inspect.defaultOptions.depth = null;

export async function convertSvg(svgText: string) {
  const svg = await svgson.parse(svgText);
  const { transform, width, height } = getTransform(svg);

  svg.attributes.width = width.toString();
  svg.attributes.height = height.toString();
  svg.attributes.viewBox = `0 0 ${width} ${height}`;
  svg.children.forEach((child) => {
    if (child.name === "g") {
      // fill-opacity="0.0001" fill="#ffffff" fill-rule="nonzero" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"
      child.attributes["fill-opacity"] = "0.0001";
      child.attributes["fill"] = "#ffffff";
      child.attributes["fill-rule"] = "nonzero";
      child.attributes["stroke"] = "#000000";
      child.attributes["stroke-width"] = "2";
      child.attributes["stroke-linecap"] = "round";
      child.attributes["stroke-linejoin"] = "round";
      child.attributes["stroke-mitrelimit"] = "10";
      child.attributes["stroke-dasharray"] = "";
      child.attributes["stroke-dashoffset"] = "0";
      child.attributes["font-family"] = "none";
      child.attributes["font-weight"] = "none";
      child.attributes["font-size"] = "none";
      child.attributes["text-anchor"] = "none";
      child.attributes["style"] = "mix-blend-mode: normal";
      child.children.forEach((child) => {
        if (child.name === "path") {
          child.attributes["vector-effect"] = "non-scaling-stroke";
          child.attributes["id"] = "mark";
          delete child.attributes["fill"];
          delete child.attributes["fill-rule"];
          const temp = parsePath(child.attributes.d);
          for (const t of transform) {
            if ("scale" in t) {
              scale(temp, t.scale);
            } else if ("translate" in t) {
              translate(temp, t.translate);
            }
          }
          // temp.reverse();
          temp.forEach(({ values }) => {
            for (let i = 0; i < values.length; ++i) {
              values[i] = precision1dp(values[i]);
            }
          });
          child.attributes.d = temp
            .map(({ command, values }) => `${command}${values.join(" ")}`)
            .join(" ");
        }
      });
    }
  });
  svg.children = svg.children.filter(
    (c) => c.name !== "image" && c.name !== "title" && c.name !== "",
  );
  // svg.children.reverse();
  const resultSvgText = svgson.stringify(svg);
  return resultSvgText;
}

function getTransform(svg: svgson.INode): {
  transform: (
    | {
        scale: number;
      }
    | {
        translate: readonly [number, number];
      }
  )[];
  width: number;
  height: number;
} {
  const { min, max } = getBoundingBox(svg);
  // const viewBox = parseViewbox(svg.attributes.viewBox);
  // const translateViewBox = [-viewBox.minX, -viewBox.minY] as const;
  // const originalWidth = parseFloat(svg.attributes.width);
  // const originalHeight = parseFloat(svg.attributes.height);
  const boxWidth = max.x - min.x;
  const boxHeight = max.y - min.y;
  const width = Math.max(boxWidth, 500);
  const height = Math.max(boxHeight, 500);
  const scaleFactor = Math.min(500 / width, 500 / height, 1);
  const translateBox = [-min.x, -min.y] as const;
  const translateCenter = [
    (500 - width * scaleFactor) / 2,
    (500 - height * scaleFactor) / 2,
  ] as const;
  return {
    transform: [
      { translate: translateBox },
      { scale: scaleFactor },
      { translate: translateCenter },
    ],
    width: 500,
    height: 500,
  };
}
function getBoundingBox(svg: svgson.INode): {
  min: { x: number; y: number };
  max: { x: number; y: number };
} {
  const min = { x: Infinity, y: Infinity };
  const max = { x: -Infinity, y: -Infinity };
  svg.children.forEach((child) => {
    if (child.name === "g") {
      child.children.forEach((child) => {
        if (child.name === "path") {
          const path = parsePath(child.attributes.d);
          for (const {
            values: [x, y],
          } of path) {
            min.x = Math.min(min.x, x);
            min.y = Math.min(min.y, y);
            max.x = Math.max(max.x, x);
            max.y = Math.max(max.y, y);
          }
        }
      });
    }
  });
  return { min, max };
}

const precisionDp =
  (dp: number) =>
  (value: number): number => {
    const multiplier = Math.pow(10, dp);
    return Math.round(value * multiplier) / multiplier;
  };
const precision1dp = precisionDp(1);

// function parseViewbox(viewbox: string | void) {
//   if (viewbox) {
//     const coords = viewbox
//       .split(" ")
//       .map((i) => i.trim())
//       .filter(Boolean)
//       .map((i) => parseFloat(i));
//     if (coords.length !== 4) throw new Error("expected 4 entries!");
//     const [minX, minY, width, height] = coords;
//     return { minX, minY, width, height };
//   }
//   throw new Error("expected viewbox!");
// }

type SvgPathCommand = { command: string; values: [number, number] };

function translate(
  pathToConvert: SvgPathCommand[],
  conversion: readonly [number, number],
) {
  pathToConvert.forEach((command) => {
    command.values[0] += conversion[0];
    command.values[1] += conversion[1];
  });
}
function scale(pathToConvert: SvgPathCommand[], scaleFactor: number) {
  pathToConvert.forEach((command) => {
    command.values[0] *= scaleFactor;
    command.values[1] *= scaleFactor;
  });
}
