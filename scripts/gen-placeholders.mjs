// Gera ilustrações DEMONSTRATIVAS (SVG) em public/placeholders. Substitua pelas fotos reais no painel.
import { mkdirSync, writeFileSync } from "node:fs";

const out = new URL("../public/placeholders/", import.meta.url);
mkdirSync(out, { recursive: true });

const bg = ["#E8DFCF", "#DDE3D3", "#EFE8DA", "#D6DECB", "#E4DAC6"];
const stroke = "#55653A";
const soft = "#A8B79E";

// Ícones de traço simples (viewBox 0 0 100 100), um por produto.
const icons = {
  "kit-utensilios-de-silicone": `<path d="M30 78V42m0 0c-8-2-12-10-10-18h20c2 8-2 16-10 18zM58 78V36l12-14 12 14v42" /><path d="M58 52h24"/>`,
  "cortador-multifuncional-de-legumes": `<rect x="20" y="56" width="60" height="22" rx="4"/><path d="M30 56V34h40v22M40 34v22M50 34v22M60 34v22"/>`,
  "pulverizador-de-azeite-e-oleo": `<path d="M40 82h22V46c0-8-4-12-4-18H44c0 6-4 10-4 18z"/><path d="M44 28V18h14v10M58 22h14M74 18l6-4M74 24h8M74 30l6 4"/>`,
  "amassador-de-alho": `<path d="M22 66h56M30 66c0 10 8 16 20 16s20-6 20-16"/><path d="M50 66V26M38 26h24"/>`,
  "kit-de-medidores-de-cozinha": `<circle cx="34" cy="34" r="12"/><circle cx="66" cy="34" r="9"/><path d="M34 46v26M66 43v29M24 72h20M56 72h20"/>`,
  "escorredor-retratil-de-silicone": `<ellipse cx="50" cy="40" rx="30" ry="10"/><path d="M20 40l6 34h48l6-34M38 54l2 14M50 56v14M62 54l-2 14"/>`,
  "afiador-de-facas": `<path d="M16 62L70 24l6 8-48 38z"/><rect x="60" y="64" width="26" height="12" rx="3"/><path d="M60 70h26"/>`,
  "organizador-de-pia": `<rect x="22" y="42" width="56" height="36" rx="5"/><path d="M22 58h56M36 42V28h10v14M58 42V32h12v10"/>`,
  "tabua-de-corte-com-coletor": `<rect x="18" y="26" width="64" height="44" rx="6"/><path d="M18 62h64M30 36h30M30 46h22"/><path d="M62 70v8h20v-8"/>`,
  "descascador-multifuncional": `<path d="M36 80V44c0-8 4-14 14-14s14 6 14 14v36z"/><path d="M42 30V18h16v12M44 56h12"/>`,
  banner: `<path d="M8 80c14-26 30-26 44 0s30 26 44 0M12 40h24M12 52h16"/><circle cx="76" cy="26" r="10"/>`,
};
const defaultIcon = `<circle cx="50" cy="50" r="22"/><path d="M40 50h20M50 40v20"/>`;

const slugs = Object.keys(icons);
const extra = ["utensilios", "preparo-e-corte", "organizacao", "medidas-e-dosagem"];

function svg(slug, i) {
  const wide = slug === "banner";
  const w = wide ? 1600 : 800;
  const h = wide ? 900 : 1000;
  const s = wide ? 7 : 3.2;
  const alias = { utensilios: "kit-utensilios-de-silicone", "preparo-e-corte": "cortador-multifuncional-de-legumes", organizacao: "organizador-de-pia", "medidas-e-dosagem": "kit-de-medidores-de-cozinha" };
  const icon = icons[slug] ?? icons[alias[slug]] ?? defaultIcon;
  const scale = wide ? 5.2 : 3.4;
  const tx = wide ? 800 - 50 * scale : (w - 100 * scale) / 2;
  const ty = wide ? 450 - 53 * scale : (h - 100 * scale) / 2 - 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Imagem demonstrativa">
  <rect width="${w}" height="${h}" fill="${bg[i % bg.length]}"/>
  <circle cx="${w / 2}" cy="${wide ? 450 : h / 2 - 40}" r="${wide ? 330 : 260}" fill="${soft}" fill-opacity=".28"/>
  <g transform="translate(${tx} ${ty}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="${s / scale}" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
  <text x="${w / 2}" y="${h - 56}" text-anchor="middle" font-family="sans-serif" font-size="${wide ? 26 : 22}" fill="${stroke}" fill-opacity=".7">${wide || extra.includes(slug) ? "" : "Imagem demonstrativa"}</text>
</svg>`;
}

[...slugs, ...extra].forEach((slug, i) => writeFileSync(new URL(`${slug}.svg`, out), svg(slug, i)));
console.log(`${slugs.length + extra.length} placeholders gerados.`);
