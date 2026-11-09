import { Link } from "react-router-dom";
import { ErrorBlock, Loading } from "../components/Cards";
import { money } from "../lib/format";
import { useFetch } from "../lib/useFetch";
import { PageHead } from "./kit";

interface Dash {
  total_orders: number; paid_orders: number; revenue_cents: number; pending_orders: number;
  products_total: number; products_active: number;
  low_stock: { id: string; name: string; available: number; low_stock_threshold: number }[];
  top_products: { id: string; name: string; sold: number }[];
  sales_by_day: { day: string; orders: number; revenue_cents: number }[];
}

export default function Dashboard() {
  const { data: d, loading, error, reload } = useFetch<Dash>("/api/admin/dashboard");
  if (loading && !d) return <Loading />;
  if (error || !d) return <ErrorBlock message={error?.message ?? "Erro"} onRetry={reload} />;
  const max = Math.max(...d.sales_by_day.map((x) => x.revenue_cents), 1);
  const stats: [string, string, string?][] = [
    ["Total de pedidos", String(d.total_orders)],
    ["Vendas realizadas", String(d.paid_orders)],
    ["Faturamento", money(d.revenue_cents)],
    ["Pedidos pendentes", String(d.pending_orders), "/admin/pedidos"],
    ["Produtos cadastrados", `${d.products_total} (${d.products_active} ativos)`, "/admin/produtos"],
    ["Estoque baixo", String(d.low_stock.length)],
  ];
  return (
    <>
      <PageHead title="Resumo" />
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([k, v, to]) => (
          <div key={k} className="card p-5">
            <dt className="text-sm text-ink-2">{to ? <Link to={to} className="underline-offset-2 hover:underline">{k}</Link> : k}</dt>
            <dd className="mt-1 text-3xl font-extrabold tracking-tight">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="card mt-6 p-5" aria-labelledby="vd">
        <h2 id="vd" className="text-lg font-bold">Faturamento nos últimos 30 dias</h2>
        {d.sales_by_day.length === 0 ? <p className="mt-3 text-sm text-ink-2">Ainda não há vendas pagas no período.</p> : (
          <div className="mt-4 flex h-40 items-end gap-1.5" role="img" aria-label="Gráfico de barras do faturamento diário">
            {d.sales_by_day.map((x) => (
              <div key={x.day} className="group relative flex-1" title={`${x.day.split("-").reverse().slice(0, 2).join("/")}: ${money(x.revenue_cents)} (${x.orders} ped.)`}>
                <div className="rounded-t-[3px] bg-olive/80 group-hover:bg-olive" style={{ height: `${Math.max((x.revenue_cents / max) * 100, 3)}%` }} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="mv">
          <h2 id="mv" className="text-lg font-bold">Mais vendidos</h2>
          {d.top_products.length === 0 ? <p className="mt-3 text-sm text-ink-2">Nenhuma venda registrada ainda.</p> : (
            <ol className="mt-3 divide-y divide-line text-sm">{d.top_products.map((p) => <li key={p.id} className="flex justify-between py-2"><span>{p.name}</span><strong>{p.sold} un.</strong></li>)}</ol>
          )}
        </section>
        <section className="card p-5" aria-labelledby="eb">
          <h2 id="eb" className="text-lg font-bold">Produtos com estoque baixo</h2>
          {d.low_stock.length === 0 ? <p className="mt-3 text-sm text-ink-2">Nenhum produto com estoque baixo.</p> : (
            <ul className="mt-3 max-h-72 divide-y divide-line overflow-y-auto text-sm">
              {d.low_stock.map((p) => <li key={p.id} className="flex justify-between py-2"><span>{p.name}</span><strong className={p.available <= 0 ? "text-danger" : ""}>{p.available <= 0 ? "Sem estoque" : `${p.available} un.`}</strong></li>)}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
