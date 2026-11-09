import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { whatsappLink } from "../lib/format";
import { useCart, useStore } from "../lib/state";
import { BagIcon, CloseIcon, Logo, MenuIcon, SearchIcon } from "./Icons";
import Newsletter from "./Newsletter";

function Header() {
  const { data } = useStore();
  const { count } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    nav(term ? `/produtos?q=${encodeURIComponent(term)}` : "/produtos");
    setOpen(false);
  };

  const link = ({ isActive }: { isActive: boolean }) =>
    `py-2 text-[15px] font-semibold transition-colors hover:text-olive ${isActive ? "text-olive" : "text-ink"}`;

  const search = (
    <form onSubmit={submit} role="search" className="relative w-full">
      <label htmlFor="busca" className="sr-only">Buscar produtos</label>
      <input id="busca" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar produtos" className="field !min-h-10 pr-10" />
      <button type="submit" aria-label="Buscar" className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-ink-2 hover:text-olive">
        <SearchIcon width={20} height={20} />
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-6 lg:h-[72px]">
        <button className="-ml-2 grid h-11 w-11 place-items-center lg:hidden" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <Link to="/" aria-label={`${data.settings.store_name} — página inicial`} className="shrink-0">
          <Logo name={data.settings.store_name} url={data.settings.logo_url} />
        </Link>
        <nav aria-label="Principal" className="ml-4 hidden items-center gap-5 xl:gap-7 lg:flex whitespace-nowrap">
          <NavLink to="/produtos" className={link}>Produtos</NavLink>
          <NavLink to="/combos" className={link}>Combos</NavLink>
          {data.categories.slice(0, 4).map((c) => (
            <NavLink key={c.id} to={`/categoria/${c.slug}`} className={link}>{c.name}</NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden w-72 lg:block">{search}</div>
        <Link to="/carrinho" aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`} className="relative ml-auto grid h-11 w-11 place-items-center rounded-full hover:bg-sand/60 lg:ml-0">
          <BagIcon />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-olive px-1 text-[11px] font-bold text-paper">{count}</span>
          )}
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-ink/40" aria-label="Fechar menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col gap-6 overflow-y-auto bg-paper p-5">
            <div className="flex items-center justify-between">
              <Logo name={data.settings.store_name} url={data.settings.logo_url} />
              <button className="grid h-11 w-11 place-items-center" aria-label="Fechar menu" onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>
            {search}
            <nav aria-label="Menu móvel" className="flex flex-col text-lg">
              <NavLink to="/produtos" className={link}>Todos os produtos</NavLink>
              <NavLink to="/combos" className={link}>Combos</NavLink>
              {data.categories.map((c) => (
                <NavLink key={c.id} to={`/categoria/${c.slug}`} className={link}>{c.name}</NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { data } = useStore();
  const s = data.settings;
  const wa = s.whatsapp ? whatsappLink(s.whatsapp) : null;
  const policies = [
    ["entrega", "Entrega", s.shipping_policy],
    ["trocas-e-devolucoes", "Trocas e devoluções", s.return_policy],
    ["privacidade", "Privacidade", s.privacy_policy],
    ["termos", "Termos de uso", s.terms],
  ].filter((p) => p[2]);
  const socials = [
    s.instagram && { label: "Instagram", href: s.instagram },
    s.facebook && { label: "Facebook", href: s.facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 bg-sand/60">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo name={s.store_name} url={s.logo_url} />
          {s.tagline && <p className="mt-4 max-w-xs text-sm leading-6 text-ink-2">{s.tagline}</p>}
        </div>
        <nav aria-label="Loja">
          <h2 className="mb-3 text-sm font-bold">Loja</h2>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link className="hover:text-olive" to="/produtos">Produtos</Link></li>
            <li><Link className="hover:text-olive" to="/combos">Combos</Link></li>
            {data.categories.map((c) => (
              <li key={c.id}><Link className="hover:text-olive" to={`/categoria/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informações">
          <h2 className="mb-3 text-sm font-bold">Informações</h2>
          <ul className="space-y-2 text-sm text-ink-2">
            {policies.length === 0 && <li>Políticas em breve.</li>}
            {policies.map(([slug, label]) => (
              <li key={slug}><Link className="hover:text-olive" to={`/politicas/${slug}`}>{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-bold">Atendimento</h2>
          <ul className="space-y-2 text-sm text-ink-2">
            {s.phone && <li>{s.phone}</li>}
            {wa && <li><a className="hover:text-olive" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            {s.email && <li><a className="hover:text-olive" href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s.address && <li className="max-w-[16rem]">{s.address}</li>}
            {socials.map((x) => (
              <li key={x.label}><a className="hover:text-olive" href={x.href} target="_blank" rel="noopener noreferrer">{x.label}</a></li>
            ))}
            {!s.phone && !wa && !s.email && !s.address && socials.length === 0 && <li>Contatos em breve.</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="container-x py-5 text-xs text-ink-2">© {new Date().getFullYear()} {s.store_name}. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

function CartToast() {
  const { notice, dismissNotice } = useCart();
  if (!notice) return null;
  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-[8px] bg-ink px-4 py-3 text-sm text-paper shadow-lg sm:left-auto sm:right-6">
      <span>{notice}</span>
      <span className="flex items-center gap-3">
        <Link to="/carrinho" onClick={dismissNotice} className="font-bold underline underline-offset-4">Ver carrinho</Link>
        <button onClick={dismissNotice} aria-label="Fechar aviso" className="opacity-70 hover:opacity-100"><CloseIcon width={18} height={18} /></button>
      </span>
    </div>
  );
}

export default function Layout() {
  const loc = useLocation();
  useEffect(() => window.scrollTo(0, 0), [loc.pathname]);
  const hideNewsletter = ["/carrinho", "/checkout"].includes(loc.pathname) || loc.pathname.startsWith("/pedido");
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-paper focus:px-3 focus:py-2">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo" className="min-h-[60vh]">
        <Outlet />
      </main>
      {!hideNewsletter && <Newsletter />}
      <Footer />
      <CartToast />
    </>
  );
}
