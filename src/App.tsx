import {
  motion,
  useScroll,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  useVelocity,
  useSpring,
  useInView,
  animate
} from "motion/react";
import {
  Code2,
  Cpu,
  Layers,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  Send,
  Menu,
  X
} from "lucide-react";
import { useRef, ReactNode, useState, FormEvent, useEffect, MouseEvent, ChangeEvent } from "react";

const Section = ({ children, className = "", id = "" }: { children: ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto scroll-mt-4 md:scroll-mt-0 ${className}`}>
    {children}
  </section>
);

const ExperienceItem = ({ year, company, role, description }: { year: string, company: string, role: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-l-2 border-brand-text/10 pl-6 md:pl-8 pb-10 md:pb-12 relative last:pb-0"
  >
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-text" />
    <span className="text-xs md:text-sm font-medium opacity-50 mb-1 block">{year}</span>
    <h3 className="text-lg md:text-xl font-bold mb-1">{company}</h3>
    <p className="text-base md:text-lg font-medium mb-4 opacity-80">{role}</p>
    <p className="text-sm md:text-base text-brand-text/70 leading-relaxed max-w-2xl">{description}</p>
  </motion.div>
);

const ServiceCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 md:p-8 border border-brand-text/10 rounded-2xl bg-white/50 backdrop-blur-sm hover:border-brand-text/30 transition-colors"
  >
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-text text-brand-bg flex items-center justify-center mb-6">
      <Icon size={20} className="md:w-6 md:h-6" />
    </div>
    <h3 className="text-lg md:text-xl font-bold mb-3">{title}</h3>
    <p className="text-sm md:text-base text-brand-text/60 leading-relaxed">{description}</p>
  </motion.div>
);

const LogosMarquee = () => {
  const logos = [
    { src: "/images/carousel-logos/Aptiv_logo.svg.png", alt: "Aptiv" },
    { src: "/images/carousel-logos/Bose_logo.svg.png", alt: "Bose" },
    { src: "/images/carousel-logos/Logitech_logo.svg.png", alt: "Logitech" },
    { src: "/images/carousel-logos/Luxoft,_a_DXC_Technology_Company.png", alt: "Luxoft DXC" },
    { src: "/images/carousel-logos/TE_Lockup_RGB_BLUE.png", alt: "TE Connectivity" },
    { src: "/images/carousel-logos/logo-sii-svg.svg", alt: "Sii" },
  ];

  // Duplikujemy listę dla efektu pętli (bez przeskakiwania)
  const allLogos = [...logos, ...logos];

  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);          // aktualna pozycja X w px (ujemna = przesunięcie w lewo)
  const velocityRef = useRef(0);     // chwilowa prędkość w px/frame
  const lastScrollY = useRef(window.scrollY);
  const rafRef = useRef<number>(0);
  const halfWidthRef = useRef(0);    // szerokość jednego zestawu logo (= 50% track)

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Zmierzenie połowy szerokości (jeden zestaw logo) — robimy po klatce żeby DOM był gotowy
    const measureHalf = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measureHalf();

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      // Przelicznik: 1px scrolla = 0.018px ruchu paska (wolny, spokojny ruch)
      velocityRef.current += delta * 0.018;
    };

    const animate = () => {
      const half = halfWidthRef.current;

      if (half > 0) {
        // Zastosuj prędkość
        posRef.current -= velocityRef.current;

        // Wygaś prędkość (inercja / deceleration) — wolniejsze zatrzymywanie
        velocityRef.current *= 0.93;

        // Utrzymaj pozycję w przedziale [-half, 0] dla płynnej pętli
        if (posRef.current <= -half) {
          posRef.current += half;
        } else if (posRef.current > 0) {
          posRef.current -= half;
        }

        if (track) {
          track.style.transform = `translateX(${posRef.current}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden py-8 md:py-12 border-y border-brand-text/5 relative">
      {/* Gradient masks flush to the edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-brand-text/[0.02] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-brand-text/[0.02] to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-center gap-16 md:gap-28 w-max will-change-transform"
      >
        {allLogos.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="h-5 md:h-8 opacity-25 grayscale hover:opacity-100 transition-opacity flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

const Counter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration, ease: "easeOut" });
    }
  }, [inView, count, value, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  // Close menu on scroll or resize
  useEffect(() => {
    const handleScroll = () => setIsMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Imię jest wymagane';
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Temat jest wymagany';
    if (!formData.message.trim()) newErrors.message = 'Wiadomość jest wymagana';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'O mnie', href: '#o-mnie' },
    { name: 'Doświadczenie', href: '#doświadczenie' },
    { name: 'Usługi', href: '#usługi' },
    { name: 'Kontakt', href: '#kontakt' }
  ];

  return (
    <div ref={containerRef} className="selection:bg-brand-text selection:text-brand-bg overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 flex justify-center">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="w-full max-w-7xl backdrop-blur-xl bg-brand-bg/60 border border-brand-text/5 rounded-3xl md:rounded-full px-6 md:px-8 py-3 md:py-4 flex justify-between items-center shadow-2xl shadow-black/5 relative"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-50 transition-opacity"
          >
            <Terminal size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Start</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="hover:opacity-50 transition-opacity"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:kontakt@przemyslawmysliwiec.pl" className="hidden sm:block bg-brand-text text-brand-bg px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
              Skontaktuj się
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-brand-text/5 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 w-full mt-2 bg-brand-bg/95 backdrop-blur-2xl border border-brand-text/5 rounded-2xl p-6 shadow-2xl md:hidden flex flex-col gap-4"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-sm font-bold uppercase tracking-widest py-2 border-b border-brand-text/5 last:border-0"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="mailto:pmysliwiec99@gmail.com"
                className="bg-brand-text text-brand-bg px-4 py-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest mt-2"
              >
                Skontaktuj się
              </a>
            </motion.div>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden px-6">
        <motion.div
          style={{ opacity, scale }}
          className="text-center z-10 w-full max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-brand-text/10 rounded-full mb-8 bg-white/50 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Dostępny</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] md:text-sm font-medium uppercase tracking-widest md:tracking-[0.3em] mb-6 opacity-60 max-w-[240px] md:max-w-none mx-auto leading-relaxed"
          >
            Automation Software Test Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-tight mb-10 leading-[0.8] text-center w-full"
          >
            Przemysław<br />Myśliwiec
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-4 md:gap-6 mt-12"
          >
            <a href="https://github.com" className="p-4 border border-brand-text/10 rounded-full hover:bg-brand-text hover:text-brand-bg transition-all hover:scale-110">
              <Github size={22} />
            </a>
            <a href="https://linkedin.com" className="p-4 border border-brand-text/10 rounded-full hover:bg-brand-text hover:text-brand-bg transition-all hover:scale-110">
              <Linkedin size={22} />
            </a>
            <a href="mailto:pmysliwiec99@gmail.com" className="p-4 border border-brand-text/10 rounded-full hover:bg-brand-text hover:text-brand-bg transition-all hover:scale-110">
              <Mail size={22} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20 pointer-events-none"
        >
          <span className="text-[9px] uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown size={14} className="animate-bounce" />
        </motion.div>

        {/* Decorative Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-[0.02]">
          <div className="w-full h-full border-[1px] border-brand-text rounded-full animate-[spin_120s_linear_infinite]" />
        </div>
      </section>

      {/* About Section */}
      <Section id="o-mnie" className="pt-32 space-y-24 md:space-y-32">
        {/* Part 1 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Pasja do jakości,<br />napędzana automatyzacją.
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-brand-text/70 leading-relaxed">
              <p>
                Programista z ponad 4-letnim doświadczeniem w obszarze testów,
                wspierający zespoły w budowaniu niezawodnych frameworków testowych,
                automatyzacji procesów QA oraz dostarczaniu bezbłędnego oprogramowania z wykorzystaniem Pythona.
              </p>
              <p>
                Prowadzę praktyczne kursy oraz mentoring z zakresu Pythona,
                pomagając programistom rozwijać się od poziomu początkującego do zaawansowanego.
                Nieustannie doskonalę swoje kompetencje i pogłębiam znajomość języka, aby w pełni
                wykorzystywać jego możliwości i przesuwać granice jego zastosowań.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { label: 'QA', value: 100 },
                { label: 'CI/CD', value: 90 },
              ].map((skill, i) => (
                <div key={i} className="p-4 border border-brand-text/5 rounded-xl bg-white/50">
                  <p className="text-[10px] uppercase font-bold opacity-40 mb-1">{skill.label}</p>
                  <p className="text-2xl font-bold tracking-tighter"><Counter value={skill.value} />%</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl grain-overlay w-full lg:max-w-md ml-auto"
          >
            <img
              src="/images/image2.JPG"
              alt="Przemysław Myśliwiec Working"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-8">
            </div>
          </motion.div>
        </div>

        {/* Part 2 - Reversed Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1 grain-overlay w-full lg:max-w-md mr-auto"
          >
            <img
              src="/images/image3.JPG"
              alt="Technology Focus"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-8">
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Nieustanny rozwój,<br />nowoczesne podejście.
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-brand-text/70 leading-relaxed">
              <p>
                Oferuję kompleksowe wsparcie dla biznesu w obszarach automatyzacji testów,
                zapewnienia jakości oprogramowania (QA) oraz optymalizacji procesów IT.
              </p>
              <p>
                Jako ekspert w dziedzinie automatyzacji testów w Pythonie oraz Quality Assurance,
                pomagam organizacjom usprawniać procesy wytwórcze, skutecznie automatyzować testowanie
                oraz dostarczać oprogramowanie spełniające najwyższe standardy jakości.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { label: 'Python', value: 100 },
                { label: 'Api Testing', value: 80 },
              ].map((skill, i) => (
                <div key={i} className="p-4 border border-brand-text/5 rounded-xl bg-white/50">
                  <p className="text-[10px] uppercase font-bold opacity-40 mb-1">{skill.label}</p>
                  <p className="text-2xl font-bold tracking-tighter"><Counter value={skill.value} />%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section id="doświadczenie" className="bg-brand-text/2 py-32">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold opacity-30 mb-4">Ścieżka zawodowa</h2>
          <h3 className="text-4xl font-bold">Doświadczenie</h3>
        </div>
        <div className="max-w-4xl">
          <ExperienceItem
            year="2025 - obecnie"
            company="Logitech"
            role="Automation QA Engineer"
            description="Tworzenie i utrzymanie automatycznych testów w Pythonie dla aplikacji webowych i desktopowych. 
            Integracja testów z procesami CI/CD oraz zapewnienie wysokiej jakości oprogramowania w środowisku Agile."
          />
          <ExperienceItem
            year="2024- 2025"
            company="Bose"
            role="Automation QA Engineer"
            description="Automatyzacja testów i środowisk testowych w Pythonie, definiowanie przypadków testowych, wykonywanie testów i raportowanie wyników. 
            Praca zgodnie ze standardami branżowymi (ASPICE) oraz narzędziami takimi jak Git i Wireshark."
          />
          <ExperienceItem
            year="2021 - 2024"
            company="Aptiv"
            role="System Test Engineer"
            description="Projektowanie i wykonywanie testów systemowych dla oprogramowania automotive. 
            Automatyzacja testów w Pythonie, analiza komunikacji sieciowej i zapewnienie zgodności systemów z wymaganiami projektowymi."
          />
        </div>

        {/* Carousel — rozciągnięty na całą szerokość sekcji */}
        <div className="-mx-6 md:-mx-12 lg:-mx-24 mt-16">
          <LogosMarquee />
        </div>
      </Section>

      {/* Services Section */}
      <Section id="usługi" className="py-32">
        <div className="text-center mb-20">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold opacity-30 mb-4">W czym mogę pomóc</h2>
          <h3 className="text-4xl md:text-5xl font-bold">Moje usługi</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={Terminal}
            title="Automatyzacja testów & QA"
            description="Projektowanie i wdrażanie stabilnych frameworków testowych w Pythonie, automatyzujących procesy QA i zapewniających niezawodność oprogramowania przy minimalnym nakładzie ręcznej pracy."
          />
          <ServiceCard
            icon={Cpu}
            title="Automatyzacja IT & Rozwiązania biznesowe"
            description="Automatyzacja procesów IT, konfiguracja systemów biznesowych i optymalizacja workflow w celu zwiększenia efektywności i redukcji błędów w codziennych operacjach."
          />
          <ServiceCard
            icon={Layers}
            title="Tworzenie stron i aplikacji"
            description="Tworzenie i utrzymanie stron internetowych oraz aplikacji biznesowych, automatyzacja procesów i rozwój narzędzi wewnętrznych dopasowanych do potrzeb firmy."
          />
          <ServiceCard
            icon={Code2}
            title="Integracja CI/CD & testów"
            description="Integracja automatycznych testów w procesy ciągłej integracji i dostarczania (GitHub Actions, Jenkins, GitLab) w celu usprawnienia cyklu wytwarzania oprogramowania."
          />
          <ServiceCard
            icon={CheckCircle2}
            title="Testy wydajnościowe"
            description="Weryfikacja wydajności systemu, identyfikacja wąskich gardeł i zapewnienie stabilności oprogramowania pod obciążeniem."
          />
          <ServiceCard
            icon={ArrowRight}
            title="Szkolenia & Mentoring Pythona"
            description="Prowadzenie praktycznych szkoleń i mentoringu z Pythona, od poziomu początkującego do zaawansowanego, aby w pełni wykorzystać potencjał języka w projektach biznesowych."
          />
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section id="kontakt" className="py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Zbudujmy coś<br />niezawodnego.
            </h2>
            <p className="text-lg sm:text-xl text-brand-text/60 mb-12 max-w-md">
              Masz projekt, który wymaga solidnych fundamentów jakości? Napisz do mnie i porozmawiajmy o tym, jak mogę Ci pomóc.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 max-w-full">
                <div className="w-12 h-12 rounded-full bg-brand-text/5 flex-shrink-0 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span className="text-base sm:text-lg font-medium break-all">kontakt@przemyslawmysliwiec.pl</span>
              </div>
              <div className="flex items-center gap-4 max-w-full">
                <div className="w-12 h-12 rounded-full bg-brand-text/5 flex-shrink-0 flex items-center justify-center">
                  <Linkedin size={20} />
                </div>
                <span className="text-base sm:text-lg font-medium break-all">linkedin.com/in/pmysliwiec</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/5 border border-brand-text/5 min-h-[400px] flex flex-col justify-center"
          >
            {formStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Wiadomość wysłana!</h3>
                  <p className="text-brand-text/60 leading-relaxed max-w-sm mx-auto">
                    Dziękuję za kontakt. Twoja wiadomość dotarła do mnie bezpiecznie. Skontaktuję się z Tobą najszybciej, jak to możliwe.
                  </p>
                </div>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-text text-brand-bg rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Powrót do formularza
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Imię</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      className={`w-full bg-brand-bg/50 border ${errors.name ? 'border-red-500/50' : 'border-brand-text/5'} rounded-xl px-4 py-3 focus:outline-none focus:border-brand-text/20 transition-colors`}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className={`w-full bg-brand-bg/50 border ${errors.email ? 'border-red-500/50' : 'border-brand-text/5'} rounded-xl px-4 py-3 focus:outline-none focus:border-brand-text/20 transition-colors`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Temat</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    className={`w-full bg-brand-bg/50 border ${errors.subject ? 'border-red-500/50' : 'border-brand-text/5'} rounded-xl px-4 py-3 focus:outline-none focus:border-brand-text/20 transition-colors`}
                  />
                  {errors.subject && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Wiadomość</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full bg-brand-bg/50 border ${errors.message ? 'border-red-500/50' : 'border-brand-text/5'} rounded-xl px-4 py-3 focus:outline-none focus:border-brand-text/20 transition-colors resize-none`}
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.message}</p>}
                </div>
                <button
                  disabled={formStatus !== 'idle'}
                  className="w-full bg-brand-text text-brand-bg py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {formStatus === 'idle' && <><Send size={16} /> Wyślij wiadomość</>}
                  {formStatus === 'sending' && "Wysyłanie..."}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 border-t border-brand-text/5 bg-brand-text text-brand-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
          <div className="flex flex-col items-center md:items-start gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 hover:opacity-50 transition-opacity"
            >
              <Terminal size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Start</span>
            </button>

            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <div className="space-y-1">
                <p className="opacity-50 text-sm">© 2024 Przemysław Myśliwiec. Wszelkie prawa zastrzeżone.</p>
                <p className="opacity-30 text-[10px] max-w-xs leading-relaxed">
                  Wszystkie logotypy są znakami towarowymi ich właścicieli i zostały użyte wyłącznie w celach informacyjnych.
                </p>
              </div>
              <a href="#" className="opacity-50 text-sm hover:opacity-100 transition-opacity">Polityka Prywatności</a>
            </div>
          </div>

          <div className="flex gap-8 opacity-50 text-sm">
            <a href="https://linkedin.com/in/pmysliwiec" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
