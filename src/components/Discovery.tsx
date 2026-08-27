import { useEffect, useMemo, useRef, useState } from "react";
import { ARCHETYPES, brandColors, getArchetype } from "../lib/archetypes";
import type { AppConfig, CustomItemInput, FeatureId, ItemType } from "../lib/types";
import { FEATURE_LABEL, TYPE_LABEL } from "../lib/types";
import { Icon } from "./Icons";

const STEPS = [
  { id: 1, label: "Tipo de negocio" },
  { id: 2, label: "Identidad" },
  { id: 3, label: "Catálogo inicial" },
  { id: 4, label: "Funcionalidades" },
  { id: 5, label: "Confirmar" },
];

const TICKER =
  "CARRITO · RESERVAS · COTIZACIONES · VARIANTES · BÚSQUEDA · FILTROS · FAVORITOS · PAGOS · CATEGORÍAS · OPINIONES · CHECKOUT · AGENDA · ";

function useTyped(text: string, speed = 26) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

function useRevealAll(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

export default function Discovery({
  initial,
  onLaunch,
}: {
  initial: AppConfig | null;
  onLaunch: (c: AppConfig) => void;
}) {
  const [step, setStep] = useState(1);
  const [archetypeId, setArchetypeId] = useState(initial?.archetypeId ?? "");
  const [name, setName] = useState(initial?.businessName ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "");
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? []);
  const [itemIds, setItemIds] = useState<string[]>(initial?.itemIds ?? []);
  const [customItems, setCustomItems] = useState<CustomItemInput[]>(initial?.customItems ?? []);
  const [features, setFeatures] = useState<FeatureId[]>(initial?.features ?? []);
  const [showManifest, setShowManifest] = useState(false);

  const arch = archetypeId ? getArchetype(archetypeId) : null;
  const typed = useTyped("¿Qué tipo de aplicación o negocio deseas crear?", 30);
  useRevealAll(step);

  const pickArchetype = (id: string) => {
    setArchetypeId(id);
    const a = getArchetype(id);
    if (id !== initial?.archetypeId || !initial) {
      setName(a.defaultName);
      setAudience(a.audience);
      setCategories([...a.categories]);
      setItemIds(a.seeds.map((s) => s.id));
      setFeatures([...a.defaultFeatures]);
      setCustomItems([]);
    }
  };

  const [ciName, setCiName] = useState("");
  const [ciPrice, setCiPrice] = useState("");
  const [ciCat, setCiCat] = useState("");
  const [ciType, setCiType] = useState<ItemType>("product");

  const addCustom = () => {
    if (!arch || ciName.trim().length < 2) return;
    const cat = ciCat.trim() || arch.categories[0];
    const priceNum = ciPrice.trim() === "" ? null : Math.max(0, Number(ciPrice));
    setCustomItems((p) => [
      ...p,
      { name: ciName.trim(), price: Number.isFinite(priceNum as number) ? priceNum : null, category: cat, type: ciType },
    ]);
    setCiName("");
    setCiPrice("");
    setCiCat("");
  };

  const canNext = useMemo(() => {
    if (step === 1) return !!archetypeId;
    if (step === 2) return name.trim().length >= 2 && categories.length > 0;
    if (step === 3) return itemIds.length + customItems.length > 0;
    if (step === 4) return true;
    return true;
  }, [step, archetypeId, name, categories, itemIds, customItems]);

  const finish = () => {
    if (!arch) return;
    onLaunch({
      archetypeId: arch.id,
      businessName: name.trim(),
      audience: audience.trim() || arch.audience,
      categories,
      features,
      itemIds,
      customItems,
      createdAt: Date.now(),
    });
  };

  const bc = arch ? brandColors(arch.hue) : brandColors(12);

  return (
    <div
      className="relative min-h-screen bg-ink text-card noise"
      style={{ ["--brand" as string]: bc.brand, ["--brand-soft" as string]: bc.brandSoft, ["--brand-ink" as string]: bc.brandInk }}
    >
      <div className="tex-grid-dark absolute inset-0 pointer-events-none" />
      <div className="scanline pointer-events-none" />

      {/* header */}
      <header className="relative z-10 border-b border-card/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-ember text-card hard-sm border border-card/20">
              <Icon name="hammer" size={18} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold tracking-tight">FORJA</p>
              <p className="font-mono text-[10px] tracking-[0.22em] text-card/50 uppercase">Generador universal de comercio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-card/60">
              <span className="h-2 w-2 rounded-full bg-ember pulse-dot" />
              consola de configuración
            </span>
            <button
              onClick={() => setShowManifest((v) => !v)}
              className="lg:hidden border border-card/25 px-3 py-1.5 font-mono text-[11px] tracking-wider hover:bg-card/10 transition-colors"
            >
              MANIFIESTO
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[170px_1fr_300px] lg:py-12">
        {/* step rail */}
        <aside className="hidden lg:block">
          <ol className="sticky top-8 space-y-1">
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => done && setStep(s.id)}
                    className={`group flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left transition-all ${
                      active ? "border-ember bg-card/5" : done ? "border-card/30 hover:border-card/60" : "border-card/10 opacity-45"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] ${active ? "text-ember" : done ? "text-card/70" : "text-card/40"}`}
                    >
                      {done ? "✓" : String(s.id).padStart(2, "0")}
                    </span>
                    <span className={`font-display text-sm font-semibold ${active ? "text-card" : "text-card/60"}`}>{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 border border-card/15 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-card/45">Paso {step} / 5</p>
            <div className="mt-2 h-1.5 w-full bg-card/10">
              <div className="h-full bg-ember transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
            </div>
          </div>
        </aside>

        {/* main content */}
        <main className="min-w-0">
          {/* STEP 1 — the mandatory question */}
          {step === 1 && (
            <section key="s1" className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">01 · Descubrimiento</p>
              <h1 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold leading-[1.02] tracking-tight min-h-[2.2em] sm:min-h-[1.1em]">
                <span className={typed.length < 44 ? "cursor-blink" : ""}>{typed}</span>
              </h1>
              <p className="mt-4 max-w-xl text-card/65">
                No asumo nada: la app se diseña a partir de tu respuesta. Elige el modelo que más se acerca — luego afinamos
                nombre, catálogo y funciones.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2" data-reveal>
                {ARCHETYPES.map((a, i) => {
                  const sel = archetypeId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => pickArchetype(a.id)}
                      className={`group relative border-2 p-4 text-left transition-all duration-200 reveal ${
                        sel ? "border-ember bg-card/[0.07] hard-brand" : "border-card/20 hover:border-card/50 hover:bg-card/[0.04]"
                      }`}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-colors ${
                            sel ? "border-ember text-ember" : "border-card/30 text-card/70 group-hover:text-card"
                          }`}
                          style={{ color: sel ? undefined : `hsl(${a.hue} 60% 65%)` }}
                        >
                          <Icon name={a.icon} size={20} />
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center border-2 text-[11px] font-bold transition-all ${
                            sel ? "border-ember bg-ember text-ink anim-pop" : "border-card/30"
                          }`}
                        >
                          {sel && <Icon name="check" size={12} strokeWidth={3} />}
                        </span>
                      </div>
                      <p className="mt-3 font-display text-base font-bold leading-snug">{a.label}</p>
                      <p className="mt-1 text-[13px] text-card/55">{a.short}</p>
                      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-widest text-card/40">
                        {a.seeds.length} ejemplos · {a.itemTypes.length} tipo{a.itemTypes.length > 1 ? "s" : ""} de elemento
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 font-mono text-[11px] text-card/40">
                → ¿Otro tipo de negocio? Elige el más cercano: todo se puede ajustar en los siguientes pasos.
              </p>
            </section>
          )}

          {/* STEP 2 — identity */}
          {step === 2 && arch && (
            <section key="s2" className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">02 · Identidad</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Cuéntame de <span className="text-ember">{arch.label.toLowerCase()}</span>.
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-card/50">Nombre del negocio *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={arch.defaultName}
                    className="mt-2 w-full border-2 border-card/25 bg-transparent px-4 py-3 font-display text-lg font-semibold outline-none transition-colors placeholder:text-card/25 focus:border-ember"
                  />
                  <span className="mt-1.5 block font-mono text-[10px] text-card/35">Aparecerá en el encabezado de tu app.</span>
                </label>
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-card/50">Público objetivo</span>
                  <input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder={arch.audience}
                    className="mt-2 w-full border-2 border-card/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-card/25 focus:border-ember"
                  />
                  <span className="mt-1.5 block font-mono text-[10px] text-card/35">Ajusta el tono y los textos sugeridos.</span>
                </label>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-card/50">
                  Categorías del catálogo * <span className="text-card/30">({categories.length})</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <span
                      key={c}
                      className="group flex items-center gap-2 border-2 border-ember/70 bg-ember/10 px-3 py-1.5 text-sm font-medium anim-pop"
                    >
                      {c}
                      <button
                        onClick={() => setCategories((p) => p.filter((x) => x !== c))}
                        className="text-card/50 hover:text-ember transition-colors"
                        aria-label={`Quitar ${c}`}
                      >
                        <Icon name="x" size={13} />
                      </button>
                    </span>
                  ))}
                  {categories.length === 0 && <span className="text-sm text-card/35">Agrega al menos una categoría…</span>}
                </div>
                <CategoryInput
                  onAdd={(v) => setCategories((p) => (p.includes(v) ? p : [...p, v]))}
                  suggestions={arch.categories.filter((c) => !categories.includes(c))}
                />
                <p className="mt-2 font-mono text-[10px] text-card/35">
                  Propuestas del modelo: {arch.categories.join(", ")}
                </p>
              </div>

              <div className="mt-8 border-2 border-card/15 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-card/45">Vista previa de identidad</p>
                <div className="mt-3 flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 items-center justify-center border-2 border-ink font-display text-2xl font-extrabold"
                    style={{ background: bc.brand, color: bc.brandInk }}
                  >
                    {(name.trim() || arch.defaultName).charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold tracking-tight">{name.trim() || arch.defaultName}</p>
                    <p className="text-sm text-card/55">{arch.tagline}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 — catalog */}
          {step === 3 && arch && (
            <section key="s3" className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">03 · Catálogo inicial</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Tus primeros {arch.itemTypes.includes("product") ? "productos" : "elementos"}.
              </h2>
              <p className="mt-3 max-w-xl text-card/65">
                Generé ejemplos específicos para <strong className="text-card">{name || arch.defaultName}</strong>. Marca los que
                quieras conservar, o agrega los tuyos.
              </p>
              <div className="mt-7 grid gap-2.5">
                {arch.seeds.map((s) => {
                  const sel = itemIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        setItemIds((p) => (sel ? p.filter((x) => x !== s.id) : [...p, s.id]))
                      }
                      className={`flex items-center gap-4 border-2 px-4 py-3 text-left transition-all ${
                        sel ? "border-card/50 bg-card/[0.06]" : "border-card/15 opacity-50 hover:opacity-80"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all ${
                          sel ? "border-ember bg-ember text-ink" : "border-card/30"
                        }`}
                      >
                        {sel && <Icon name="check" size={12} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display font-semibold">{s.name}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-card/45">
                          {s.category} · {TYPE_LABEL[s.type]}
                        </span>
                      </span>
                      <span className="font-mono text-sm text-card/70">
                        {s.price === null ? "cotizar" : `$${s.price.toLocaleString("es-MX")}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* custom items */}
              <div className="mt-8 border-2 border-dashed border-card/25 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-card/50">Agregar elemento propio</p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_110px_1fr_1fr_auto]">
                  <input
                    value={ciName}
                    onChange={(e) => setCiName(e.target.value)}
                    placeholder="Nombre (ej. Pastel de zanahoria)"
                    className="border-2 border-card/25 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ember placeholder:text-card/25"
                  />
                  <input
                    value={ciPrice}
                    onChange={(e) => setCiPrice(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="$ (vacío = cotizar)"
                    inputMode="decimal"
                    className="border-2 border-card/25 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ember placeholder:text-card/25"
                  />
                  <select
                    value={ciCat}
                    onChange={(e) => setCiCat(e.target.value)}
                    className="border-2 border-card/25 bg-ink px-3 py-2.5 text-sm outline-none focus:border-ember"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ciType}
                    onChange={(e) => setCiType(e.target.value as ItemType)}
                    className="border-2 border-card/25 bg-ink px-3 py-2.5 text-sm outline-none focus:border-ember"
                  >
                    {arch.itemTypes.map((t) => (
                      <option key={t} value={t}>
                        {TYPE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addCustom}
                    disabled={ciName.trim().length < 2}
                    className="flex items-center justify-center gap-1.5 border-2 border-ember bg-ember px-4 py-2.5 font-display text-sm font-bold text-ink transition-all enabled:hover:hard-brand enabled:active:translate-x-0.5 disabled:opacity-35"
                    style={{ color: bc.brandInk }}
                  >
                    <Icon name="plus" size={15} strokeWidth={2.4} /> Agregar
                  </button>
                </div>
                {customItems.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {customItems.map((c, i) => (
                      <li key={i} className="flex items-center justify-between border border-card/15 bg-card/5 px-3 py-2 text-sm anim-pop">
                        <span>
                          <strong className="font-display">{c.name}</strong>
                          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-card/45">
                            {c.category} · {TYPE_LABEL[c.type]}
                          </span>
                        </span>
                        <button
                          onClick={() => setCustomItems((p) => p.filter((_, j) => j !== i))}
                          className="text-card/45 hover:text-ember transition-colors"
                          aria-label="Quitar"
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="mt-4 font-mono text-[11px] text-card/45">
                {itemIds.length + customItems.length} elemento{itemIds.length + customItems.length !== 1 ? "s" : ""} en el
                catálogo · podrás editar todo después.
              </p>
            </section>
          )}

          {/* STEP 4 — features */}
          {step === 4 && arch && (
            <section key="s4" className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">04 · Funcionalidades</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">¿Qué debe hacer tu app?</h2>
              <p className="mt-3 max-w-xl text-card/65">
                Preseleccioné lo típico de <strong className="text-card">{arch.label.toLowerCase()}</strong>. Activa o desactiva
                con un clic.
              </p>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {(Object.keys(FEATURE_LABEL) as FeatureId[]).map((f) => {
                  const on = features.includes(f);
                  const recommended = arch.defaultFeatures.includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => setFeatures((p) => (on ? p.filter((x) => x !== f) : [...p, f]))}
                      className={`flex items-center justify-between gap-3 border-2 px-4 py-3.5 text-left transition-all ${
                        on ? "border-ember/80 bg-ember/[0.08]" : "border-card/15 hover:border-card/40"
                      }`}
                    >
                      <span>
                        <span className={`block font-display font-semibold ${on ? "text-card" : "text-card/60"}`}>
                          {FEATURE_LABEL[f]}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-card/35">
                          {recommended ? "recomendado para ti" : "opcional"}
                        </span>
                      </span>
                      <span
                        className={`relative h-6 w-11 shrink-0 border-2 transition-colors ${on ? "border-ember bg-ember" : "border-card/30 bg-transparent"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 transition-all duration-200 ${on ? "left-[22px] bg-ink" : "left-0.5 bg-card/40"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 border-2 border-card/15 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-card/45">{arch.flowLabel}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {arch.flow.map((f, i) => (
                    <span key={f} className="flex items-center gap-2">
                      <span
                        className={`border px-3 py-1.5 font-display text-sm font-semibold ${
                          i === arch.flow.length - 1 ? "border-ember bg-ember hard-xs" : "border-card/25 bg-card/5"
                        }`}
                        style={i === arch.flow.length - 1 ? { color: bc.brandInk } : undefined}
                      >
                        {f}
                      </span>
                      {i < arch.flow.length - 1 && <Icon name="arrowRight" size={14} className="text-ember" />}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[13px] text-card/50">
                  La interfaz generada reflejará este recorrido: botones, pantallas y confirmaciones.
                </p>
              </div>
            </section>
          )}

          {/* STEP 5 — confirm */}
          {step === 5 && arch && (
            <section key="s5" className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">05 · Confirmación</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Esto es lo que entendí del proyecto.
              </h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  ["Modelo", arch.label],
                  ["Nombre", name],
                  ["Público", audience || arch.audience],
                  ["Categorías", categories.join(", ")],
                  ["Catálogo", `${itemIds.length + customItems.length} elementos (${itemIds.length} sugeridos + ${customItems.length} propios)`],
                  ["Funciones activas", `${features.length} de ${Object.keys(FEATURE_LABEL).length}`],
                ].map(([k, v]) => (
                  <div key={k} className="border-2 border-card/15 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-card/40">{k}</p>
                    <p className="mt-1.5 font-display text-lg font-semibold leading-snug">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-2 border-ember/60 bg-ember/[0.07] p-4">
                <p className="font-display font-semibold text-ember">¿Todo correcto?</p>
                <p className="mt-1 text-sm text-card/65">
                  Voy a compilar la app de <strong className="text-card">{name}</strong> con su catálogo, flujo{" "}
                  <em>{arch.flowLabel.toLowerCase()}</em> y {features.length} funcionalidades. Podrás volver a editar la
                  configuración cuando quieras.
                </p>
              </div>
              <button
                onClick={finish}
                className="lift mt-8 flex w-full items-center justify-center gap-3 border-2 border-ink bg-ember px-6 py-5 font-display text-xl font-extrabold tracking-tight hard-brand sm:w-auto"
                style={{ color: bc.brandInk }}
              >
                <Icon name="bolt" size={22} strokeWidth={2.2} />
                Generar mi aplicación
                <Icon name="arrowRight" size={20} strokeWidth={2.2} />
              </button>
            </section>
          )}

          {/* nav */}
          <div className="mt-10 flex items-center justify-between border-t border-card/10 pt-5">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 border-2 border-card/25 px-4 py-2.5 font-display text-sm font-semibold text-card/70 transition-all enabled:hover:border-card/60 enabled:hover:text-card disabled:opacity-30"
            >
              <Icon name="arrowLeft" size={15} /> Atrás
            </button>
            <div className="flex items-center gap-2 sm:hidden">
              {STEPS.map((s) => (
                <span key={s.id} className={`h-1.5 transition-all ${step === s.id ? "w-6 bg-ember" : "w-1.5 bg-card/25"}`} />
              ))}
            </div>
            {step < 5 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="lift flex items-center gap-2 border-2 border-ink bg-card px-5 py-2.5 font-display text-sm font-bold text-ink hard-sm transition-all disabled:opacity-30 disabled:shadow-none"
              >
                Continuar <Icon name="arrowRight" size={15} strokeWidth={2.2} />
              </button>
            ) : (
              <span className="font-mono text-[11px] text-card/40">listo para compilar ⚡</span>
            )}
          </div>
        </main>

        {/* manifest panel */}
        <aside className={`${showManifest ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-8 border-2 border-card/20 bg-ink2/80">
            <div className="flex items-center justify-between border-b border-card/15 px-4 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-card/50">manifiesto.app</p>
              <span className="flex gap-1.5">
                <i className="h-2 w-2 rounded-full bg-ember/80" />
                <i className="h-2 w-2 rounded-full bg-gold/80" />
                <i className="h-2 w-2 rounded-full bg-pine" />
              </span>
            </div>
            <div className="space-y-2 px-4 py-4 font-mono text-[11.5px] leading-relaxed">
              <ManifestRow k="modelo" v={arch ? arch.label : "— pendiente —"} dim={!arch} />
              <ManifestRow k="nombre" v={name ? `"${name}"` : "…"} dim={!name} />
              <ManifestRow k="público" v={audience ? `"${audience}"` : "…"} dim={!audience} />
              <ManifestRow k="categorías" v={`${categories.length} definidas`} dim={categories.length === 0} />
              <ManifestRow k="elementos" v={`${itemIds.length + customItems.length} en catálogo`} dim={itemIds.length + customItems.length === 0} />
              <ManifestRow k="funciones" v={`${features.length} activas`} dim={features.length === 0} />
              <ManifestRow k="flujo" v={arch ? arch.flowLabel.toLowerCase() : "…"} dim={!arch} />
              <ManifestRow k="identidad" v={arch ? `hsl(${arch.hue}° · a color)` : "…"} dim={!arch} />
              <p className="pt-1 text-ember cursor-blink" />
            </div>
            {arch && (
              <div className="border-t border-card/15 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-card/40">Identidad generada</p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center border-2 border-ink font-display text-lg font-extrabold"
                    style={{ background: bc.brand, color: bc.brandInk }}
                  >
                    {(name.trim() || arch.defaultName).charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold">{name.trim() || arch.defaultName}</p>
                    <div className="mt-1 flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-3 w-6 border border-ink/40"
                          style={{ background: `hsl(${arch.hue} ${60 - i * 12}% ${45 + i * 15}%)` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ticker */}
      <footer className="relative z-10 border-t border-card/10 py-3 overflow-hidden">
        <div className="anim-marquee flex w-max whitespace-nowrap font-mono text-[11px] tracking-[0.25em] text-card/30">
          <span>{TICKER.repeat(3)}</span>
          <span>{TICKER.repeat(3)}</span>
        </div>
      </footer>
    </div>
  );
}

function ManifestRow({ k, v, dim }: { k: string; v: string; dim?: boolean }) {
  return (
    <p className={`flex gap-2 ${dim ? "text-card/35" : "text-card/80"}`}>
      <span className="w-[86px] shrink-0 text-card/40">{k}</span>
      <span className="text-ember">→</span>
      <span className="truncate">{v}</span>
    </p>
  );
}

function CategoryInput({ onAdd, suggestions }: { onAdd: (v: string) => void; suggestions: string[] }) {
  const [v, setV] = useState("");
  const submit = () => {
    if (v.trim().length < 2) return;
    onAdd(v.trim());
    setV("");
  };
  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Nueva categoría…"
          className="w-full max-w-xs border-2 border-card/25 bg-transparent px-3 py-2 text-sm outline-none focus:border-ember placeholder:text-card/25"
        />
        <button
          onClick={submit}
          className="border-2 border-card/30 px-3 text-card/70 hover:border-ember hover:text-ember transition-colors"
          aria-label="Agregar categoría"
        >
          <Icon name="plus" size={16} strokeWidth={2.2} />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-card/35">sugeridas:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onAdd(s)}
              className="border border-card/20 px-2.5 py-1 text-[12px] text-card/60 transition-colors hover:border-ember hover:text-ember"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BuildScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const lines = useRef([
    "→ analizando modelo de negocio…",
    "→ definiendo catálogo, categorías y variantes…",
    `→ escribiendo textos para ${name}…`,
    "→ configurando flujo de compra y confirmaciones…",
    "→ personalizando identidad visual…",
    "→ compilando interfaz… listo ✓",
  ]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= lines.current.length) {
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), 380);
    return () => clearTimeout(t);
  }, [count, onDone, lines]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-card noise">
      <div className="tex-grid-dark absolute inset-0 pointer-events-none" />
      <div className="scanline pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-ember text-card border border-card/20 hard-sm anim-pop">
            <Icon name="hammer" size={20} />
          </span>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">Forjando “{name}”</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-card/45">generador universal · v2.4</p>
          </div>
        </div>
        <div className="mt-6 h-2 w-full border border-card/25 p-0.5">
          <div
            className="h-full bg-ember"
            style={{ width: `${(count / lines.current.length) * 100}%`, transition: "width .35s ease" }}
          />
        </div>
        <div className="mt-5 min-h-[168px] space-y-1.5 font-mono text-[12px]">
          {lines.current.slice(0, count).map((l) => (
            <p key={l} className="anim-fade-up text-card/75">
              {l.includes("listo") ? <span className="text-ember font-semibold">{l}</span> : l}
            </p>
          ))}
          {count < lines.current.length && <p className="cursor-blink text-card/40" />}
        </div>
      </div>
    </div>
  );
}
