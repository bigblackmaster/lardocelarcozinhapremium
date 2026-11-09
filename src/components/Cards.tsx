import { Link } from "react-router-dom";
import { money } from "../lib/format";
import type { Combo, Product } from "../lib/types";
import { useCart } from "../lib/state";

export function Price({ price, effective, installments, size = "md" }: {
  price: number | null; effective: number | null;
  installments?: Product["installments"]; size?: "md" | "lg";
}) {
  if (effective == null) return <p className="text-sm font-semibold text-ink-2">Preço em breve</p>;
  const onSale = price != null && effective < price;
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className={`${size === "lg" ? "text-3xl" : "text-lg"} font-extrabold tracking-tight`}>{money(effective)}</span>
        {onSale && <span className="text-sm text-ink-2 line-through">{money(price)}</span>}
      </p>
      {installments && installments.max > 1 && (
        <p className="mt-0.5 text-xs text-ink-2">
          {installments.interest_free && installments.value_cents
            ? `ou ${installments.max}x de ${money(installments.value_cents)} sem juros`
            : `em até ${installments.max}x`}
        </p>
      )}
    </div>
  );
}

function Media({ src, alt, badge }: { src?: string | null; alt: string; badge?: string | null }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-sand">
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
      ) : (
        <div className="grid h-full place-items-center text-sm text-ink-2">Sem imagem</div>
      )}
      {badge && <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-olive px-2 py-1 text-xs font-bold text-paper">{badge}</span>}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const out = p.stock.status === "out";
  const badge = out ? null : p.on_sale ? "Promoção" : null;
  return (
    <article className="group flex flex-col">
      <Link to={`/produto/${p.slug}`} className="block" aria-label={p.name}>
        <Media src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} badge={badge} />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-[15px] font-bold leading-snug">
          <Link to={`/produto/${p.slug}`} className="hover:text-olive">{p.name}</Link>
        </h3>
        {p.category && <p className="mt-0.5 text-xs text-ink-2">{p.category.name}</p>}
        <div className="mt-2"><Price price={p.price_cents} effective={p.effective_price_cents} installments={p.installments} /></div>
        <div className="mt-3 pt-1">
          {out ? (
            <p className="text-sm font-semibold text-ink-2">Esgotado</p>
          ) : p.purchasable ? (
            <button className="btn-ghost btn-sm w-full" onClick={() => add("product", p.id)}>Adicionar ao carrinho</button>
          ) : (
            <Link to={`/produto/${p.slug}`} className="btn-ghost btn-sm w-full">Ver detalhes</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function ComboCard({ c }: { c: Combo }) {
  const { add } = useCart();
  return (
    <article className="group flex flex-col">
      <Link to={`/combo/${c.slug}`} aria-label={c.name}>
        <Media src={c.image_url} alt={c.name} badge={c.savings_cents ? `Economize ${money(c.savings_cents)}` : null} />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-lg font-bold leading-snug"><Link to={`/combo/${c.slug}`} className="hover:text-olive">{c.name}</Link></h3>
        <p className="mt-1 text-sm text-ink-2">{c.items.map((i) => (i.quantity > 1 ? `${i.quantity}× ` : "") + i.name).join(", ")}</p>
        <div className="mt-2"><Price price={c.price_cents} effective={c.effective_price_cents} /></div>
        <div className="mt-3">
          {c.purchasable && c.available > 0 ? (
            <button className="btn-primary btn-sm w-full" onClick={() => add("combo", c.id)}>Adicionar combo</button>
          ) : (
            <Link to={`/combo/${c.slug}`} className="btn-ghost btn-sm w-full">{c.purchasable ? "Indisponível" : "Ver combo"}</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function Loading({ label = "Carregando…" }: { label?: string }) {
  return <p role="status" className="py-24 text-center text-ink-2">{label}</p>;
}
export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="container-x py-24 text-center">
      <p className="font-semibold">{message}</p>
      {onRetry && <button className="btn-ghost mt-4" onClick={onRetry}>Tentar novamente</button>}
    </div>
  );
}
export function Empty({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="py-20 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-md text-ink-2">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
