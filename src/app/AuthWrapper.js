"use client";

import { useEffect, useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyEC0T6Bju3iW-YY4zMMPDYPl1foU7lYalltZ-TxMOvm9rDcjSEKaWxSHYixEM-Ptub/exec";

const BPS_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/2/28/Lambang_Badan_Pusat_Statistik_%28BPS%29_Indonesia.svg";

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("jamlaper_auth");
    if (auth === "true") setIsAuthenticated(true);
    setIsChecking(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!accessCode.trim()) {
      setError("Masukkan kode akses terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${APPS_SCRIPT_URL}?action=getSheet&sheet=Kode Akses`
      );
      const result = await res.json();

      if (result.success && result.data) {
        const inputCode = accessCode.toLowerCase();

        const isValid = result.data.some(
          (row) =>
            String(row["KODE AKSES"] || row.KODE || "").toLowerCase() ===
            inputCode
        );

        if (isValid) {
          localStorage.setItem("jamlaper_auth", "true");
          window.dispatchEvent(new Event('auth-change'));
          setIsAuthenticated(true);
        } else {
          setError("Kode akses tidak valid. Periksa kembali kode Anda.");
        }
      } else {
        setError("Gagal mengambil data dari server. Coba lagi.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-50">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#f4f8fc] font-sans">
        <section className="relative min-h-screen overflow-hidden">
          {/* BACKGROUND: Unified Mesh Gradient (No hard splits!) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Soft Ambient Orbs */}
            <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-blue-500/20 blur-[120px]" />
            <div className="absolute -bottom-[20%] -left-[10%] h-[700px] w-[700px] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute top-[30%] left-[30%] h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[100px]" />

            {/* Elegant Grid Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-50" />
          </div>

          <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
            {/* LEFT SIDE */}
            <div className="text-slate-900">
              {/* LOGO */}
              <div className="mb-16 flex items-center gap-4">
                <img
                  src={BPS_LOGO}
                  alt="Logo BPS"
                  className="h-16 w-16 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-blue-700">
                    JamLaper
                  </h1>
                  <p className="text-lg font-medium text-slate-600">
                    BPS Kabupaten Boyolali
                  </p>
                </div>
              </div>

              {/* HERO */}
              <div className="max-w-xl">
                <h2 className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
                  Selamat Datang di
                  <br />
                  <span className="text-blue-600">JamLaper</span>
                </h2>

                <div className="mt-7 h-1.5 w-14 rounded-full bg-blue-500" />

                <p className="mt-6 max-w-lg text-xl leading-8 text-slate-700">
                  Sistem Peminjaman Laptop Operasional Badan Pusat Statistik
                  Kabupaten Boyolali
                </p>
              </div>

              {/* VISUAL AREA */}
              <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_0.9fr]">
                <LaptopVisual />
                <ChartVisual />
              </div>

              {/* BOTTOM FEATURES */}
              <div className="mt-8 grid max-w-4xl gap-4 rounded-3xl bg-white/85 p-5 shadow-[0_18px_50px_rgba(37,99,235,0.15)] backdrop-blur md:grid-cols-3">
                <InfoCard
                  color="blue"
                  title="Peminjaman Tercatat"
                  desc="Semua proses peminjaman tercatat dengan rapi."
                  icon="laptop"
                />
                <InfoCard
                  color="emerald"
                  title="Monitoring Real-Time"
                  desc="Pantau peminjaman kapan saja dan di mana saja."
                  icon="chart"
                />
                <InfoCard
                  color="amber"
                  title="Data Aman"
                  desc="Keamanan data terjamin dan terpercaya."
                  icon="shield"
                />
              </div>
            </div>

            {/* RIGHT LOGIN CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[480px] rounded-[34px] bg-gradient-to-b from-blue-600 to-blue-800 p-8 shadow-[0_30px_90px_rgba(37,99,235,0.3)] sm:p-10 lg:p-12 relative overflow-hidden border border-blue-400/30">


                <div className="mb-8 flex justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 shadow-inner border border-white/20 backdrop-blur-md">
                    <img
                      src={BPS_LOGO}
                      alt="Logo BPS"
                      className="h-16 w-16 object-contain brightness-0 invert"
                    />
                  </div>
                </div>

                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-black text-white">
                    JamLaper BPS
                  </h3>
                  <p className="mt-4 text-base leading-7 text-blue-100">
                    Sistem Peminjaman Laptop Operasional
                    <br />
                    Badan Pusat Statistik Kabupaten Boyolali
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-blue-200">
                      <Icon name="lock" className="h-5 w-5" />
                    </span>

                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Masukkan Kode Akses"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-14 pr-5 text-base font-medium text-white outline-none transition placeholder:text-blue-300 focus:border-white focus:ring-4 focus:ring-white/20 backdrop-blur-md"
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-300/50 bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-50 backdrop-blur-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-base font-extrabold text-blue-700 shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70 hover:scale-[1.02] active:scale-95"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-700/40 border-t-blue-700" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <Icon name="login" className="h-5 w-5" />
                        Masuk ke Sistem
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-white/20" />
                    <span className="text-sm font-semibold text-blue-200">
                      atau
                    </span>
                    <div className="h-px flex-1 bg-white/20" />
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 border border-white/10 backdrop-blur-md">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                        <Icon name="info" className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-white">
                          Gunakan kode akses yang diberikan
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-blue-100">
                          Pastikan kode akses sudah benar untuk dapat masuk ke
                          sistem.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

function MiniFeature({ title, color, icon }) {
  const colorMap = {
    blue: "text-blue-600",
    emerald: "text-emerald-500",
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${colorMap[color]}`}>
      <Icon name={icon} className="h-5 w-5" />
      <span>{title}</span>
    </div>
  );
}

function InfoCard({ title, desc, icon, color }) {
  const colorMap = {
    blue: "bg-blue-600 text-white",
    emerald: "bg-emerald-500 text-white",
    amber: "bg-amber-400 text-white",
  };

  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colorMap[color]}`}
      >
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <div>
        <h4 className="text-base font-black text-slate-900">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function LaptopVisual() {
  return (
    <div className="relative max-w-[430px]">
      <div className="absolute -left-10 bottom-3 hidden sm:block">
        <div className="relative h-40 w-28">
          <div className="absolute left-8 top-8 h-20 w-9 rotate-[-28deg] rounded-full bg-blue-600" />
          <div className="absolute left-12 top-3 h-24 w-10 rotate-[25deg] rounded-full bg-blue-500" />
          <div className="absolute left-3 top-14 h-20 w-9 rotate-[-55deg] rounded-full bg-blue-700" />
          <div className="absolute bottom-0 left-7 h-11 w-16 rounded-b-2xl rounded-t-md bg-white shadow-md" />
        </div>
      </div>

      <div className="relative ml-12">
        <div className="rounded-t-2xl bg-slate-800 p-3 shadow-2xl">
          <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-md bg-white">
            <img src={BPS_LOGO} alt="Logo BPS" className="h-16 w-16" />
            <p className="mt-2 text-3xl font-black text-blue-600">JamLaper</p>
            <p className="text-sm font-medium text-slate-400">BPS Boyolali</p>
          </div>
        </div>
        <div className="mx-auto h-5 w-[108%] -translate-x-[4%] rounded-b-2xl bg-slate-300 shadow-lg">
          <div className="mx-auto h-1.5 w-24 rounded-b-md bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

function ChartVisual() {
  return (
    <div className="hidden max-w-[280px] lg:block">
      <div className="flex items-end gap-3">
        {[80, 110, 125, 150, 190].map((height, i) => (
          <div
            key={i}
            className="w-10 rounded-t-xl bg-blue-500/80 shadow-lg"
            style={{ height }}
          />
        ))}
      </div>

      <svg viewBox="0 0 280 140" className="-mt-40 h-40 w-full">
        <polyline
          points="10,95 55,60 95,70 135,35 175,45 220,10"
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[[10, 95], [55, 60], [95, 70], [135, 35], [175, 45], [220, 10]].map(
          ([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="#2563eb" />
          )
        )}
      </svg>
    </div>
  );
}

function Icon({ name, className }) {
  const icons = {
    shield: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5-6.5A11.9 11.9 0 0112 2 11.9 11.9 0 014 3.5V9c0 5.5 3.8 10.3 8 11.5 4.2-1.2 8-6 8-11.5V3.5z"
      />
    ),
    bolt: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
      />
    ),
    laptop: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5h16v10H4V5zm-2 14h20"
      />
    ),
    chart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 19V5m4 14v-6m4 6V9m4 10v-8m4 8H4"
      />
    ),
    lock: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    ),
    login: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    ),
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
      />
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {icons[name]}
    </svg>
  );
}