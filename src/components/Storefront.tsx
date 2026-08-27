import { useEffect, useMemo, useState } from "react";
import { brandColors, getArchetype, resolveItems, type Archetype } from "../lib/archetypes";
import type { AppConfig, CartLine, CatalogItem, FeatureId, ItemType } from "../lib/types";
import { TYPE_LABEL, fmtPrice } from "../lib/types";
import { Icon, type IconName } from "./Icons";
import { ItemVisual } from "./ItemVisual";
import { BookingModal, CheckoutModal, ItemDetailsModal, QuoteModal, Toast } from "./Modals";
import { CartDrawer } from "./CartDrawer";

const CTA_LABEL: Record<ItemType, string> = {
  product: "Agregar al carrito",
  digital: "Comprar ahora",
  service: "Contratar",
  booking: "Reservar",
  quote: "Solicitar cotización",
};
const CTA_ICON: Record<ItemType, IconName> = {
  product: "cart",
  digital: "bolt",
  service: "briefcase",
  booking: "calendar",
  quote: "draft",
};

export default function Storefront({
  config,
  onEdit,
}: {
  config: AppConfig;
  onEdit: () => void;
}) {
  const arch: Archetype = getArchetype(config.archetypeId);
  const items = useMemo(() => resolveItems(config), [config]);
  const bc = brandColors(arch.hue);
  const has = (f: FeatureId) => config.features.includes(f);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [sort, setSort] = useState("destacados");
  const [typeFilter, setTypeFilter] = useState<ItemType | "todos">("todos");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [favs, setFavs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`forja-favs:${config.businessName}`) ?? "[]");
    } catch {
      return [];
    }
  });
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<CatalogItem | null>(null);
  const [booking, setBooking] = useState<CatalogItem | null>(null);
  const [quoting, setQuoting] = useState<CatalogItem | null>(null);
  const [checkout, setCheckout] = useState<CartLine[] | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(`forja-favs:${config.businessName}`, JSON.stringify(favs));
    } catch {
      /* noop */
    }
  }, [favs, config.businessName]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length, category, typeFilter, query, onlyFavs, sort]);

  const toast = (msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const toggleFav = (id: string) => {
    setFavs((p) => {
      const on = p.includes(id);
      toast(on ? "Quitado de favoritos" : "Guardado en favoritos ♥");
      return on ? p.filter((x) => x !== id) : [...p, id];
    });
  };

  const addToCart = (item: CatalogItem, qty = 1, variant?: string) => {
    setCart((p) => {
      const key = `${item.id}|${variant ?? ""}`;
      const found = p.find((l) => `${l.item.id}|${l.variant ?? ""}` === key);
      if (found) return p.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
      return [...p, { item, qty, variant }];
    });
    toast(`“${item.name}” en el carrito`);
  };

  const primaryCta = (item: CatalogItem) => {
    if (item.type === "booking") return setBooking(item);
    if (item.type === "quote") return setQuoting(item);
    if (item.price === null) return setQuoting(item);
    if (has("carrito") && item.type !== "digital") return addToCart(item);
    setCheckout([{ item, qty: 1 }]);
  };

  const typesPresent = useMemo(() => Array.from(new Set(items.map((i) => i.type))), [items]);

  const visible = useMemo(() => {
    let list = [...items];
    if (category !== "todas") list = list.filter((i) => i.category === category);
    if (typeFilter !== "todos") list = list.filter((i) => i.type === typeFilter);
    if (onlyFavs) list = list.filter((i) => favs.includes(i.id));
    const q = query.trim().toLowerCase();
    if (q)
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    if (sort === "precio-asc") list.sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
    if (sort === "precio-desc") list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "destacados") list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    return list;
  }, [items, category, typeFilter, onlyFavs, favs, query, sort]);

  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  const usesCart = has("carrito") && typesPresent.some((t) => t === "product" || t === "digital" || t === "service");

  return (
    <div className="min-h-screen bg-paper text-ink" style={{ ["--brand" as string]: bc.brand, ["--brand-soft" as string]: bc.brandSoft, ["--brand-ink" as string]: bc.brandInk }}>
      {/* config ribbon */}
      <div className="bg-ink text-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-card/60">
            <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-dot" />
            app generada · {arch.label} · demo funcional
          </p>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 border border-card/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-ember hover:text-ember"
          >
            <Icon name="pencil" size={12} /> Editar configuración
          </button>
        </div>
      </div>

      {/* header */}
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink font-display text-xl font-extrabold hard-xs"
              style={{ background: bc.brand, color: bc.brandInk }}
            >
              {config.businessName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-lg font-extrabold tracking-tight sm:text-xl">{config.businessName}</p>
              <p className="hidden truncate font-mono text-[10px] uppercase tracking-[0.18em] text-ink3 sm:block">
                {arch.itemTypes.map((t) => TYPE_LABEL[t]).join(" · ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {has("busqueda") && (
              <label className="relative hidden md:block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3">
                  <Icon name="search" size={15} />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Buscar en ${config.businessName}…`}
                  className="w-56 border-2 border-ink bg-card py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-ink3/60 focus:w-72 focus:hard-xs"
                />
              </label>
            )}
            {has("favoritos") && (
              <button
                onClick={() => setOnlyFavs((v) => !v)}
                aria-label="Ver favoritos"
                className={`relative flex h-10 w-10 items-center justify-center border-2 border-ink transition-all lift ${
                  onlyFavs ? "bg-ember text-white" : "bg-card"
                }`}
              >
                <Icon name="heart" size={17} filled={onlyFavs} />
                {favs.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center border border-ink bg-gold px-1 font-mono text-[10px] font-bold anim-pop">
                    {favs.length}
                  </span>
                )}
              </button>
            )}
            {usesCart && (
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Abrir carrito"
                className="lift relative flex h-10 items-center gap-2 border-2 border-ink bg-ink px-3.5 text-card"
              >
                <Icon name="cart" size={17} />
                <span className="hidden font-display text-sm font-bold sm:block">Carrito</span>
                {cartCount > 0 && (
                  <span key={cartCount} className="flex h-5 min-w-5 items-center justify-center border border-ink bg-ember px-1 font-mono text-[10px] font-bold anim-pop">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* intro band */}
      <section className="relative border-b-2 border-ink overflow-hidden" style={{ background: bc.brandSoft }}>
        <div className="tex-dots absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 py-10 sm:py-14">
          <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="anim-fade-up">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink3">{arch.flowLabel}</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl">
                {config.businessName}
                <span className="text-brand">.</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-ink2 sm:text-lg">{arch.tagline}</p>
            </div>
            <div className="anim-fade-up flex flex-wrap gap-2 lg:justify-end" style={{ animationDelay: "120ms" }}>
              {[
                { k: "elementos", v: items.length },
                { k: "categorías", v: config.categories.length },
                { k: "funciones", v: config.features.length },
              ].map((s) => (
                <div key={s.k} className="border-2 border-ink bg-card px-4 py-2.5 hard-xs lift">
                  <p className="font-display text-2xl font-extrabold leading-none">{s.v}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink3">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
          {has("categorias") && (
            <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
              <CatChip label="Todas" count={items.length} active={category === "todas"} onClick={() => setCategory("todas")} />
              {config.categories.map((c) => {
                const count = items.filter((i) => i.category === c).length;
                if (count === 0) return null;
                return <CatChip key={c} label={c} count={count} active={category === c} onClick={() => setCategory(c)} />;
              })}
            </div>
          )}
        </div>
      </section>

      {/* toolbar */}
      <div className="border-b border-line bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2.5 px-5 py-3">
          {has("busqueda") && (
            <label className="relative md:hidden">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3">
                <Icon name="search" size={14} />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="w-full border-2 border-ink bg-card py-1.5 pl-8 pr-3 text-sm outline-none"
              />
            </label>
          )}
          <p className="mr-auto font-mono text-[11px] uppercase tracking-widest text-ink3">
            {visible.length} resultado{visible.length !== 1 ? "s" : ""}
            {onlyFavs && " · favoritos"}
          </p>
          {has("filtros") && typesPresent.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              <TypeChip label="Todos" active={typeFilter === "todos"} onClick={() => setTypeFilter("todos")} />
              {typesPresent.map((t) => (
                <TypeChip key={t} label={TYPE_LABEL[t]} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
              ))}
            </div>
          )}
          {has("filtros") && (
            <label className="flex items-center gap-2">
              <Icon name="sliders" size={14} className="text-ink3" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border-2 border-ink bg-card px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider outline-none"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio ↑</option>
                <option value="precio-desc">Precio ↓</option>
                {has("opiniones") && <option value="rating">Mejor valorados</option>}
              </select>
            </label>
          )}
        </div>
      </div>

      {/* grid */}
      <main className="mx-auto max-w-6xl px-5 py-10">
        {visible.length === 0 ? (
          <div className="anim-fade-up mx-auto max-w-md border-2 border-dashed border-ink/30 p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-ink bg-card hard-xs">
              <Icon name={onlyFavs ? "heart" : "search"} size={24} className="text-ink3" />
            </span>
            <p className="mt-4 font-display text-xl font-bold">
              {onlyFavs ? "Aún no guardas favoritos" : "Nada por aquí"}
            </p>
            <p className="mt-1.5 text-sm text-ink3">
              {onlyFavs
                ? `Toca el corazón en cualquier elemento de ${config.businessName} para guardarlo.`
                : "Prueba con otra búsqueda o limpia los filtros activos."}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("todas");
                setTypeFilter("todos");
                setOnlyFavs(false);
              }}
              className="lift mx-auto mt-5 border-2 border-ink bg-ember px-4 py-2 font-display text-sm font-bold hard-xs"
              style={{ color: bc.brandInk }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, i) => (
              <CatalogItemCard
                key={item.id}
                item={item}
                index={i}
                showOpiniones={has("opiniones")}
                showFav={has("favoritos")}
                fav={favs.includes(item.id)}
                onFav={() => toggleFav(item.id)}
                onOpen={() => setDetail(item)}
                onCta={() => primaryCta(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* flow strip */}
      <section className="border-t-2 border-ink bg-ink text-card">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-card/45">Tu recorrido, paso a paso</p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">{arch.flowLabel}</p>
            </div>
            <button
              onClick={onEdit}
              className="lift border-2 border-card/40 px-4 py-2.5 font-display text-sm font-bold text-card hover:border-ember hover:text-ember"
            >
              Reconfigurar app →
            </button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {arch.flow.map((f, i) => (
              <span key={f} className="flex items-center gap-2">
                <span className="flex items-center gap-2 border-2 border-card/25 bg-card/5 px-3.5 py-2 font-display text-sm font-semibold">
                  <span className="font-mono text-[10px] text-ember">{String(i + 1).padStart(2, "0")}</span>
                  {f}
                </span>
                {i < arch.flow.length - 1 && <Icon name="arrowRight" size={14} className="text-ember" />}
              </span>
            ))}
          </div>
          <p className="mt-8 border-t border-card/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-card/35">
            Generada con FORJA · catálogo adaptable · pagos y reservas simulados
          </p>
        </div>
      </section>

      {/* overlays */}
      {detail && (
        <ItemDetailsModal
          item={detail}
          showOpiniones={has("opiniones")}
          showVariants={has("variantes")}
          usesCart={usesCart}
          onClose={() => setDetail(null)}
          onCta={(item, qty, variant) => {
            setDetail(null);
            if (item.type === "booking") return setBooking(item);
            if (item.type === "quote" || item.price === null) return setQuoting(item);
            if (usesCart && item.type !== "digital") return addToCart(item, qty, variant);
            setCheckout([{ item, qty, variant }]);
          }}
        />
      )}
      {booking && <BookingModal item={booking} business={config.businessName} onClose={() => setBooking(null)} onDone={(code) => { setBooking(null); toast(`Reserva ${code} confirmada ✓`); }} />}
      {quoting && <QuoteModal item={quoting} business={config.businessName} onClose={() => setQuoting(null)} onDone={(code) => { setQuoting(null); toast(`Solicitud ${code} enviada ✓`); }} />}
      {checkout && (
        <CheckoutModal
          lines={checkout}
          business={config.businessName}
          archetypeId={config.archetypeId}
          onClose={() => setCheckout(null)}
          onDone={() => {
            setCheckout(null);
            setCart([]);
          }}
        />
      )}
      {usesCart && (
        <CartDrawer
          open={cartOpen}
          lines={cart}
          onClose={() => setCartOpen(false)}
          onQty={(idx, d) =>
            setCart((p) =>
              p
                .map((l, i) => (i === idx ? { ...l, qty: l.qty + d } : l))
                .filter((l) => l.qty > 0)
            )
          }
          onRemove={(idx) => setCart((p) => p.filter((_, i) => i !== idx))}
          onCheckout={() => {
            if (cart.length === 0) return;
            setCartOpen(false);
            setCheckout(cart);
          }}
        />
      )}

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-[90] space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t.msg} />
        ))}
      </div>
    </div>
  );
}

function CatChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 border-2 px-3.5 py-2 font-display text-sm font-semibold transition-all lift ${
        active ? "border-ink bg-ink text-card hard-xs" : "border-ink/25 bg-card/70 hover:border-ink"
      }`}
    >
      {label}
      <span className={`font-mono text-[10px] ${active ? "text-ember" : "text-ink3"}`}>{count}</span>
    </button>
  );
}

function TypeChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-all ${
        active ? "border-ink bg-brand text-white" : "border-ink/25 bg-card text-ink3 hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function CatalogItemCard({
  item,
  index,
  showOpiniones,
  showFav,
  fav,
  onFav,
  onOpen,
  onCta,
}: {
  item: CatalogItem;
  index: number;
  showOpiniones: boolean;
  showFav: boolean;
  fav: boolean;
  onFav: () => void;
  onOpen: () => void;
  onCta: () => void;
}) {
  return (
    <article
      data-reveal
      className="reveal group flex flex-col border-2 border-ink bg-card transition-all duration-200 hover:-translate-y-1.5 hover:hard"
      style={{ transitionDelay: `${(index % 9) * 40}ms` }}
    >
      <button onClick={onOpen} className="relative block cursor-pointer" aria-label={`Ver ${item.name}`}>
        <ItemVisual item={item} index={index} className="aspect-[4/3] w-full" />
        <span className="absolute left-2.5 top-2.5 border border-ink bg-card px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest">
          {TYPE_LABEL[item.type]}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3">{item.category}</p>
          {showFav && (
            <button
              onClick={onFav}
              aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
              className={`-mr-1 -mt-1 p-1 transition-all hover:scale-110 active:scale-90 ${fav ? "text-ember" : "text-ink3/60 hover:text-ember"}`}
            >
              <Icon name="heart" size={17} filled={fav} />
            </button>
          )}
        </div>
        <button onClick={onOpen} className="mt-1 text-left">
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-brand">
            {item.name}
          </h3>
        </button>
        {showOpiniones && item.reviews > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink3">
            <Icon name="star" size={13} className="text-gold" filled />
            <strong className="text-ink">{item.rating.toFixed(1)}</strong>· {item.reviews} opiniones
          </p>
        )}
        {(item.duration || item.seller) && (
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink3">
            <Icon name={item.duration ? "clock" : "user"} size={13} />
            {item.duration ?? item.seller}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className={`font-display text-xl font-extrabold tracking-tight ${item.price === null ? "text-brand" : ""}`}>
            {fmtPrice(item.price)}
          </p>
          <button
            onClick={onCta}
            className="lift flex items-center gap-1.5 border-2 border-ink bg-brand px-3 py-2 font-display text-[13px] font-bold hard-xs"
            style={{ color: "var(--brand-ink)" }}
          >
            <Icon name={CTA_ICON[item.type]} size={14} strokeWidth={2} />
            {item.price === null && item.type !== "quote" ? "Cotizar" : CTA_LABEL[item.type]}
          </button>
        </div>
      </div>
    </article>
  );
}
