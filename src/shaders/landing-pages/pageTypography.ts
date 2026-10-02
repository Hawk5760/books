import { useMemo } from "react";

export type PageFont = {
  value: string;
  label: string;
  stack: string;
  google?: string;
};

export type PageTypographyEnvironment = {
  heading: string;
  body: string;
  headingWeight: string;
  bodyWeight: string;
  primary: string;
  headingSize: number;
  bodySize: number;
  headingLetterSpacing: number;
  retone: (color: string) => string;
  retoneRgba: (rgba: string) => string;
  filter: (baseColor?: string) => string;
};

export type PageTypographyRecipe = {
  headingFonts: PageFont[];
  bodyFonts: PageFont[];
  headingWeights: string[];
  headingWeight: string;
  bodyWeights: string[];
  bodyWeight: string;
  primaryColor: string;
  headingSize: [number, number, number];
  bodySize: [number, number, number];
  headingLetterSpacing: [number, number, number];
  css: (env: PageTypographyEnvironment) => string;
  inlineStyles?: (env: PageTypographyEnvironment) => Array<{ selector: string; styles: Record<string, string> }>;
};

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string;
  bodyWeight?: string;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type LandingPageCustomization = {
  css?: string;
  fontHref?: string;
  inlineStyles?: Array<{ selector: string; styles: Record<string, string> }>;
};

export function splitTypographyProps<T extends PageTypographyProps>(
  props: T
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
    ...rest
  } = props;
  return [
    {
      headingFont,
      bodyFont,
      headingWeight,
      bodyWeight,
      primaryColor,
      headingSize,
      bodySize,
      headingLetterSpacing,
    },
    rest as Omit<T, keyof PageTypographyProps>,
  ];
}

const clamp01 = (e: number) => Math.min(1, Math.max(0, e));

function normalizeHex(hex: string, fallback: string): string {
  if (typeof hex !== "string") return fallback;
  const match = hex.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return fallback;
  const n = match[1].toLowerCase();
  return `#${n.length === 3 ? n.replace(/./g, (r) => r + r) : n}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = [1, 3, 5].map((v) => Number.parseInt(hex.slice(v, v + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l };
  const s = delta / (1 - Math.abs(2 * l - 1));
  const h = ((max === r ? (g - b) / delta % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60 + 360) % 360;
  return { h, s, l };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m].map((val) => Math.round(clamp01(val) * 255)) as [number, number, number];
}

function hslToHex(hsl: { h: number; s: number; l: number }): string {
  return `#${hslToRgb(hsl).map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function colorDelta(from: string, to: string) {
  const a = hexToHsl(from);
  const b = hexToHsl(to);
  return {
    hue: b.h - a.h,
    saturation: a.s > 0.01 ? Math.min(3, b.s / a.s) : 1,
    lightness: a.l > 0.01 ? Math.min(3, b.l / a.l) : 1,
  };
}

function pickFont(value: string | undefined, fonts: PageFont[]): PageFont {
  return fonts.find((f) => f.value === value) ?? fonts[0];
}

function pickWeight(value: string | undefined, weights: string[], fallback: string): string {
  return value && weights.includes(value) ? value : fallback;
}

function clampRange(value: number | undefined, [min, def, max]: [number, number, number]): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : def;
}

function googleFontHref(fonts: PageFont[]): string | undefined {
  const googles = [...new Set(fonts.map((f) => f.google).filter((g): g is string => !!g))];
  if (googles.length) {
    return `https://fonts.googleapis.com/css2?${googles.map((g) => `family=${g}`).join("&")}&display=swap`;
  }
  return undefined;
}

