import {
  ArrowRight,
  BadgeCheck,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  ImageDown,
  Layers3,
  Link2,
  Palette,
  RefreshCw,
  Rocket,
  Save,
  Shapes,
  Sparkles,
  Type,
  Wand2
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type MarkStyle = "orbit" | "spark" | "stack" | "shield" | "wave" | "monogram";
type LogoLayout = "lockup" | "badge" | "wordmark";
type Tone = "Modern SaaS" | "Premium" | "Bold Consumer" | "Trust";

interface PalettePreset {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  ink: string;
}

interface LogoDraft {
  businessName: string;
  tagline: string;
  industry: string;
  audience: string;
  tone: Tone;
  markStyle: MarkStyle;
  layout: LogoLayout;
  palette: PalettePreset;
  initials: string;
  svg: string;
  suitePayload: {
    source: "startup-logo-creator";
    version: string;
    businessName: string;
    tagline: string;
    industry: string;
    audience: string;
    tone: Tone;
    logoSvg: string;
    colors: Record<string, string>;
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
}

const palettes: PalettePreset[] = [
  {
    id: "launch",
    label: "Launch Blue",
    primary: "#2563eb",
    secondary: "#0f766e",
    accent: "#f97316",
    background: "#f8fafc",
    ink: "#111827"
  },
  {
    id: "signal",
    label: "Signal Green",
    primary: "#047857",
    secondary: "#334155",
    accent: "#eab308",
    background: "#f6f8ef",
    ink: "#172033"
  },
  {
    id: "velocity",
    label: "Velocity Red",
    primary: "#e11d48",
    secondary: "#0891b2",
    accent: "#84cc16",
    background: "#fff7ed",
    ink: "#1f2937"
  },
  {
    id: "capital",
    label: "Capital Slate",
    primary: "#14532d",
    secondary: "#475569",
    accent: "#d97706",
    background: "#f8fafc",
    ink: "#0f172a"
  }
];

const markStyles: Array<{ id: MarkStyle; label: string }> = [
  { id: "orbit", label: "Orbit" },
  { id: "spark", label: "Spark" },
  { id: "stack", label: "Stack" },
  { id: "shield", label: "Shield" },
  { id: "wave", label: "Wave" },
  { id: "monogram", label: "Monogram" }
];

const layouts: Array<{ id: LogoLayout; label: string }> = [
  { id: "lockup", label: "Lockup" },
  { id: "badge", label: "Badge" },
  { id: "wordmark", label: "Wordmark" }
];

const tones: Tone[] = ["Modern SaaS", "Premium", "Bold Consumer", "Trust"];

export function App() {
  const [businessName, setBusinessName] = useState("LaunchPilot");
  const [tagline, setTagline] = useState("AI Startup Launch System");
  const [industry, setIndustry] = useState("SaaS");
  const [audience, setAudience] = useState("solo founders");
  const [tone, setTone] = useState<Tone>("Modern SaaS");
  const [markStyle, setMarkStyle] = useState<MarkStyle>("orbit");
  const [layout, setLayout] = useState<LogoLayout>("lockup");
  const [palette, setPalette] = useState(palettes[0]);
  const [suiteUrl, setSuiteUrl] = useState("http://localhost:5173");
  const [copied, setCopied] = useState(false);

  const draft = useMemo(
    () => createLogoDraft({ audience, businessName, industry, layout, markStyle, palette, tagline, tone }),
    [audience, businessName, industry, layout, markStyle, palette, tagline, tone]
  );

  const handoffUrl = useMemo(() => {
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(draft.suitePayload)))));
    return `${suiteUrl.replace(/\/$/, "")}?logoDraft=${encoded}`;
  }, [draft.suitePayload, suiteUrl]);

  function randomizeDirection() {
    const nextMark = markStyles[Math.floor(Math.random() * markStyles.length)].id;
    const nextPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const nextTone = tones[Math.floor(Math.random() * tones.length)];
    setMarkStyle(nextMark);
    setPalette(nextPalette);
    setTone(nextTone);
  }

  function downloadSvg() {
    downloadText(`${slugify(businessName)}-logo.svg`, draft.svg, "image/svg+xml");
  }

  function downloadSuiteJson() {
    downloadText(`${slugify(businessName)}-startup-launch-suite-brand.json`, JSON.stringify(draft.suitePayload, null, 2), "application/json");
  }

  async function copyHandoff() {
    await navigator.clipboard.writeText(handoffUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function saveToBrowser() {
    localStorage.setItem("startup-launch-suite.logoDraft", JSON.stringify(draft.suitePayload));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"><Rocket size={23} /></span>
          <div>
            <strong>Logo Creator</strong>
            <small>Startup Launch Suite</small>
          </div>
        </div>

        <nav className="nav" aria-label="Logo creator sections">
          <a href="#identity"><Type size={18} /> Identity</a>
          <a href="#style"><Palette size={18} /> Style</a>
          <a href="#export"><Download size={18} /> Export</a>
          <a href="#suite"><Link2 size={18} /> Suite</a>
        </nav>

        <section className="status-panel">
          <BadgeCheck size={18} />
          <p>Standalone app with SVG export, suite JSON export, local browser handoff, and launch URL payload.</p>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Brand asset studio</p>
            <h1>Create a logo and send the brand context into the Startup Launch Suite.</h1>
          </div>
          <button className="icon-button" onClick={randomizeDirection} title="Shuffle style" type="button">
            <RefreshCw size={20} />
          </button>
        </header>

        <section className="builder-grid">
          <section className="controls">
            <PanelTitle id="identity" icon={Type} label="Identity" />
            <div className="form-grid">
              <label>
                <span>Business Name</span>
                <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
              </label>
              <label>
                <span>Tagline</span>
                <input value={tagline} onChange={(event) => setTagline(event.target.value)} />
              </label>
              <label>
                <span>Industry</span>
                <input value={industry} onChange={(event) => setIndustry(event.target.value)} />
              </label>
              <label>
                <span>Audience</span>
                <input value={audience} onChange={(event) => setAudience(event.target.value)} />
              </label>
            </div>

            <PanelTitle id="style" icon={Shapes} label="Logo Style" />
            <div className="segmented">
              {layouts.map((item) => (
                <button className={layout === item.id ? "active" : ""} key={item.id} onClick={() => setLayout(item.id)} type="button">
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mark-grid">
              {markStyles.map((item) => (
                <button className={markStyle === item.id ? "mark-choice active" : "mark-choice"} key={item.id} onClick={() => setMarkStyle(item.id)} type="button">
                  <LogoMark initials={draft.initials} markStyle={item.id} palette={palette} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="tone-row">
              {tones.map((item) => (
                <button className={tone === item ? "active" : ""} key={item} onClick={() => setTone(item)} type="button">
                  {item}
                </button>
              ))}
            </div>

            <PanelTitle icon={Palette} label="Palette" />
            <div className="palette-grid">
              {palettes.map((item) => (
                <button className={palette.id === item.id ? "palette-choice active" : "palette-choice"} key={item.id} onClick={() => setPalette(item)} type="button">
                  <span>
                    <i style={{ background: item.primary }} />
                    <i style={{ background: item.secondary }} />
                    <i style={{ background: item.accent }} />
                  </span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="preview-area">
            <div className="canvas-shell">
              <div className="canvas-toolbar">
                <span>Live SVG Preview</span>
                <button className="secondary-button" onClick={downloadSvg} type="button">
                  <ImageDown size={18} /> SVG
                </button>
              </div>
              <div className="logo-canvas" dangerouslySetInnerHTML={{ __html: draft.svg }} />
            </div>

            <div className="usage-strip">
              <PreviewTile label="App Icon"><LogoMark initials={draft.initials} markStyle={markStyle} palette={palette} /></PreviewTile>
              <PreviewTile label="Navbar">
                <div className="mini-lockup">
                  <LogoMark initials={draft.initials} markStyle={markStyle} palette={palette} />
                  <strong>{businessName}</strong>
                </div>
              </PreviewTile>
              <PreviewTile label="Social">
                <div className="social-card" style={{ background: palette.ink }}>
                  <LogoMark initials={draft.initials} markStyle={markStyle} palette={palette} />
                  <span>{tagline}</span>
                </div>
              </PreviewTile>
            </div>
          </section>
        </section>

        <section className="export-grid" id="export">
          <article>
            <FileJson size={22} />
            <h2>Startup kit export</h2>
            <p>Exports the logo SVG, color tokens, typography, tone, audience, and brand story as a suite-ready JSON package.</p>
            <button className="primary-button" onClick={downloadSuiteJson} type="button">
              <Download size={18} /> Export Suite JSON
            </button>
          </article>

          <article id="suite">
            <Link2 size={22} />
            <h2>Connect to Startup Launch Suite</h2>
            <p>Use the local suite URL when Launch OS is running, then open it with this logo draft attached.</p>
            <label className="suite-url">
              <span>Suite URL</span>
              <input value={suiteUrl} onChange={(event) => setSuiteUrl(event.target.value)} />
            </label>
            <div className="handoff-actions">
              <button className="secondary-button" onClick={copyHandoff} type="button">
                <Copy size={18} /> {copied ? "Copied" : "Copy Link"}
              </button>
              <button className="secondary-button" onClick={saveToBrowser} type="button">
                <Save size={18} /> Save Draft
              </button>
              <a className="primary-link" href={handoffUrl}>
                <ExternalLink size={18} /> Open Suite <ArrowRight size={16} />
              </a>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function PanelTitle({ icon: Icon, id, label }: { icon: typeof Sparkles; id?: string; label: string }) {
  return (
    <div className="panel-title" id={id}>
      <Icon size={19} />
      <h2>{label}</h2>
    </div>
  );
}

function PreviewTile({ children, label }: { children: ReactNode; label: string }) {
  return (
    <article className="preview-tile">
      <span>{label}</span>
      <div>{children}</div>
    </article>
  );
}

function createLogoDraft(input: {
  audience: string;
  businessName: string;
  industry: string;
  layout: LogoLayout;
  markStyle: MarkStyle;
  palette: PalettePreset;
  tagline: string;
  tone: Tone;
}): LogoDraft {
  const initials = getInitials(input.businessName);
  const svg = renderLogoSvg(input, initials);

  return {
    ...input,
    initials,
    svg,
    suitePayload: {
      source: "startup-logo-creator",
      version: "0.1.0",
      businessName: input.businessName,
      tagline: input.tagline,
      industry: input.industry,
      audience: input.audience,
      tone: input.tone,
      logoSvg: svg,
      colors: {
        primary: input.palette.primary,
        secondary: input.palette.secondary,
        accent: input.palette.accent,
        background: input.palette.background,
        text: input.palette.ink
      },
      typography: {
        headingFont: input.tone === "Premium" ? "Aptos Display" : "Inter",
        bodyFont: "Inter"
      }
    }
  };
}

function LogoMark({ initials, markStyle, palette }: { initials: string; markStyle: MarkStyle; palette: PalettePreset }) {
  return (
    <svg aria-hidden="true" className="mark-svg" viewBox="0 0 120 120">
      {renderMarkNodes(markStyle, initials, palette)}
    </svg>
  );
}

function renderLogoSvg(input: Omit<LogoDraft, "initials" | "svg" | "suitePayload">, initials: string) {
  const { businessName, layout, palette, tagline, tone } = input;
  const width = layout === "badge" ? 760 : 960;
  const height = layout === "badge" ? 760 : 360;
  const textX = layout === "wordmark" ? 110 : 290;
  const mark = renderMarkMarkup(input.markStyle, initials, palette);
  const nameSize = businessName.length > 16 ? 54 : 66;

  if (layout === "badge") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="56" fill="${palette.background}"/>
  <g transform="translate(260 96) scale(2)">${mark}</g>
  <text x="380" y="496" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${nameSize}" font-weight="900" fill="${palette.ink}">${escapeXml(businessName)}</text>
  <text x="380" y="558" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="650" fill="${palette.secondary}">${escapeXml(tagline || tone)}</text>
</svg>`;
  }

  if (layout === "wordmark") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="36" fill="${palette.background}"/>
  <path d="M86 232c96-134 242-178 438-130 116 28 220 18 312-30v70c-112 68-240 86-384 52-142-34-254-8-366 92Z" fill="${palette.accent}" opacity=".16"/>
  <text x="${textX}" y="178" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="950" fill="${palette.ink}">${escapeXml(businessName)}</text>
  <text x="${textX}" y="230" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="650" fill="${palette.secondary}">${escapeXml(tagline || tone)}</text>
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="36" fill="${palette.background}"/>
  <g transform="translate(86 78) scale(1.55)">${mark}</g>
  <text x="${textX}" y="156" font-family="Inter, Arial, sans-serif" font-size="${nameSize}" font-weight="950" fill="${palette.ink}">${escapeXml(businessName)}</text>
  <text x="${textX}" y="210" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="650" fill="${palette.secondary}">${escapeXml(tagline || tone)}</text>
  <rect x="${textX}" y="248" width="186" height="12" rx="6" fill="${palette.accent}"/>
</svg>`;
}

function renderMarkNodes(style: MarkStyle, initials: string, palette: PalettePreset) {
  const markup = renderMarkMarkup(style, initials, palette);
  return <g dangerouslySetInnerHTML={{ __html: markup }} />;
}

function renderMarkMarkup(style: MarkStyle, initials: string, palette: PalettePreset) {
  const text = `<text x="60" y="72" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="950" fill="#fff">${escapeXml(initials)}</text>`;

  if (style === "spark") {
    return `<rect x="14" y="14" width="92" height="92" rx="24" fill="${palette.primary}"/><path d="M60 20l10 30 32 10-32 10-10 30-10-30-32-10 32-10Z" fill="${palette.accent}"/>${text}`;
  }
  if (style === "stack") {
    return `<rect x="16" y="20" width="70" height="70" rx="18" fill="${palette.primary}"/><rect x="34" y="30" width="70" height="70" rx="18" fill="${palette.secondary}" opacity=".94"/><path d="M34 78h70v10a12 12 0 0 1-12 12H46a12 12 0 0 1-12-12Z" fill="${palette.accent}"/>${text}`;
  }
  if (style === "shield") {
    return `<path d="M60 12l42 16v34c0 28-16 48-42 58-26-10-42-30-42-58V28Z" fill="${palette.primary}"/><path d="M34 56h52v18H34Z" fill="${palette.accent}"/>${text}`;
  }
  if (style === "wave") {
    return `<rect x="12" y="12" width="96" height="96" rx="28" fill="${palette.primary}"/><path d="M22 78c24-26 48-32 72-18 8 5 14 7 20 6v18c-16 6-30 4-44-4-18-10-34-6-48 12Z" fill="${palette.accent}"/><circle cx="86" cy="32" r="13" fill="${palette.secondary}"/>${text}`;
  }
  if (style === "monogram") {
    return `<circle cx="60" cy="60" r="50" fill="${palette.primary}"/><circle cx="60" cy="60" r="35" fill="none" stroke="${palette.accent}" stroke-width="8"/>${text}`;
  }
  return `<rect x="14" y="14" width="92" height="92" rx="26" fill="${palette.primary}"/><circle cx="84" cy="34" r="16" fill="${palette.accent}"/><path d="M26 76c24-42 56-58 86-48-22 12-36 28-42 48 15-3 27-1 38 5-26 22-54 28-82-5Z" fill="${palette.secondary}"/>${text}`;
}

function getInitials(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return "S";
  return cleaned
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "startup-logo";
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&apos;"
    };
    return entities[character];
  });
}
