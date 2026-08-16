import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./decha-website.css";

/* ===================================================================
   [3] AYARLAR
   =================================================================== */
const CONFIG = {
  /* Web3Forms erişim anahtarı — https://web3forms.com adresinden ücretsiz alınır.
     Anahtarı yapıştırdığınız anda hem iletişim formu hem bülten formu çalışır. */
  WEB3FORMS_KEY: "",
  email: "merhaba@decha.com",
};

/* ===================================================================
   [4] İÇERİK — tüm metinler ve kartlar buradan yönetilir
   =================================================================== */

/* Referans şeridi — kendi müşteri markalarınızı yazın */
const REFERANSLAR = ["Nexa Bank", "Sofra", "Atlas Lojistik", "Kandil Sağlık", "Pergel", "Orbit Commerce", "Vira Enerji", "Marla Retail"];

const HIZMETLER = [
  {
    icon: "design", title: "Ürün tasarımı",
    text: "Keşif atölyesinden tıklanabilir prototipe kadar tüm tasarım süreci.",
    items: ["Kullanıcı araştırması ve akış haritası", "Arayüz tasarımı (UI/UX)", "Tasarım sistemi kurulumu", "Tıklanabilir prototip"],
  },
  {
    icon: "web", title: "Web & platform geliştirme",
    text: "Kurumsal paneller, müşteri portalları ve SaaS ürünleri.",
    items: ["Next.js / React ile modern arayüz", "Node.js ve PostgreSQL altyapı", "Rol ve yetki yönetimi", "Üçüncü parti API entegrasyonları"],
  },
  {
    icon: "mobile", title: "Mobil uygulama",
    text: "iOS ve Android için üretim kalitesinde uygulamalar.",
    items: ["React Native ile tek kod tabanı", "Native modül geliştirme", "Mağaza yayını ve sürüm yönetimi", "Push bildirim ve analitik"],
  },
  {
    icon: "cloud", title: "Bulut & DevOps",
    text: "Kesintisiz çalışan, maliyeti öngörülebilir altyapı.",
    items: ["CI/CD hattı kurulumu", "Konteyner ve otomatik ölçekleme", "İzleme, log ve uyarı sistemleri", "Maliyet optimizasyonu"],
  },
  {
    icon: "data", title: "Veri & analitik",
    text: "Kararları hisle değil, ölçümle almanızı sağlayan kurulum.",
    items: ["Olay takibi ve veri modeli", "Yönetim panosu ve raporlar", "A/B testi altyapısı", "Dönüşüm hunisi analizi"],
  },
  {
    icon: "support", title: "Bakım & destek",
    text: "Yayına aldıktan sonra da yanınızdayız.",
    items: ["SLA'lı destek paketleri", "Güvenlik güncellemeleri", "Performans iyileştirme", "Yeni özellik geliştirme"],
  },
];

const ADIMLAR = [
  { no: "01", title: "Keşif", text: "İş hedefini, kullanıcıyı ve teknik kısıtları netleştiririz. Çıktı: kapsam ve yol haritası." },
  { no: "02", title: "Tasarım", text: "Akışlar, arayüz ve tasarım sistemi. Kod yazılmadan önce ürünü tıklayarak görürsünüz." },
  { no: "03", title: "Geliştirme", text: "İki haftalık döngüler, her döngü sonunda çalışan sürüm ve demo." },
  { no: "04", title: "Yayın & büyüme", text: "Devreye alma, izleme ve ölçüme dayalı iyileştirme. İş bitince bırakmıyoruz." },
];

const PROJELER = [
  {
    title: "Nexa Bank", cat: "Fintech · Web", year: "2025", colors: ["#2E7CFF", "#0B44D6"],
    text: "Kurumsal müşteriler için nakit akışı, onay hiyerarşisi ve toplu ödeme yönetimini tek panelde birleştiren bankacılık arayüzü.",
    tags: ["Next.js", "TypeScript", "Tasarım sistemi"], metric: "%38 daha hızlı işlem",
  },
  {
    title: "Sofra", cat: "Mobil · Perakende", year: "2025", colors: ["#22D3EE", "#1B5CFF"],
    text: "48 şubeli restoran zinciri için sipariş, sadakat ve kurye takibini içeren müşteri uygulaması ve mutfak paneli.",
    tags: ["React Native", "Node.js", "Realtime"], metric: "180 bin aktif kullanıcı",
  },
  {
    title: "Atlas Lojistik", cat: "SaaS · Operasyon", year: "2024", colors: ["#5C9DFF", "#0B44D6"],
    text: "Filo takibi, sevkiyat planlama ve müşteri bildirimlerini yöneten çok kiracılı lojistik platformu.",
    tags: ["Next.js", "PostgreSQL", "Harita SDK"], metric: "%24 yakıt tasarrufu",
  },
  {
    title: "Kandil Sağlık", cat: "Mobil · Sağlık", year: "2024", colors: ["#22D3EE", "#0E7490"],
    text: "Randevu, tele-konsültasyon ve reçete takibini bir araya getiren, KVKK uyumlu hasta uygulaması.",
    tags: ["React Native", "WebRTC", "KVKK"], metric: "4.8 mağaza puanı",
  },
  {
    title: "Pergel", cat: "SaaS · İnşaat", year: "2024", colors: ["#8FBCFF", "#1B5CFF"],
    text: "Şantiye ilerlemesi, hakediş ve taşeron koordinasyonunu tek yerden yöneten proje takip yazılımı.",
    tags: ["Next.js", "Rapor motoru", "Rol yönetimi"], metric: "9 saat/hafta kazanç",
  },
  {
    title: "Orbit Commerce", cat: "E-ticaret · Altyapı", year: "2023", colors: ["#2E7CFF", "#5B21B6"],
    text: "Headless commerce altyapısı: ürün kataloğu, kampanya motoru ve çok kanallı stok senkronizasyonu.",
    tags: ["Headless", "GraphQL", "Edge cache"], metric: "0.9 sn LCP",
  },
];