export function usePageTypography(
  recipe: PageTypographyRecipe,
  props: PageTypographyProps
): LandingPageCustomization {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
  } = props;

  return useMemo(() => {
    const heading = pickFont(headingFont, recipe.headingFonts);
    const body = pickFont(bodyFont, recipe.bodyFonts);
    const primary = normalizeHex(primaryColor ?? recipe.primaryColor, recipe.primaryColor);
    const isIdentity = primary === recipe.primaryColor;
    const delta = colorDelta(recipe.primaryColor, primary);

    const retone = (color: string) => {
      if (isIdentity) return color;
      const hsl = hexToHsl(normalizeHex(color, color));
      return hslToHex({
        h: (hsl.h + delta.hue + 360) % 360,
        s: clamp01(hsl.s * delta.saturation),
        l: clamp01(hsl.l * delta.lightness),
      });
    };

    const retoneRgba = (rgbaStr: string) => {
      if (isIdentity) return rgbaStr;
      const m = rgbaStr.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i);
      if (!m) return rgbaStr;
      const hex = `#${[m[1], m[2], m[3]].map((x) => Math.round(Number(x)).toString(16).padStart(2, "0")).join("")}`;
      const retonedHex = retone(hex);
      const [r, g, b] = [1, 3, 5].map((x) => Number.parseInt(retonedHex.slice(x, x + 2), 16));
      return m[4] === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${m[4]})`;
    };

    const filter = (baseColor: string = recipe.primaryColor) => {
      if (isIdentity) return "none";
      const d = colorDelta(baseColor, retone(baseColor));
      return [
        `hue-rotate(${d.hue.toFixed(2)}deg)`,
        `saturate(${Math.max(0, d.saturation).toFixed(3)})`,
        `brightness(${Math.min(2, Math.max(0.2, d.lightness)).toFixed(3)})`,
      ].join(" ");
    };

    const env: PageTypographyEnvironment = {
      heading: heading.stack,
      body: body.stack,
      headingWeight: pickWeight(headingWeight, recipe.headingWeights, recipe.headingWeight),
      bodyWeight: pickWeight(bodyWeight, recipe.bodyWeights, recipe.bodyWeight),
      primary,
      headingSize: clampRange(headingSize, recipe.headingSize),
      bodySize: clampRange(bodySize, recipe.bodySize),
      headingLetterSpacing: clampRange(headingLetterSpacing, recipe.headingLetterSpacing),
      retone,
      retoneRgba,
      filter,
    };

    return {
      css: recipe.css(env),
      fontHref: googleFontHref([heading, body]),
      inlineStyles: recipe.inlineStyles?.(env),
    };
  }, [
    recipe,
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
  ]);
}

const PAGE_TYPOGRAPHY_STYLE_ID = "threeui-page-typography";
const PAGE_TYPOGRAPHY_FONTS_ID = "threeui-page-typography-fonts";
const PAGE_CUSTOMIZATION_TYPE = "threeui-page-customization";

export function applyPageCustomization(
  element: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  const doc = element?.contentDocument;
  if (!doc?.head) return;

  const fontEl = doc.getElementById(PAGE_TYPOGRAPHY_FONTS_ID);
  if (customization?.fontHref) {
    const link = (fontEl as HTMLLinkElement) ?? doc.createElement("link");
    link.id = PAGE_TYPOGRAPHY_FONTS_ID;
    link.rel = "stylesheet";
    if (link.getAttribute("href") !== customization.fontHref) {
      link.href = customization.fontHref;
    }
    if (!fontEl) doc.head.appendChild(link);
  } else {
    fontEl?.remove();
  }

  if (!customization?.css) {
    doc.getElementById(PAGE_TYPOGRAPHY_STYLE_ID)?.remove();
    return;
  }

  const styleEl =
    (doc.getElementById(PAGE_TYPOGRAPHY_STYLE_ID) as HTMLStyleElement) ??
    doc.createElement("style");
  styleEl.id = PAGE_TYPOGRAPHY_STYLE_ID;
  if (styleEl.textContent !== customization.css) {
    styleEl.textContent = customization.css;
  }
  doc.head.appendChild(styleEl);

  for (const item of customization.inlineStyles ?? []) {
    for (const el of doc.querySelectorAll<HTMLElement>(item.selector)) {
      for (const [prop, val] of Object.entries(item.styles)) {
        el.style.setProperty(prop, val);
      }
    }
  }
}

export function postPageCustomization(
  element: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  element?.contentWindow?.postMessage(
    {
      type: PAGE_CUSTOMIZATION_TYPE,
      css: customization?.css ?? "",
      fontHref: customization?.fontHref,
    },
    "*"
  );
}
