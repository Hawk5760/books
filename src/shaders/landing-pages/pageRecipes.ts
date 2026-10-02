import type { PageTypographyRecipe, PageFont } from "./pageTypography";

const FONT_IOWAN_OLD_STYLE: PageFont = {
  value: "iowan-old-style",
  label: "Iowan Old Style",
  stack: '"Iowan Old Style", Baskerville, "Times New Roman", serif',
};

const FONT_INSTRUMENT_SERIF: PageFont = {
  value: "instrument-serif",
  label: "Instrument Serif",
  stack: '"Instrument Serif", Georgia, serif',
  google: "Instrument+Serif",
};

const FONT_NEWSREADER: PageFont = {
  value: "newsreader",
  label: "Newsreader",
  stack: '"Newsreader", Georgia, serif',
  google: "Newsreader:wght@200..700",
};

const FONT_GEIST: PageFont = {
  value: "geist",
  label: "Geist",
  stack: '"Geist", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  google: "Geist:wght@100..900",
};

const fe = (e: number) => Number(e.toFixed(3));
const R = (e: number) => `${fe(e)}px`;

export const BESTSELLERS_TYPOGRAPHY: PageTypographyRecipe = {
  headingFonts: [FONT_IOWAN_OLD_STYLE, FONT_INSTRUMENT_SERIF, FONT_NEWSREADER, FONT_GEIST],
  bodyFonts: [FONT_IOWAN_OLD_STYLE, FONT_GEIST, FONT_NEWSREADER, FONT_INSTRUMENT_SERIF],
  headingWeights: ["400", "500", "600", "700"],
  headingWeight: "500",
  bodyWeights: ["400", "500", "600", "700"],
  bodyWeight: "400",
  primaryColor: "#c3a47b",
  headingSize: [184, 325, 420],
  bodySize: [12, 17, 24],
  headingLetterSpacing: [-0.12, -0.085, 0.08],
  css: (e) => `
:root {
  --pink: ${e.primary};
  --pink-bright: ${e.retone("#dbc39c")};
  --periwinkle: ${e.retone("#b7976c")};
}
body { font-family: ${e.body}; font-weight: ${e.bodyWeight}; }
.brand, .hero-word, .detail-title, .cover-title {
  font-family: ${e.heading};
  font-weight: ${e.headingWeight};
}
.hero-word {
  font-size: clamp(184px, 22vw, ${R(e.headingSize)});
  letter-spacing: ${e.headingLetterSpacing}em;
}
.detail-title {
  font-size: clamp(52px, 5.7vw, ${R((e.headingSize * 82) / 325)});
  letter-spacing: ${fe(e.headingLetterSpacing + 0.03)}em;
}
.detail-description { font-size: clamp(12px, 1.28vw, ${R(e.bodySize)}); font-weight: ${e.bodyWeight}; }
@media (max-width: 900px) {
  .hero-word { font-size: clamp(128px, 28vw, ${R((e.headingSize * 230) / 325)}); }
  .detail-title { font-size: clamp(48px, 10vw, ${R((e.headingSize * 70) / 325)}); }
}
@media (max-width: 560px) {
  .hero-word { font-size: calc(${fe(e.headingSize / 325)} * 38vw); }
}
`,
};

function createGenericRecipe(primaryColor: string): PageTypographyRecipe {
  return {
    headingFonts: [FONT_IOWAN_OLD_STYLE, FONT_INSTRUMENT_SERIF, FONT_NEWSREADER, FONT_GEIST],
    bodyFonts: [FONT_IOWAN_OLD_STYLE, FONT_GEIST, FONT_NEWSREADER, FONT_INSTRUMENT_SERIF],
    headingWeights: ["300", "400", "500", "600", "700"],
    headingWeight: "500",
    bodyWeights: ["300", "400", "500", "600", "700"],
    bodyWeight: "400",
    primaryColor,
    headingSize: [120, 200, 320],
    bodySize: [12, 16, 22],
    headingLetterSpacing: [-0.05, 0, 0.05],
    css: () => "",
  };
}

export const ANTHRA_A40_TYPOGRAPHY = createGenericRecipe("#c8c8c8");
export const ATTUNE_TYPOGRAPHY = createGenericRecipe("#7f97ba");
export const AURELLO_TYPOGRAPHY = createGenericRecipe("#e67332");
export const AXONIS_TYPOGRAPHY = createGenericRecipe("#40c0a0");
export const BETAWISE_HERO_TYPOGRAPHY = createGenericRecipe("#4a80f0");
export const BETAWISE_TYPOGRAPHY = createGenericRecipe("#4a80f0");
export const COMPLETE_SHELF_TYPOGRAPHY = createGenericRecipe("#e0c080");
export const INKBOUND_TYPOGRAPHY = createGenericRecipe("#3b82f6");
export const ECHO_VALE_TYPOGRAPHY = createGenericRecipe("#a0a090");
export const HALVORSEN_TYPOGRAPHY = createGenericRecipe("#ffffff");
export const KAGE_TYPOGRAPHY = createGenericRecipe("#111111");
export const KAIRO_TYPOGRAPHY = createGenericRecipe("#ff5500");
export const MK78_KEYBOARD_TYPOGRAPHY = createGenericRecipe("#d0d0d0");
export const MARA_VOSS_TYPOGRAPHY = createGenericRecipe("#b0b0a0");
export const NOEMA_N1_TYPOGRAPHY = createGenericRecipe("#e0e0e0");
export const RENDERLAB_TYPOGRAPHY = createGenericRecipe("#00ff66");
export const MENG_TO_SKETCHBOOK_TYPOGRAPHY = createGenericRecipe("#d4a373");
export const NOCTURNE_TYPOGRAPHY = createGenericRecipe("#1a2035");
export const SYLVA_TYPOGRAPHY = createGenericRecipe("#3d8b57");
export const TIDECREST_TYPOGRAPHY = createGenericRecipe("#ffffff");
export const VOLTA_ATELIER_TYPOGRAPHY = createGenericRecipe("#e2b170");
