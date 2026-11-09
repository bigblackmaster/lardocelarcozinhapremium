import { createContext, lazy, Suspense, useContext, useEffect, useState, type FormEvent } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Logo } from "../components/Icons";
import { ApiError, api, setCsrf } from "../lib/api";
import { useStore } from "../lib/state";
import { Field, Notice, errMsg } from "./kit";

const Dashboard = lazy(() => import("./Dashboard"));
const Products = lazy(() => import("./Products"));
const Combos = lazy(() => import("./Combos"));
const Orders = lazy(() => import("./Orders"));
const Content = lazy(() => import("./Content"));
const Settings = lazy(() => import("./Settings"));

interface Me { id: string; email: string; name: string }
const AdminCtx = createContext<{ me: Me; logout: () => Promise<void> } | null>(null);
export const useAdmin = () => useContext(AdminCtx)!;

function AuthScreen({ onLogin }: { onLogin: (me: Me) => void }) {
  const { data } = useStore();
  const [mode, setMode] = useState<"login" | "first">("login");
  const [f, setF] = useState({ email: "", password: "", name: "", token: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const login = async () => {
    const r = await api<{ admin: Me; csrf_token: string }>("/api/admin/login", { method: "POST", body: { email: f.email, password: f.password } });
    setCsrf(r.csrf_token);
    onLogin(r.admin);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(""); setInfo("");
    try {
      if (mode === "first") {
        await api("/api/admin/bootstrap", { method: "POST", body: { token: f.token, email: f.email, name: f.name, password: f.password } });
        setInfo("Administrador criado. Entrando…");
      }
      await login();
    } catch (e2) {
      setErr(e2 instanceof ApiError && e2.code === "bootstrap_disabled" ? "A criação do primeiro administrador está desativada: defina a variável ADMIN_BOOTSTRAP_TOKEN no Netlify e faça um novo deploy." : errMsg(e2));
    } finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-paper-2 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-[12px] border border-line bg-paper p-8 shadow-sm">
        <Logo name={data.settings.store_name} url={data.settings.logo_url} />
        <h1 className="text-2xl font-extrabold">{mode === "login" ? "Entrar no painel" : "Criar primeiro administrador"}</h1>
        {mode === "first" && (
          <>
            <p className="text-sm text-ink-2">Use o token definido na variável ADMIN_BOOTSTRAP_TOKEN. Só funciona enquanto não existir nenhum administrador.</p>
            <Field label="Token de inicialização" htmlFor="tk"><input id="tk" className="field" type="password" autoComplete="off" required value={f.token} onChange={(e) => set("token", e.target.value)} /></Field>
            <Field label="Nome" htmlFor="nm"><input id="nm" className="field" autoComplete="name" required minLength={2} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          </>
        )}
        <Field label="E-mail" htmlFor="em"><input id="em" className="field" type="email" autoComplete="username" required value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Senha" htmlFor="pw" hint={mode === "first" ? "Mínimo de 12 caracteres." : undefined}>
          <input id="pw" className="field" type="password" autoComplete={mode === "first" ? "new-password" : "current-password"} required minLength={mode === "first" ? 12 : 1} value={f.password} onChange={(e) => set("password", e.target.value)} />
        </Field>
        {err && <Notice kind="error">{err}</Notice>}
        {info && <Notice kind="ok">{info}</Notice>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar e entrar"}</button>
        <button type="button" className="w-full text-center text-sm font-semibold text-olive underline" onClick={() => { setMode(mode === "login" ? "first" : "login"); setErr(""); }}>
          {mode === "login" ? "Primeiro acesso? Criar administrador" : "Já tenho conta"}
        </button>
      </form>
    </div>
  );
}

const nav = [
  ["/admin", "Resumo", true], ["/admin/pedidos", "Pedidos"], ["/admin/produtos", "Produtos"], ["/admin/combos", "Combos"],
  ["/admin/conteudo", "Banners e categorias"], ["/admin/entrega-e-cupons", "Frete e cupons"], ["/admin/configuracoes", "Configurações"],
] as const;

export default function AdminApp() {
  const { data } = useStore();
  const [me, setMe] = useState<Me | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    document.title = "Painel — " + data.settings.store_name;
    api<{ admin: Me; csrf_token: string }>("/api/admin/me")
      .then((r) => { setCsrf(r.csrf_token); setMe(r.admin); })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [data.settings.store_name]);

  if (!checked) return <p role="status" className="py-24 text-center text-ink-2">Carregando…</p>;
  if (!me) return <AuthScreen onLogin={setMe} />;

  const logout = async () => {
    try { await api("/api/admin/logout", { method: "POST" }); } catch { /* sessão já expirada */ }
    setCsrf(null); setMe(null);
  };

  return (
    <AdminCtx.Provider value={{ me, logout }}>
      <div className="min-h-screen bg-paper-2 lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-line bg-paper lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 p-4 lg:block lg:p-6">
            <Logo name={data.settings.store_name} url={data.settings.logo_url} />
            <p className="hidden pt-3 text-xs text-ink-2 lg:block">{me.name}<br />{me.email}</p>
          </div>
          <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
            {nav.map(([to, label, end]) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `whitespace-nowrap rounded-[6px] px-3 py-2 text-sm font-semibold ${isActive ? "bg-olive text-paper" : "text-ink hover:bg-sand/70"}`}>{label}</NavLink>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-[6px] px-3 py-2 text-sm font-semibold text-ink-2 hover:bg-sand/70">Ver loja</a>
            <button onClick={logout} className="whitespace-nowrap rounded-[6px] px-3 py-2 text-left text-sm font-semibold text-ink-2 hover:bg-sand/70">Sair</button>
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-8">
          <Suspense fallback={<p role="status" className="py-12 text-center text-ink-2">Carregando…</p>}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="pedidos" element={<Orders />} />
              <Route path="produtos" element={<Products />} />
              <Route path="combos" element={<Combos />} />
              <Route path="conteudo" element={<Content part="content" />} />
              <Route path="entrega-e-cupons" element={<Content part="commerce" />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AdminCtx.Provider>
  );
}