const EKIP = [
  { name: "Hamza Ali Cengiz", role: "Kurucu & CEO", bio: "Ürün stratejisi ve müşteri ilişkileri. Decha'yı bir yazılım evi değil, teknoloji partneri olarak kurdu." },
  { name: "Elif Demir", role: "Ürün Tasarım Lideri", bio: "Karmaşık kurumsal akışları sadeleştirir. Tasarım sistemlerinin sürdürülebilirliği üzerine çalışır." },
  { name: "Mert Yıldırım", role: "Baş Yazılım Mühendisi", bio: "Ölçeklenebilir mimari ve performans. Ekibin teknik standartlarını kurar." },
  { name: "Zeynep Arslan", role: "Mobil Geliştirme Lideri", bio: "iOS ve Android tarafında üretim kalitesi. Mağaza yayın süreçlerini uçtan uca yönetir." },
  { name: "Can Öztürk", role: "DevOps & Altyapı", bio: "CI/CD, gözlemlenebilirlik ve maliyet optimizasyonu. Kesintisiz devreye alma onun işi." },
  { name: "Deniz Kaya", role: "Proje Yöneticisi", bio: "Kapsam, takvim ve iletişim. Müşteri ile ekip arasındaki tek ve net kanal." },
  { name: "Selin Aydın", role: "Kalite Mühendisi", bio: "Test otomasyonu ve sürüm doğrulama. Her yayın öncesi son sözü söyleyen kişi." },
  { name: "Burak Şahin", role: "Veri & Analitik", bio: "Ürün metrikleri, olay takibi ve raporlama. Kararları veriyle alıyoruz." },
];

const GORUSLER = [
  { text: "Panelin ilk sürümünü altı haftada yayına aldılar. Bizim iç ekibimizin bir yılda çözemediği onay akışını iki toplantıda netleştirdiler.", name: "Ayşe Korkmaz", role: "Dijital Kanallar Direktörü · Nexa Bank" },
  { text: "Ajanslarla çalışırken en çok devir teslim aşamasında kaybederdik. Decha'da tasarımı yapan ekip kodu da yazdığı için o kayıp hiç olmadı.", name: "Emre Tunç", role: "Kurucu Ortak · Sofra" },
  { text: "Sadece uygulamayı geliştirmediler; hangi metriği neden ölçmemiz gerektiğini de anlattılar. Şimdi kararları tartışmıyoruz, bakıyoruz.", name: "Gizem Bayrak", role: "Ürün Müdürü · Atlas Lojistik" },
  { text: "KVKK tarafında en çok zorlanacağımızı düşündüğümüz yerdi. Denetimden ilk seferde geçtik.", name: "Dr. Serkan Aydoğan", role: "Genel Müdür · Kandil Sağlık" },
];

const YAZILAR = [
  { tag: "Mimari", date: "12 Ağustos 2026", title: "Çok kiracılı SaaS'ta veri izolasyonu",
    text: "Tek veritabanı mı, kiracı başına şema mı? Üç projede denediğimiz yaklaşımların maliyet ve bakım karşılaştırması.", colors: ["#2E7CFF", "#0B44D6"] },
  { tag: "Süreç", date: "28 Temmuz 2026", title: "Keşif atölyesini iki güne sığdırmak",
    text: "Uzun analiz dokümanları yerine iki günlük yoğun bir atölye. Nasıl kurguladığımızı ve neyi çıktı aldığımızı anlatıyoruz.", colors: ["#22D3EE", "#1B5CFF"] },
  { tag: "Performans", date: "9 Temmuz 2026", title: "LCP'yi 1 saniyenin altına indirmek",
    text: "E-ticaret altyapısında yaptığımız altı değişiklik ve her birinin ölçülen etkisi.", colors: ["#8FBCFF", "#5B21B6"] },
];

