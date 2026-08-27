import { useEffect, useState, type ReactNode } from "react";
import type { CartLine, CatalogItem } from "../lib/types";
import { TYPE_LABEL, fmtPrice, orderCode } from "../lib/types";
import { Icon } from "./Icons";
import { ItemVisual } from "./ItemVisual";

function ModalShell({ onClose, children, wide = false }: { onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button className="absolute inset-0 bg-ink/70" onClick={onClose} aria-label="Cerrar" />
      <div
        className={`anim-sheet relative max-h-[92vh] w-full overflow-y-auto border-2 border-ink bg-paper shadow-[8px_8px_0_0_rgba(23,27,21,0.9)] sm:m-4 ${
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHead({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-ink bg-card px-5 py-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink3">{sub}</p>
        <h3 className="mt-0.5 font-display text-xl font-extrabold tracking-tight">{title}</h3>
      </div>
      <button
        onClick={onClose}
        className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-paper transition-all hover:bg-ember hover:text-white active:translate-y-0.5"
        aria-label="Cerrar"
      >
        <Icon name="x" size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}

/* ---------------- item details ---------------- */
export function ItemDetailsModal({
  item,
  showOpiniones,
  showVariants,
  usesCart,
  onClose,
  onCta,
}: {
  item: CatalogItem;
  showOpiniones: boolean;
  showVariants: boolean;
  usesCart: boolean;
  onClose: () => void;
  onCta: (item: CatalogItem, qty: number, variant?: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState<Record<string, string>>(() =>
    Object.fromEntries((item.variants ?? []).map((v) => [v.name, v.options[0]]))
  );
  const variantStr = Object.values(sel).join(" · ") || undefined;
  const needsQty = usesCart && item.type !== "digital" && item.price !== null && item.type !== "quote" && item.type !== "booking";
  const ctaLabel =
    item.type === "booking"
      ? "Reservar este servicio"
      : item.type === "quote" || item.price === null
        ? "Solicitar cotización"
        : item.type === "digital"
          ? `Comprar ahora · ${fmtPrice(item.price)}`
          : needsQty
            ? `Agregar ${qty > 1 ? `×${qty}` : ""} al carrito`
            : "Contratar";

  return (
    <ModalShell onClose={onClose} wide>
      <div className="grid sm:grid-cols-[280px_1fr]">
        <div className="p-4 sm:p-5">
          <ItemVisual item={item} className="aspect-square w-full" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="border border-ink/30 bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink3">
                #{t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-5 sm:pl-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink3">
                {item.category} · {TYPE_LABEL[item.type]}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{item.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-card transition-all hover:bg-ember hover:text-white"
              aria-label="Cerrar"
            >
              <Icon name="x" size={15} strokeWidth={2.2} />
            </button>
          </div>
          {showOpiniones && item.reviews > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink3">
              <span className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon key={s} name="star" size={14} filled={s <= Math.round(item.rating)} className={s <= Math.round(item.rating) ? "" : "opacity-30"} />
                ))}
              </span>
              <strong className="text-ink">{item.rating.toFixed(1)}</strong> · {item.reviews} opiniones verificadas
            </p>
          )}
          <p className="mt-3 text-[15px] leading-relaxed text-ink2">{item.description}</p>

          {(item.duration || item.seller) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.duration && (
                <span className="flex items-center gap-1.5 border-2 border-ink bg-card px-2.5 py-1 text-[12px] font-semibold hard-xs">
                  <Icon name="clock" size={13} /> {item.duration}
                </span>
              )}
              {item.seller && (
                <span className="flex items-center gap-1.5 border-2 border-ink bg-card px-2.5 py-1 text-[12px] font-semibold hard-xs">
                  <Icon name="user" size={13} /> {item.seller}
                </span>
              )}
            </div>
          )}

          {showVariants && item.variants?.map((v) => (
            <div key={v.name} className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">
                {v.name}: <strong className="text-ink">{sel[v.name]}</strong>
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {v.options.map((o) => (
                  <button
                    key={o}
                    onClick={() => setSel((p) => ({ ...p, [v.name]: o }))}
                    className={`border-2 px-3 py-1.5 text-[13px] font-semibold transition-all ${
                      sel[v.name] === o ? "border-ink bg-ink text-card hard-xs" : "border-ink/25 bg-card hover:border-ink"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-auto pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-4">
              <p className={`font-display text-2xl font-extrabold ${item.price === null ? "text-brand" : ""}`}>{fmtPrice(item.price)}</p>
              {needsQty && (
                <div className="flex items-center border-2 border-ink bg-card">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 transition-colors hover:bg-brand-soft" aria-label="Menos">
                    <Icon name="minus" size={14} strokeWidth={2.4} />
                  </button>
                  <span className="w-8 text-center font-display font-bold">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="px-3 py-2 transition-colors hover:bg-brand-soft" aria-label="Más">
                    <Icon name="plus" size={14} strokeWidth={2.4} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onCta(item, qty, variantStr)}
              className="lift mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink bg-brand px-5 py-3.5 font-display text-base font-extrabold hard-sm"
              style={{ color: "var(--brand-ink)" }}
            >
              {ctaLabel}
              <Icon name="arrowRight" size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------------- booking ---------------- */
function nextDays(n: number) {
  const out: { key: string; label: string; weekday: string }[] = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: `${d.getDate()} ${d.toLocaleDateString("es-MX", { month: "short" })}`,
      weekday: d.toLocaleDateString("es-MX", { weekday: "short" }),
    });
  }
  return out;
}

const SLOTS = ["09:00", "10:30", "12:00", "13:30", "16:00", "17:30", "19:00"];

export function BookingModal({
  item,
  business,
  onClose,
  onDone,
}: {
  item: CatalogItem;
  business: string;
  onClose: () => void;
  onDone: (code: string) => void;
}) {
  const days = nextDays(12);
  const [day, setDay] = useState(days[1].key);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const valid = name.trim().length >= 2 && phone.trim().length >= 7 && !!slot;
  const selDay = days.find((d) => d.key === day)!;

  return (
    <ModalShell onClose={onClose}>
      {done ? (
        <SuccessPanel
          code={done}
          title="¡Cita confirmada!"
          lines={[
            `${item.name} — ${selDay.weekday} ${selDay.label}, ${slot} h`,
            `Te esperamos en ${business}. Enviamos el recordatorio a tu teléfono (simulado).`,
          ]}
          onClose={onClose}
        />
      ) : (
        <>
          <ModalHead title={`Reservar: ${item.name}`} sub={`${business} · agenda en línea`} onClose={onClose} />
          <div className="space-y-5 p-5">
            <div className="flex items-center gap-3 border-2 border-ink bg-card p-3 hard-xs">
              <ItemVisual item={item} compact className="h-14 w-14 shrink-0" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold">{item.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">
                  {item.duration ?? "60 min"} · {fmtPrice(item.price)}
                </p>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">1 · Elige el día</p>
              <div className="mt-2 grid grid-cols-6 gap-1.5">
                {days.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDay(d.key)}
                    className={`border-2 py-1.5 text-center transition-all ${
                      day === d.key ? "border-ink bg-ink text-card" : "border-ink/20 bg-card hover:border-ink"
                    }`}
                  >
                    <span className="block font-mono text-[9px] uppercase">{d.weekday}</span>
                    <span className="block font-display text-[12px] font-bold leading-tight">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">2 · Elige la hora</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SLOTS.map((s) => {
                  const taken = (item.name.length + s.charCodeAt(1)) % 5 === 0;
                  return (
                    <button
                      key={s}
                      disabled={taken}
                      onClick={() => setSlot(s)}
                      className={`border-2 px-3.5 py-1.5 font-mono text-[12px] font-semibold transition-all ${
                        taken
                          ? "cursor-not-allowed border-ink/10 text-ink3/40 line-through"
                          : slot === s
                            ? "border-ink bg-brand text-white hard-xs"
                            : "border-ink/25 bg-card hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">3 · Tu nombre</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ana Torres"
                  className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 text-sm outline-none focus:hard-xs"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Teléfono</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s+]/g, ""))}
                  placeholder="55 0000 0000"
                  className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 text-sm outline-none focus:hard-xs"
                />
              </label>
            </div>
            <button
              disabled={!valid}
              onClick={() => setDone(orderCode("CITA"))}
              className="lift w-full border-2 border-ink bg-brand px-5 py-3.5 font-display text-base font-extrabold hard-sm disabled:opacity-35 disabled:shadow-none"
              style={{ color: "var(--brand-ink)" }}
            >
              Confirmar reserva {item.price !== null && `· ${fmtPrice(item.price)}`}
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ---------------- quote ---------------- */
export function QuoteModal({
  item,
  business,
  onClose,
  onDone,
}: {
  item: CatalogItem;
  business: string;
  onClose: () => void;
  onDone: (code: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const valid = name.trim().length >= 2 && /.+@.+\..+/.test(email);

  return (
    <ModalShell onClose={onClose}>
      {done ? (
        <SuccessPanel
          code={done}
          title="Solicitud recibida"
          lines={[
            `El equipo de ${business} preparará tu cotización de “${item.name}”.`,
            "Recibirás la propuesta por correo en menos de 24 horas (simulado).",
          ]}
          onClose={onClose}
        />
      ) : (
        <>
          <ModalHead title="Solicitar cotización" sub={`${business} · respuesta en 24 h`} onClose={onClose} />
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3 border-2 border-ink bg-card p-3 hard-xs">
              <ItemVisual item={item} compact className="h-14 w-14 shrink-0" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold">{item.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">{item.category} · precio por proyecto</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Nombre *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Torres" className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 text-sm outline-none focus:hard-xs" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Correo *</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@correo.com" className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 text-sm outline-none focus:hard-xs" />
              </label>
            </div>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Cuéntanos de tu proyecto</span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                placeholder="Medidas, materiales, ubicación, fechas… cualquier detalle ayuda a cotizar mejor."
                className="mt-1.5 w-full resize-none border-2 border-ink bg-card px-3 py-2.5 text-sm outline-none focus:hard-xs"
              />
            </label>
            <button
              disabled={!valid}
              onClick={() => setDone(orderCode("COT"))}
              className="lift w-full border-2 border-ink bg-brand px-5 py-3.5 font-display text-base font-extrabold hard-sm disabled:opacity-35 disabled:shadow-none"
              style={{ color: "var(--brand-ink)" }}
            >
              Enviar solicitud de cotización
            </button>
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink3">Sin costo ni compromiso</p>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ---------------- checkout ---------------- */
export function CheckoutModal({
  lines,
  business,
  archetypeId,
  onClose,
  onDone,
}: {
  lines: CartLine[];
  business: string;
  archetypeId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");
  const [code, setCode] = useState("");
  const physical = archetypeId === "fisica" || archetypeId === "marketplace" || archetypeId === "restaurante" || archetypeId === "mixto";
  const digital = archetypeId === "digital";
  const subtotal = lines.reduce((a, l) => a + (l.item.price ?? 0) * l.qty, 0);
  const shipping = physical && subtotal > 0 ? (subtotal >= 999 ? 0 : 89) : 0;
  const total = subtotal + shipping;
  const prefix = archetypeId === "restaurante" ? "PED" : digital ? "ACC" : "ORD";
  const payValid = card.replace(/\s/g, "").length >= 15 && holder.trim().length >= 3 && exp.length >= 4 && cvc.length >= 3;

  const pay = () => {
    setCode(orderCode(prefix));
    setStep(2);
  };

  return (
    <ModalShell onClose={step === 2 ? onDone : onClose} wide={step === 0}>
      {step === 2 ? (
        <SuccessPanel
          code={code}
          title={digital ? "¡Acceso activado!" : archetypeId === "restaurante" ? "¡Pedido confirmado!" : "¡Pago confirmado!"}
          lines={
            digital
              ? [`Tu compra de ${business} está lista. Enviamos los enlaces de descarga a tu correo (simulado).`]
              : archetypeId === "restaurante"
                ? [`Tu pedido de ${business} entra a cocina. Tiempo estimado: 35–45 min.`, "Te avisaremos cuando el repartidor salga (simulado)."]
                : [`Gracias por comprar en ${business}. Tu pedido se está preparando.`, "Recibirás la guía de envío por correo (simulado)."]
          }
          onClose={onDone}
        />
      ) : (
        <>
          <ModalHead
            title={step === 0 ? "Revisa tu pedido" : "Pago seguro (simulado)"}
            sub={`${business} · paso ${step + 1} de 2`}
            onClose={onClose}
          />
          {/* steps */}
          <div className="flex gap-1 border-b border-line px-5 pt-3">
            {["Resumen", "Pago"].map((s, i) => (
              <span
                key={s}
                className={`border-b-2 px-3 pb-2 font-mono text-[11px] uppercase tracking-widest ${
                  step === i ? "border-brand text-brand" : "border-transparent text-ink3/50"
                }`}
              >
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <div className="p-5">
            {step === 0 && (
              <>
                <ul className="divide-y divide-line border-2 border-ink bg-card">
                  {lines.map((l, i) => (
                    <li key={i} className="flex items-center gap-3 p-3">
                      <ItemVisual item={l.item} compact className="h-12 w-12 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-bold">{l.item.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">
                          {l.variant ? `${l.variant} · ` : ""}×{l.qty}
                        </p>
                      </div>
                      <p className="font-display text-sm font-extrabold">{fmtPrice((l.item.price ?? 0) * l.qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1.5 border-2 border-ink bg-card p-4 font-mono text-[12px]">
                  <p className="flex justify-between"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></p>
                  {physical && (
                    <p className="flex justify-between text-ink3">
                      <span>Envío {shipping === 0 && subtotal > 0 && "· gratis desde $999"}</span>
                      <span>{shipping === 0 ? "—" : fmtPrice(shipping)}</span>
                    </p>
                  )}
                  <p className="flex justify-between border-t-2 border-ink pt-2 font-display text-base font-extrabold">
                    <span>Total</span>
                    <span>{fmtPrice(total)}</span>
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="lift mt-4 w-full border-2 border-ink bg-brand px-5 py-3.5 font-display text-base font-extrabold hard-sm"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Continuar al pago →
                </button>
              </>
            )}
            {step === 1 && (
              <>
                <div className="grid gap-3">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Titular de la tarjeta</span>
                    <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="ANA TORRES" className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 text-sm uppercase outline-none focus:hard-xs" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Número de tarjeta</span>
                    <div className="relative mt-1.5">
                      <input
                        value={card}
                        onChange={(e) => setCard(e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        className="w-full border-2 border-ink bg-card px-3 py-2.5 pr-10 font-mono text-sm outline-none focus:hard-xs"
                      />
                      <Icon name="card" size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink3" />
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">Vencimiento</span>
                      <input
                        value={exp}
                        onChange={(e) => setExp(e.target.value.replace(/[^\d]/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/"))}
                        placeholder="12/28"
                        inputMode="numeric"
                        className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 font-mono text-sm outline-none focus:hard-xs"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">CVC</span>
                      <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, "").slice(0, 4))} placeholder="123" inputMode="numeric" className="mt-1.5 w-full border-2 border-ink bg-card px-3 py-2.5 font-mono text-sm outline-none focus:hard-xs" />
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border border-ink/20 bg-card px-3 py-2.5">
                  <Icon name="check" size={14} className="text-pine" strokeWidth={2.4} />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">Demo: no se procesa ningún cargo real</p>
                </div>
                <div className="mt-4 flex gap-2.5">
                  <button onClick={() => setStep(0)} className="border-2 border-ink bg-card px-4 py-3 font-display text-sm font-bold transition-all hover:hard-xs">
                    ← Volver
                  </button>
                  <button
                    disabled={!payValid}
                    onClick={pay}
                    className="lift flex-1 border-2 border-ink bg-brand px-5 py-3 font-display text-base font-extrabold hard-sm disabled:opacity-35 disabled:shadow-none"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Pagar {fmtPrice(total)}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ---------------- shared ---------------- */
function SuccessPanel({ code, title, lines, onClose }: { code: string; title: string; lines: string[]; onClose: () => void }) {
  return (
    <div className="p-8 text-center">
      <span className="anim-pop mx-auto flex h-16 w-16 items-center justify-center border-2 border-ink bg-pine text-card hard-sm">
        <Icon name="check" size={30} strokeWidth={2.6} />
      </span>
      <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink2">{lines[0]}</p>
      {lines[1] && <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink3">{lines[1]}</p>}
      <div className="mx-auto mt-6 w-fit border-2 border-dashed border-ink bg-card px-6 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink3">Código de confirmación</p>
        <p className="font-display text-2xl font-extrabold tracking-widest text-brand">{code}</p>
      </div>
      <button
        onClick={onClose}
        className="lift mx-auto mt-6 block border-2 border-ink bg-ink px-6 py-3 font-display text-sm font-bold text-card hard-xs hover:bg-brand"
      >
        Volver a la tienda
      </button>
    </div>
  );
}

export function Toast({ msg }: { msg: string }) {
  return (
    <div className="anim-sheet pointer-events-auto flex items-center gap-2.5 border-2 border-ink bg-ink px-4 py-3 text-card shadow-[4px_4px_0_0_rgba(23,27,21,0.35)]">
      <span className="flex h-5 w-5 items-center justify-center bg-ember text-card">
        <Icon name="check" size={12} strokeWidth={3} />
      </span>
      <p className="font-display text-sm font-semibold">{msg}</p>
    </div>
  );
}
