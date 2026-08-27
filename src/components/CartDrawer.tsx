import { useEffect } from "react";
import type { CartLine } from "../lib/types";
import { fmtPrice } from "../lib/types";
import { Icon } from "./Icons";
import { ItemVisual } from "./ItemVisual";

export function CartDrawer({
  open,
  lines,
  onClose,
  onQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQty: (idx: number, delta: number) => void;
  onRemove: (idx: number) => void;
  onCheckout: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = lines.reduce((a, l) => a + (l.item.price ?? 0) * l.qty, 0);

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-ink/70" onClick={onClose} aria-label="Cerrar carrito" />
      <aside className="anim-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink bg-card px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink3">Tu carrito</p>
            <h3 className="font-display text-xl font-extrabold tracking-tight">
              {lines.length === 0 ? "Carrito vacío" : `${lines.reduce((a, l) => a + l.qty, 0)} elemento${lines.reduce((a, l) => a + l.qty, 0) !== 1 ? "s" : ""}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper transition-all hover:bg-ember hover:text-white"
            aria-label="Cerrar"
          >
            <Icon name="x" size={16} strokeWidth={2.2} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="anim-floaty flex h-16 w-16 items-center justify-center border-2 border-ink bg-card hard-sm">
              <Icon name="cart" size={28} className="text-ink3" />
            </span>
            <p className="mt-5 font-display text-lg font-bold">Aún no agregas nada</p>
            <p className="mt-1.5 text-sm text-ink3">Explora el catálogo y toca “Agregar al carrito” en lo que te guste.</p>
            <button
              onClick={onClose}
              className="lift mt-6 border-2 border-ink bg-brand px-5 py-2.5 font-display text-sm font-bold hard-xs"
              style={{ color: "var(--brand-ink)" }}
            >
              Seguir explorando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l, i) => (
                <li key={`${l.item.id}-${l.variant ?? ""}`} className="anim-fade-up flex gap-3 py-4">
                  <ItemVisual item={l.item} compact className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-display text-sm font-bold leading-snug">{l.item.name}</p>
                      <button onClick={() => onRemove(i)} className="text-ink3/60 transition-colors hover:text-ember" aria-label="Eliminar">
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                    {l.variant && <p className="font-mono text-[10px] uppercase tracking-widest text-ink3">{l.variant}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border-2 border-ink bg-card">
                        <button onClick={() => onQty(i, -1)} className="px-2.5 py-1 transition-colors hover:bg-brand-soft" aria-label="Menos">
                          <Icon name="minus" size={12} strokeWidth={2.6} />
                        </button>
                        <span className="w-7 text-center font-display text-sm font-bold">{l.qty}</span>
                        <button onClick={() => onQty(i, 1)} className="px-2.5 py-1 transition-colors hover:bg-brand-soft" aria-label="Más">
                          <Icon name="plus" size={12} strokeWidth={2.6} />
                        </button>
                      </div>
                      <p className="font-display text-sm font-extrabold">{fmtPrice((l.item.price ?? 0) * l.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-ink bg-card p-5">
              <div className="space-y-1 font-mono text-[12px]">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-display text-lg font-extrabold">{fmtPrice(subtotal)}</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-ink3">
                  {subtotal >= 999 ? "Envío gratis aplicado ✓" : "Envío gratis en pedidos desde $999"}
                </p>
              </div>
              <button
                onClick={onCheckout}
                className="lift mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink bg-brand px-5 py-3.5 font-display text-base font-extrabold hard-sm"
                style={{ color: "var(--brand-ink)" }}
              >
                Ir al checkout <Icon name="arrowRight" size={17} strokeWidth={2.2} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