const SSS = [
  { q: "Bir proje ortalama ne kadar sürer?", a: "Kapsamına göre değişir; küçük bir MVP 6-8 haftada, kurumsal bir platform 3-6 ayda yayına çıkar. Keşif sonunda net bir takvim veririz." },
  { q: "Sabit fiyat mı, saatlik mi çalışıyorsunuz?", a: "Kapsamı netleşen projelerde sabit fiyat, açık uçlu ürün geliştirmede aylık kapasite modeli sunuyoruz. İkisini de keşif sonunda konuşuruz." },
  { q: "Hangi teknolojileri kullanıyorsunuz?", a: "Web tarafında Next.js/React, mobilde React Native, altyapıda Node.js ve PostgreSQL standart setimiz. Projeye göre farklı araçlar da değerlendiririz." },
  { q: "Yayından sonra destek veriyor musunuz?", a: "Evet. SLA'lı bakım paketleriyle güvenlik güncellemeleri, performans takibi ve yeni özellik geliştirmeyi sürdürüyoruz." },
  { q: "Gizlilik sözleşmesi (NDA) imzalıyor musunuz?", a: "Evet, keşif görüşmesinden önce talep eden herkesle NDA imzalıyoruz." },
  { q: "Fikir aşamasındaki projelere bakıyor musunuz?", a: "Bakıyoruz. Netleşmemiş bir fikri kapsam ve yol haritasına dönüştürmek de keşif sürecimizin bir parçası." },
];

const STATS = [
  { to: 40, suffix: "+", label: "Tamamlanan proje" },
  { to: 12, suffix: "", label: "Kişilik ürün ekibi" },
  { to: 6, suffix: "", label: "Ülkede aktif müşteri" },
  { to: 99.9, prefix: "%", dec: 1, label: "Ortalama çalışma süresi" },
];

const KELIMELER = ["ölçeklenebilir yazılım.", "kusursuz arayüz.", "güvenilir altyapı.", "ölçülebilir büyüme."];

const NAV_LINKS = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#projeler", label: "Projeler" },
  { href: "#iletisim", label: "İletişim" },
];
const NAV_MORE = [
  { href: "#fark", label: "Fark" },
  { href: "#surec", label: "Süreç" },
  { href: "#ekip", label: "Ekip" },
  { href: "#blog", label: "Blog" },
  { href: "#sss", label: "SSS" },
];
const MOBILE_LINKS = [...NAV_LINKS, ...NAV_MORE];

const SCROLL_SPY_IDS = ["hizmetler", "fark", "surec", "projeler", "ekip", "blog", "sss", "iletisim"];

const ICONS = {
  design: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="M12 12v9M12 12 4 7M12 12l8-5" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M8 22h8" />
    </>
  ),
  mobile: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </>
  ),
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 11 3.5 3.5 0 0 0 7 19z" />,
  data: (
    <>
      <path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z" />
      <path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  support: <path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-7H7v0M12 3a7 7 0 0 1 7 7v4a3 3 0 0 1-3 3h-1v-7h2" />,
};

function ServiceIcon({ name }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#8FBCFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name] || ICONS.web}
    </svg>
  );
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toLocaleUpperCase("tr-TR");
}

function mesh(colors) {
  return `radial-gradient(80% 120% at 18% 12%, ${colors[0]} 0%, transparent 62%),
          radial-gradient(90% 130% at 88% 96%, ${colors[1]} 0%, transparent 66%),
          linear-gradient(150deg,#0a1120,#060a13)`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===================================================================
   Harf harf hızlı geçiş (scramble) efekti
   =================================================================== */
const SCRAMBLE_CHARS = "ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZ*+-/#%";

function useScrambleText(text, { duration = 420, tick = 26 } = {}) {
  const [display, setDisplay] = useState(text);
  const prevRef = useRef(text);

  useEffect(() => {
    if (reducedMotion()) {
      setDisplay(text);
      prevRef.current = text;
      return;
    }
    const from = prevRef.current;
    const to = text;
    const length = Math.max(from.length, to.length);
    const lockAt = Array.from({ length }, (_, i) => (i / length) * (duration * 0.55));
    const startedAt = performance.now();

    const id = setInterval(() => {
      const elapsed = performance.now() - startedAt;
      let done = true;
      let out = "";
      for (let i = 0; i < length; i++) {
        const target = to[i] ?? "";
        const lockTime = lockAt[i] + duration * 0.45;
        if (elapsed >= lockTime) {
          out += target;
        } else {
          done = false;
          out += target ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] : "";
        }
      }
      setDisplay(out);
      if (done) {
        clearInterval(id);
        prevRef.current = to;
      }
    }, tick);

    return () => clearInterval(id);
  }, [text, duration, tick]);

  return display;
}

/* ===================================================================
   Görünürlük animasyonu (IntersectionObserver tabanlı "rv" sarmalayıcı)
   =================================================================== */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rv${inView ? " in" : ""}${className ? " " + className : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ===================================================================
   Sayaçlar
   =================================================================== */
function useStatsInView() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setStarted(true);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, started];
}

function StatCounter({ to, prefix = "", suffix = "", dec = 0, started }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf;
    const start = performance.now();
    const duration = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);
  return (
    <b>
      {prefix}
      {value.toFixed(dec)}
      {suffix}
    </b>
  );
}

/* ===================================================================
   Ana bileşen
   =================================================================== */
