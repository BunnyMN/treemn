"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...loginForm, redirect: false });
    if (res?.error) {
      setError("И-мэйл эсвэл нууц үг буруу");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: regForm.email, password: regForm.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-stretch overflow-hidden">
      {/* Left: Brand Canvas */}
      <section className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=1600&fit=crop"
            alt="Forest"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-primary-container opacity-80"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary font-bold">park</span>
          </div>
          <h1 className="font-headline font-black text-2xl tracking-tighter text-on-primary">TreeMN</h1>
        </div>
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-3 py-1 mb-6 rounded-full bg-primary-container text-on-primary-container text-xs tracking-widest uppercase font-bold">
            Цахим Консерватори
          </span>
          <h2 className="font-headline text-5xl font-extrabold text-on-primary tracking-tight leading-none mb-6">
            Алтанбулаг сумын байгалийн өвийг хамгаална.
          </h2>
          <p className="text-on-primary/70 text-lg max-w-md font-light leading-relaxed">
            Байгаль орчны арилжааны нэгдсэн платформд нэгдээрэй. Модны бүртгэлийн тусламжтай ой модоо хамгаална.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-8 pt-12 border-t border-on-primary/10">
          <div>
            <p className="font-headline text-3xl font-bold text-on-primary">12.4k+</p>
            <p className="text-xs uppercase tracking-widest text-on-primary/50">Бүртгэлтэй мод</p>
          </div>
          <div>
            <p className="font-headline text-3xl font-bold text-on-primary">8.2m</p>
            <p className="text-xs uppercase tracking-widest text-on-primary/50">Шингэсэн CO2 (кг)</p>
          </div>
        </div>
      </section>

      {/* Right: Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm">park</span>
            </div>
            <h1 className="font-headline font-black text-xl tracking-tighter text-primary">TreeMN</h1>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {view === "login" ? (
            <div className="space-y-8">
              <header>
                <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Тавтай морилно уу</h3>
                <p className="text-on-surface-variant">Консерваторийн хянах самбар болон арилжааны хөрөнгө рүүгээ нэвтэрнэ үү.</p>
              </header>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold px-1">И-мэйл хаяг</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Нууц үг</label>
                    <a className="text-xs font-medium text-primary hover:text-primary-container transition-colors" href="#">Нууц үг мартсан?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary-container transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
                >
                  {loading ? "Нэвтэрч байна..." : "Системд нэвтрэх"}
                </button>
              </form>
              <p className="text-center text-sm text-on-surface-variant">
                Шинэ хэрэглэгч үү?{" "}
                <button onClick={() => { setView("register"); setError(""); }} className="text-primary font-bold hover:underline ml-1">
                  Бүртгэл үүсгэх
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <header>
                <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-2">Хөрөнгө бүртгүүлэх</h3>
                <p className="text-on-surface-variant">Байгаль орчны арилжааны аянаа эхлүүлнэ үү.</p>
              </header>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold px-1">Овог нэр</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">person</span>
                    <input
                      type="text"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50"
                      placeholder="Нэрээ оруулна уу"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold px-1">И-мэйл</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">mail</span>
                      <input
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50 text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold px-1">Утас</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">call</span>
                      <input
                        type="tel"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50 text-sm"
                        placeholder="+976"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold px-1">Нууц үг үүсгэх</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                    <input
                      type="password"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline/50"
                      placeholder="Дор хаяж 6 тэмдэгт"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary-container transition-all active:scale-[0.98] mt-2 disabled:opacity-50"
                >
                  {loading ? "Бүртгэж байна..." : "Бүртгэл баталгаажуулах"}
                </button>
              </form>
              <p className="text-center text-sm text-on-surface-variant">
                Аль хэдийн бүртгэлтэй юу?{" "}
                <button onClick={() => { setView("login"); setError(""); }} className="text-primary font-bold hover:underline ml-1">
                  Энд дарж нэвтэрнэ үү
                </button>
              </p>
            </div>
          )}

          <footer className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 opacity-50">
            <a className="text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors" href="#">Нууцлалын бодлого</a>
            <a className="text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors" href="#">Үйлчилгээний нөхцөл</a>
            <a className="text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors" href="#">Тусламжийн төв</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