export default function DechaWebsite() {
  /* --- nav / scroll durumu --- */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navMoreOpen, setNavMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const lastYRef = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 12);
      setShowToTop(y > 900);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);

      if (mobileOpen || y < 80) {
        setNavHidden(false);
      } else if (y > lastYRef.current) {
        setNavHidden(true);
        setNavMoreOpen(false);
      } else if (y < lastYRef.current) {
        setNavHidden(false);
      }
      lastYRef.current = y;

      let aktif = null;
      SCROLL_SPY_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) aktif = id;
      });
      setActiveSection(aktif);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  /* --- nav: "daha fazla" açılır menü: dışarı tıklama / Escape --- */
  useEffect(() => {
    function onDocClick(e) {
      if (!e.target.closest(".has-dropdown")) setNavMoreOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setNavMoreOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* --- kart ışık efekti (imleç takibi) --- */
  useEffect(() => {
    if (reducedMotion()) return;
    function onMouseMove(e) {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  /* --- hero kelime döngüsü --- */
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % KELIMELER.length);
    }, 3600);
    return () => clearInterval(interval);
  }, []);
  const rotatorText = useScrambleText(KELIMELER[wordIndex]);

  /* --- sayaçlar --- */
  const [statsRef, statsStarted] = useStatsInView();

  /* --- projeler + filtre --- */
  const [activeCat, setActiveCat] = useState("Tümü");
  const kategoriler = useMemo(() => ["Tümü", ...new Set(PROJELER.map((p) => p.cat.split("·")[0].trim()))], []);
  const filteredProjects = useMemo(
    () => (activeCat === "Tümü" ? PROJELER : PROJELER.filter((p) => p.cat.split("·")[0].trim() === activeCat)),
    [activeCat]
  );
  function handleTiltMove(e) {
    if (reducedMotion()) return;
    const p = e.currentTarget;
    const r = p.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    p.style.transform = `translateY(-5px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
  }
  function handleTiltLeave(e) {
    e.currentTarget.style.transform = "";
  }

  /* --- görüşler (otomatik kayan) --- */
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quoteTimerRef = useRef(null);
  const qAuto = useCallback(() => {
    clearInterval(quoteTimerRef.current);
    quoteTimerRef.current = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % GORUSLER.length);
    }, 6500);
  }, []);
  useEffect(() => {
    qAuto();
    return () => clearInterval(quoteTimerRef.current);
  }, [qAuto]);
  function handleQuoteDot(i) {
    setQuoteIndex(((i % GORUSLER.length) + GORUSLER.length) % GORUSLER.length);
    qAuto();
  }

  /* --- iletişim formu --- */
  const contactFormRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [contactAlert, setContactAlert] = useState(null); // null | "bot-ok" | "ok" | "no-key" | "error"
  const [submitting, setSubmitting] = useState(false);

  async function handleContactSubmit(e) {
    e.preventDefault();
    const form = contactFormRef.current;
    const fd = new FormData(form);
    const ad = String(fd.get("name") || "").trim();
    const eposta = String(fd.get("email") || "").trim();
    const mesaj = String(fd.get("message") || "").trim();

    const errors = {};
    if (ad.length < 2) errors.name = "Lütfen adınızı yazın.";
    if (!EMAIL_RE.test(eposta)) errors.email = "Geçerli bir e-posta adresi girin.";
    if (mesaj.length < 20) errors.message = "Projeyi biraz daha anlatın (en az 20 karakter).";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (fd.get("botcheck")) {
      setContactAlert("bot-ok");
      form.reset();
      return;
    }

    if (!CONFIG.WEB3FORMS_KEY) {
      setContactAlert("no-key");
      return;
    }

    fd.append("access_key", CONFIG.WEB3FORMS_KEY);
    fd.append("subject", "decha.com — yeni proje talebi: " + ad);
    fd.append("from_name", "decha.com iletişim formu");

    setSubmitting(true);
    setContactAlert(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setContactAlert("ok");
        form.reset();
      } else throw new Error();
    } catch {
      setContactAlert("error");
    } finally {
      setSubmitting(false);
    }
  }

  /* --- bülten formu --- */
  const newsFormRef = useRef(null);
  const [newsNote, setNewsNote] = useState("");
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  async function handleNewsSubmit(e) {
    e.preventDefault();
    const form = newsFormRef.current;
    const fd = new FormData(form);
    const eposta = String(fd.get("email") || "").trim();
    if (!EMAIL_RE.test(eposta)) {
      setNewsNote("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (!CONFIG.WEB3FORMS_KEY) {
      setNewsNote("Form anahtarı tanımlı değil (CONFIG.WEB3FORMS_KEY).");
      return;
    }
    fd.append("access_key", CONFIG.WEB3FORMS_KEY);
    fd.append("subject", "decha.com — bülten kaydı");
    setNewsSubmitting(true);
    setNewsNote("Gönderiliyor…");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const d = await res.json();
      setNewsNote(d.success ? "Kaydınız alındı, teşekkürler." : "Bir sorun oluştu, tekrar deneyin.");
      if (d.success) form.reset();
    } catch {
      setNewsNote("Bir sorun oluştu, tekrar deneyin.");
    } finally {
      setNewsSubmitting(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="orb a"></div>
        <div className="orb b"></div>
        <div className="orb c"></div>
        <div className="bg-grid"></div>
        <div className="bg-noise"></div>
      </div>
      <div className="progress" id="progress" aria-hidden="true" style={{ width: progress + "%" }}></div>

      {/* ================= NAV ================= */}
      <nav className={`nav${scrolled ? " scrolled" : ""}${navHidden ? " hide" : ""}`} id="nav">
        <a href="#top" className="logo" aria-label="Decha ana sayfa">
          {/* [1] LOGO SLOT */}
          <span className="logo-word">Decha</span>
        </a>
        <ul className="nav-links" id="navlinks">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={activeSection === l.href.slice(1) ? "active" : ""}>{l.label}</a>
            </li>
          ))}
          <li className="has-dropdown">
            <button
              className="nav-more"
              id="navMoreBtn"
              aria-expanded={navMoreOpen}
              aria-controls="navMore"
              onClick={(e) => {
                e.stopPropagation();
                setNavMoreOpen((v) => !v);
              }}
            >
              Daha fazla<span className="chev" aria-hidden="true"></span>
            </button>
            <div className={`nav-dropdown glass${navMoreOpen ? " open" : ""}`} id="navMore" role="menu">
              {NAV_MORE.map((l) => (
                <a key={l.href} href={l.href} role="menuitem" onClick={() => setNavMoreOpen(false)}>
                  {l.label}
                </a>
              ))}
            </div>
          </li>
        </ul>
        <a href="#iletisim" className="btn btn-primary nav-cta">Projeni Konuşalım</a>
        <button
          className="nav-toggle"
          id="toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span></span>
        </button>
      </nav>
      <div className={`mobile glass${mobileOpen ? " open" : ""}`} id="mobile">
        {MOBILE_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMobileMenu}>{l.label}</a>
        ))}
        <a href="#iletisim" className="btn btn-primary" style={{ justifyContent: "center", marginTop: 8 }} onClick={closeMobileMenu}>
          Projeni Konuşalım
        </a>
      </div>

      <main id="top">
        {/* ================= HERO ================= */}
        <section className="hero">
          <div className="ghost-marquee" aria-hidden="true">
            <div className="ghost-track"><span>Decha</span><span>Decha</span><span>Decha</span><span>Decha</span></div>
          </div>
          <div className="container">
            <div className="hero-grid">
              <Reveal>
                <span className="badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2l2.9 6.3L21 9.3l-4.5 4.4 1 6.3L12 17l-5.5 3 1-6.3L3 9.3l6.1-1z" />
                  </svg>
                  <b>40+</b> proje canlıda — yeni kontenjan açık
                </span>
                <span className="eyebrow">Teknoloji Partneri</span>
                <h1>
                  Fikirden ürüne,<br />
                  <span className="grad rotator" id="rotator">
                    <span>{rotatorText}</span>
                  </span>
                </h1>
                <p className="lede">
                  Decha; kurumsal platformlar, mobil uygulamalar ve SaaS ürünleri geliştirir.
                  Keşiften yayına kadar tek ekiple, tek sorumlulukla ilerleriz.
                </p>
                <div className="hero-actions">
                  <a href="#iletisim" className="btn btn-primary">Projeni Konuşalım <span aria-hidden="true">→</span></a>
                  <a href="#projeler" className="btn btn-ghost">Projelerimizi gör</a>
                </div>
                <p className="hero-note"><span className="dot"></span> Yeni proje kontenjanı açık — ortalama dönüş süresi 2 iş günü</p>
              </Reveal>

              <Reveal delay={120}>
                <div className="hero-visual">
                  {/* [2] MASKOT SLOT — gerçek bir ürün ekran görüntüsü/maskot hazır olduğunda
                       bu .mock-wrap bloğunu <img src="mascot.svg" alt=""> ile değiştirebilirsiniz. */}
                  <div className="mock-wrap">
                    <div className="glass mock" aria-hidden="true">
                      <div className="mock-top">
                        <span className="mock-dot"></span><span className="mock-dot"></span><span className="mock-dot"></span>
                        <span className="mock-url">app.decha.com</span>
                      </div>
                      <div className="mock-body">
                        <div className="mock-chart">
                          <svg viewBox="0 0 240 96" preserveAspectRatio="none">
                            <polyline className="chart-line" points="0,78 34,60 68,66 102,38 136,46 170,20 204,30 240,10" fill="none" stroke="url(#mg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                              <linearGradient id="mg" x1="0" y1="0" x2="240" y2="0">
                                <stop stopColor="#5c9dff" />
                                <stop offset="1" stopColor="#22d3ee" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className="mock-bars">
                          <span style={{ height: "38%" }}></span><span style={{ height: "64%" }}></span><span style={{ height: "48%" }}></span>
                          <span style={{ height: "82%" }}></span><span style={{ height: "56%" }}></span><span style={{ height: "70%" }}></span>
                        </div>
                      </div>
                      <div className="mock-rows">
                        <div className="mock-row"><span className="mock-avatar"></span><span className="mock-line w70"></span><span className="mock-line w30"></span></div>
                        <div className="mock-row"><span className="mock-avatar"></span><span className="mock-line w50"></span><span className="mock-line w20"></span></div>
                      </div>
                    </div>
                    <span className="float-chip fc-1 glass" aria-hidden="true">%38 daha hızlı işlem</span>
                    <span className="float-chip fc-2 glass" aria-hidden="true">180K aktif kullanıcı</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= SAYAÇLAR ================= */}
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="stats rv in" id="stats" ref={statsRef}>
              {STATS.map((s) => (
                <div className="stat glass" key={s.label}>
                  <StatCounter to={s.to} prefix={s.prefix} suffix={s.suffix} dec={s.dec} started={statsStarted} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= REFERANS ŞERİDİ ================= */}
        <section style={{ padding: "38px 0 90px" }}>
          <div className="container">
            <Reveal as="p" style={{ color: "var(--faint)", fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 20 }}>
              Birlikte çalıştığımız markalar
            </Reveal>
          </div>
          <Reveal className="marquee">
            <div className="marquee-track" id="refs">
              {[...REFERANSLAR, ...REFERANSLAR].map((r, i) => (
                <div className="ref" key={i}><i></i>{r}</div>
              ))}
            </div>
          </Reveal>
          <Reveal className="marquee" style={{ marginTop: 14 }}>
            <div className="marquee-track rev" id="refs2">
              {[...[...REFERANSLAR].reverse(), ...[...REFERANSLAR].reverse()].map((r, i) => (
                <div className="ref" key={i}><i></i>{r}</div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="seam" aria-hidden="true"></div>

        {/* ================= HİZMETLER ================= */}
        <section id="hizmetler">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Çözümlerimiz</span>
              <h2>Tek ekip, uçtan uca sorumluluk.</h2>
              <p className="lede">
                Tasarım, geliştirme ve yayın süreçlerini ayrı ekiplere bölmüyoruz. Projeyi baştan sona aynı
                ekip taşır — bu yüzden devir teslim kaybı yaşamazsınız.
              </p>
            </Reveal>
            <div className="g3" id="services">
              {HIZMETLER.map((s, i) => (
                <Reveal key={s.title} delay={(i % 3) * 90}>
                  <article className="card glass svc">
                    <div className="svc-icon"><ServiceIcon name={s.icon} /></div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul>{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
                    <a className="more" href="#iletisim">Detaylı konuşalım <span aria-hidden="true">→</span></a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FARK ================= */}
        <section id="fark">
          <div className="container">
            <Reveal className="head center">
              <span className="eyebrow">Fark</span>
              <h2>Ajans yerine neden Decha?</h2>
              <p className="lede">Aynı bütçeyle çok daha az sürtünme, çok daha net sorumluluk.</p>
            </Reveal>
            <Reveal className="compare">
              <div className="compare-col compare-old">
                <h3>Klasik ajans modeli</h3>
                <ul>
                  <li><span className="ico no">✕</span>Tasarım ve geliştirme farklı taşeronlarda</li>
                  <li><span className="ico no">✕</span>Her devirde bilgi kaybı, uzayan takvim</li>
                  <li><span className="ico no">✕</span>Hesap yöneticisiyle konuşup teknik ekibe ulaşamama</li>
                  <li><span className="ico no">✕</span>Yayın sonrası destek ayrı bir sözleşme</li>
                </ul>
              </div>
              <div className="compare-col compare-decha glass">
                <h3><span className="grad">Decha</span> ile çalışmak</h3>
                <ul>
                  <li><span className="ico yes">✓</span>Tasarımı yapan ekip kodu da yazar</li>
                  <li><span className="ico yes">✓</span>Devir teslim yok, tek sorumluluk zinciri</li>
                  <li><span className="ico yes">✓</span>Kurucu ve mühendislerle doğrudan iletişim</li>
                  <li><span className="ico yes">✓</span>Yayından sonra da aynı ekip yanınızda</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= SÜREÇ ================= */}
        <section id="surec">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Nasıl çalışıyoruz</span>
              <h2>Başarıya giden dört adım.</h2>
              <p className="lede">Her projede aynı yolu izleriz. Ne zaman ne olacağını ilk gün bilirsiniz.</p>
            </Reveal>
            <div className="steps" id="steps">
              {ADIMLAR.map((s, i) => (
                <Reveal key={s.no} delay={i * 80}>
                  <article className="glass step">
                    <div className="no">{s.no}</div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <div className="bar"></div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="seam" aria-hidden="true"></div>

        {/* ================= PROJELER ================= */}
        <section id="projeler">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Seçili işler</span>
              <h2>Hayata geçirdiğimiz projeler.</h2>
              <p className="lede">Farklı sektörlerde, aynı disiplinle. Her projede ölçülebilir bir sonuç hedefliyoruz.</p>
            </Reveal>
            <Reveal className="filters" id="filters">
              {kategoriler.map((c, i) => (
                <button
                  key={c}
                  className={`chip${c === activeCat ? " on" : ""}`}
                  data-cat={c}
                  aria-pressed={c === activeCat}
                  onClick={() => setActiveCat(c)}
                >
                  {c}
                </button>
              ))}
            </Reveal>
            <div className="g2" id="projects">
              {filteredProjects.map((p, i) => (
                <div className="rv in" style={{ transitionDelay: `${(i % 2) * 70}ms` }} key={p.title}>
                  <article className="card glass prj" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave}>
                    <div className="prj-cover">
                      <div className="mesh" style={{ background: mesh(p.colors) }}></div>
                      <div className="shine"></div>
                      <span className="year">{p.year}</span>
                    </div>
                    <div className="prj-body">
                      <span className="prj-cat">{p.cat}</span>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                      <div className="prj-foot">
                        <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                        <span className="metric">{p.metric}</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= EKİP ================= */}
        <section id="ekip">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Ekip</span>
              <h2>Projenizi kimin yaptığını bilirsiniz.</h2>
              <p className="lede">Ajans havuzu yok, taşeron yok. Aşağıdaki isimler, işi baştan sona yürüten kişilerdir.</p>
              <div className="values"><span>Fikir</span><span>Enerji</span><span>Vizyon</span><span>Etki</span></div>
            </Reveal>
            <div className="g4" id="team">
              {EKIP.map((m, i) => (
                <Reveal key={m.name} delay={(i % 4) * 70}>
                  <article className="card glass member">
                    <div className="avatar" aria-hidden="true">{initials(m.name)}</div>
                    <h3>{m.name}</h3>
                    <p className="role">{m.role}</p>
                    <p className="bio">{m.bio}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= GÖRÜŞLER ================= */}
        <section id="gorusler">
          <div className="container">
            <Reveal className="head center">
              <span className="eyebrow">Referanslar</span>
              <h2>Çalıştığımız ekiplerin görüşleri.</h2>
              <p className="lede">Decha bir tedarikçi değil; markaların büyüme yolculuğunda stratejik iş ortağıdır.</p>
            </Reveal>
            <Reveal className="glass quotes">
              <div className="quotes-track" id="quotes" style={{ transform: `translateX(-${quoteIndex * 100}%)` }}>
                {GORUSLER.map((q) => (
                  <blockquote className="quote" key={q.name}>
                    <p>&ldquo;{q.text}&rdquo;</p>
                    <div className="who">
                      <div className="avatar" aria-hidden="true">{initials(q.name)}</div>
                      <div><b>{q.name}</b><span>{q.role}</span></div>
                    </div>
                  </blockquote>
                ))}
              </div>
            </Reveal>
            <div className="dots" id="qdots">
              {GORUSLER.map((_, i) => (
                <button
                  key={i}
                  className={i === quoteIndex ? "on" : ""}
                  data-i={i}
                  aria-label={`${i + 1}. görüş`}
                  onClick={() => handleQuoteDot(i)}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BLOG ================= */}
        <section id="blog">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Blog</span>
              <h2>Öğrendiklerimizi paylaşıyoruz.</h2>
              <p className="lede">Ürün geliştirme, mimari kararlar ve ekip pratikleri üzerine yazdıklarımız.</p>
            </Reveal>
            <div className="g3" id="posts">
              {YAZILAR.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <article className="card glass post">
                    <div className="post-cover" style={{ background: mesh(p.colors) }}></div>
                    <div className="post-body">
                      <span className="meta">{p.tag} · {p.date}</span>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                      <span className="more">Yazıyı oku →</span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="seam" aria-hidden="true"></div>

        {/* ================= CTA BANDI ================= */}
        <section style={{ paddingTop: 24 }}>
          <div className="container">
            <Reveal className="glass band">
              <div>
                <span className="eyebrow">Başlayalım</span>
                <h2>Dijital dünyada birlikte büyüyelim.</h2>
              </div>
              <a href="#iletisim" className="btn btn-primary" style={{ padding: "17px 32px", fontSize: 16 }}>
                Bize Ulaşın <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ================= SSS ================= */}
        <section id="sss">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">Sık sorulanlar</span>
              <h2>Merak edilenler.</h2>
              <p className="lede">Cevabını bulamadığınız bir şey olursa doğrudan yazın.</p>
            </Reveal>
            <div id="faq">
              {SSS.map((f, i) => (
                <Reveal key={f.q} delay={i * 60}>
                  <details className="glass faqi" open={i === 0}>
                    <summary>{f.q}<span className="plus" aria-hidden="true"></span></summary>
                    <p>{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= İLETİŞİM ================= */}
        <section id="iletisim">
          <div className="container">
            <Reveal className="head">
              <span className="eyebrow">İletişim</span>
              <h2>Projenizi konuşalım.</h2>
              <p className="lede">
                Formu doldurun; iki iş günü içinde, ne yapılabileceğine dair somut bir yol haritasıyla dönüş
                yapalım. Fikir aşamasındaki projelere de bakıyoruz.
              </p>
            </Reveal>

            <div className="contact">
              <Reveal>
                <div className="glass info">
                  <div className="row"><span className="k">E-posta</span><span className="v"><a href={`mailto:${CONFIG.email}`} id="mailLink">{CONFIG.email}</a></span></div>
                  <div className="row"><span className="k">Telefon</span><span className="v"><a href="tel:+902120000000">+90 (212) 000 00 00</a></span></div>
                  <div className="row"><span className="k">Adres</span><span className="v">Maslak, İstanbul · Türkiye</span></div>
                  <div className="row"><span className="k">Çalışma</span><span className="v">Hafta içi 09:00 – 18:00 (GMT+3)</span></div>
                  <div className="row"><span className="k">Yanıt</span><span className="v">Ortalama ~24 saat</span></div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <form className="glass form" id="contactForm" ref={contactFormRef} noValidate onSubmit={handleContactSubmit}>
                  <div id="formAlert">
                    {contactAlert === "ok" && (
                      <div className="alert ok" role="status">Mesajınız ulaştı. En geç iki iş günü içinde dönüş yapacağız.</div>
                    )}
                    {contactAlert === "bot-ok" && (
                      <div className="alert ok" role="status">Mesajınız ulaştı.</div>
                    )}
                    {(contactAlert === "no-key" || contactAlert === "error") && (
                      <div className="alert no" role="alert">
                        {contactAlert === "no-key" ? "Form anahtarı henüz tanımlı değil. " : "Gönderim sırasında bir sorun oluştu. "}
                        Lütfen <a href={`mailto:${CONFIG.email}`} style={{ textDecoration: "underline" }}>{CONFIG.email}</a> adresine yazın.
                      </div>
                    )}
                  </div>
                  <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

                  <div className="frow">
                    <div className="field">
                      <label htmlFor="name">Ad Soyad *</label>
                      <input id="name" name="name" type="text" placeholder="Adınız" autoComplete="name" />
                      <span className="err" data-for="name" hidden={!fieldErrors.name}>{fieldErrors.name}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="company">Şirket</label>
                      <input id="company" name="company" type="text" placeholder="Şirket adı" autoComplete="organization" />
                    </div>
                  </div>

                  <div className="frow">
                    <div className="field">
                      <label htmlFor="email">E-posta *</label>
                      <input id="email" name="email" type="email" placeholder="ad@sirket.com" autoComplete="email" />
                      <span className="err" data-for="email" hidden={!fieldErrors.email}>{fieldErrors.email}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="budget">Bütçe aralığı</label>
                      <select id="budget" name="budget">
                        <option>Henüz netleşmedi</option>
                        <option>150.000 ₺ – 400.000 ₺</option>
                        <option>400.000 ₺ – 1.000.000 ₺</option>
                        <option>1.000.000 ₺ ve üzeri</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="message">Proje hakkında *</label>
                    <textarea id="message" name="message" placeholder="Ne yapmak istiyorsunuz, hangi sorunu çözüyor, ne zamana yetişmesi gerekiyor?"></textarea>
                    <span className="err" data-for="message" hidden={!fieldErrors.message}>{fieldErrors.message}</span>
                  </div>

                  <button className="btn btn-primary" type="submit" id="submitBtn" disabled={submitting}>
                    {submitting ? "Gönderiliyor…" : <>Mesajı Gönder <span aria-hidden="true">→</span></>}
                  </button>
                  <p className="note">Gönderdiğiniz bilgiler yalnızca size dönüş yapmak için kullanılır, üçüncü taraflarla paylaşılmaz.</p>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container">
          <div className="fgrid">
            <div className="fabout">
              <span className="logo md">
                <span className="logo-word">Decha</span>
              </span>
              <p>Fikirden ürüne, ölçeklenebilir yazılım. Kurumsal platformlar, mobil uygulamalar ve SaaS ürünleri geliştiriyoruz.</p>
              <div className="social">
                <a href="#" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z" /></svg></a>
                <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.5 2h6.8l4.7 6.2zm-1.1 18h1.8L7.3 3.9H5.4z" /></svg></a>
                <a href="#" aria-label="GitHub"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.5c.5.08.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.75c0 .26.18.57.69.47A10 10 0 0 0 12 2z" /></svg></a>
              </div>
            </div>

            <div>
              <h4>Kurumsal</h4>
              <ul>
                <li><a href="#hizmetler">Hizmetler</a></li>
                <li><a href="#surec">Süreç</a></li>
                <li><a href="#projeler">Projeler</a></li>
                <li><a href="#ekip">Ekip</a></li>
              </ul>
            </div>

            <div>
              <h4>İletişim</h4>
              <ul>
                <li><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
                <li><a href="tel:+902120000000">+90 (212) 000 00 00</a></li>
                <li>Maslak, İstanbul</li>
                <li>Hafta içi 09:00 – 18:00</li>
              </ul>
            </div>

            <div>
              <h4>Bülten</h4>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Ayda bir, ürün geliştirme üzerine kısa bir e-posta. Reklam yok.</p>
              <form className="news" id="newsForm" ref={newsFormRef} onSubmit={handleNewsSubmit}>
                <input type="email" name="email" placeholder="E-posta adresiniz" aria-label="E-posta adresiniz" />
                <button className="btn btn-ghost" type="submit" disabled={newsSubmitting}>Katıl</button>
              </form>
              <p className="note" id="newsNote" style={{ minHeight: 18 }}>{newsNote}</p>
            </div>
          </div>

          <div className="fbottom">
            <span>© <span id="year">{new Date().getFullYear()}</span> Decha. Tüm hakları saklıdır.</span>
            <ul className="legal">
              <li><a href="#">KVKK Aydınlatma Metni</a></li>
              <li><a href="#">Çerez Politikası</a></li>
              <li><a href="#">Gizlilik</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <button className={`top${showToTop ? " show" : ""}`} id="toTop" aria-label="Sayfanın başına dön" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </>
  );
}
