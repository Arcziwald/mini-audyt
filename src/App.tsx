/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Users, 
  FileText, 
  Search, 
  PhoneOff, 
  Zap,
  ArrowRight,
  RefreshCcw,
  Check,
  CheckCircle2,
  LayoutDashboard,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// --- Types ---

type Language = 'PL' | 'EN';

interface Option {
  id: 'A' | 'B' | 'C';
  text: Record<Language, string>;
  points: number;
}

interface Question {
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: React.ReactNode;
  options: Option[];
}

// --- Translations ---

const TRANSLATIONS = {
  PL: {
    auditTitle: "Zbudujmy Most",
    auditSubtitle: "Twój Indeks Gotowości na Brakomat",
    introDesc: "Sprawdź, ile energii ucieka przez brak automatycznego pomostu z klientem. Dowiedz się, jak Brakomat zamieni chaos w czysty zysk czasu.",
    startBtn: "Rozpocznij Diagnozę",
    diagnostics: "Diagnostyka",
    question: "Pytanie",
    of: "z",
    indexTitle: "Indeks Przeciążenia Operacyjnego",
    diagnosisLabel: "Diagnoza",
    recommendationLabel: "Rekomendacja (Lekarstwo)",
    practicalLabel: "Dlaczego to zadziała?",
    mathLabel: "Matematyka Twojej Straty",
    mathTitle: "Koszty Ukryte Obsługi Klienta",
    leak1Title: "1. Wyciek: Szukanie prawdy (5 min / klient / dzień)",
    leak1Desc: "Czas tracony na „śledztwa” w mailach, WhatsAppie i segregatorach, by ustalić status dokumentów.",
    leak1Bill: "Rachunek: Chaos komunikacyjny zjada ok. 4h miesięcznie.",
    leak2Title: "2. Wyciek: Ręczny Follow-up (10 min / klient)",
    leak2Desc: "Granie roli „sekretarki” i przypominanie o tych samych brakujących fakturach.",
    leak2Bill: "Rachunek: Ręczna pogoń to ok. 8h pracy jałowej.",
    leak3Title: "3. Wyciek: Weryfikacja braków (15 min / klient)",
    leak3Desc: "Ręczne sprawdzanie kompletności i wyjaśnianie z klientem, dlaczego znów czegoś brakuje.",
    leak3Bill: "Rachunek: Brak dyscypliny klienta kosztuje Cię ok. 12h miesięcznie.",
    
    // Profiles & Packages
    profileIdealTitle: "Wzorcowa Organizacja",
    profileIdealDesc: "Gratulacje! Twoje procesy są na najwyższym poziomie profesjonalizmu. Pełny raport z gratulacjami właśnie leci na Twojego maila.",
    packageIdealName: "Wzorcowa Organizacja",
    packageIdealPrice: "0 PLN",
    
    profileATitle: "Drobne nieszczelności",
    profileADesc: "Twoja organizacja jest solidna, ale istnieją drobne punkty zapalne, które można łatwo zautomatyzować.",
    packageAName: "Asystent Dokumentów",
    packageAPrice: "399 PLN / mc",
    
    profileBTitle: "Przeciążenie operacyjne",
    profileBDesc: "Twój zespół spędza zbyt dużo czasu na „pogoni” za dokumentami. Potrzebujesz głębokiego uporządkowania procesów.",
    packageBName: "Pakiet Porządkujący",
    packageBPrice: "799 PLN / mc",
    
    profileCTitle: "Stan alarmowy / Chaos",
    profileCDesc: "Operacyjne przeciążenie zagraża efektywności Twojego biura. Wymagana jest natychmiastowa transformacja i pełna automatyzacja.",
    packageCName: "Pakiet Operacyjny",
    packageCPrice: "1599 PLN / mc",
    
    ctaSystem: "ZOBACZ JAK DZIAŁA SYSTEM ARTWEBCRAFT",
    ctaBtn: "Chcesz odzyskać te godziny?",
    ctaDesc: "Wdrożymy system, który zdyscyplinuje Twoich klientów za Ciebie.",
    resetBtn: "Zacznij od nowa",
    systemLive: "System Aktywny",
    version: "Wydajność v2.5",
    forOffices: "Dla Księgowego (ale nie każdego)",
    contact: "Kontakt",
    footerDesc: "Prestiżowe narzędzia diagnostyczne dla nowoczesnej księgowości.",
    leadFormHeader: "Twoja diagnoza operacyjna jest gotowa. Gdzie mamy wysłać pełny Raport Przecieków Czasu?",
    leadNamePlaceholder: "Twoje Imię",
    leadEmailPlaceholder: "E-mail firmowy",
    leadSubmitBtn: "GENERUJ RAPORT I ODBIERZ WYNIK",
    leadSending: "Generowanie...",
    gdprInfo: "Administratorem Twoich danych jest ArtWebCraft Artur Mochnia. Dane przetwarzamy w celu przesłania wyników audytu oraz prezentacji rozwiązań AI. Pełna polityka prywatności: https://artwebcraft.com",
    gdprConsent: "Wyrażam zgodę na przetwarzanie danych w celu otrzymania raportu i ofert ArtWebCraft",
    gdprError: "Bez zgody na przetwarzanie adresu e-mail nie możemy wygenerować i przesłać indywidualnego raportu z diagnozą.",
    successHeader: "Twoja diagnoza operacyjna jest gotowa!",
    successCTA: "WEJDŹ NA MOST: SPRAWDŹ DEMO BRAKOMATU",
    timeLossLabel: "Strata Czasu",
    indexLabel: "Indeks"
  },
  EN: {
    auditTitle: "Let's build a bridge",
    auditSubtitle: "Your Brakomat Readiness Index",
    introDesc: "Check how much energy is leaking due to the lack of an automated bridge with your clients. Discover how Brakomat turns chaos into pure time profit.",
    startBtn: "Start Diagnosis",
    diagnostics: "Diagnostics",
    question: "Question",
    of: "of",
    indexTitle: "Operational Overload Index",
    diagnosisLabel: "Diagnosis",
    recommendationLabel: "Recommendation (Cure)",
    practicalLabel: "Why will it work?",
    mathLabel: "Math of Your Loss",
    mathTitle: "Hidden Costs of Client Service",
    leak1Title: "1. Leak: Finding the Truth (5 min / client / day)",
    leak1Desc: "Time lost on 'investigations' in emails, WhatsApp, and folders to determine document status.",
    leak1Bill: "Bill: Communication chaos eats approx. 4h per month.",
    leak2Title: "2. Leak: Manual Follow-up (10 min / client)",
    leak2Desc: "Playing the 'secretary' role and reminding about the same missing invoices.",
    leak2Bill: "Bill: Manual chasing is approx. 8h of idle work.",
    leak3Title: "3. Leak: Verifying Gaps (15 min / client)",
    leak3Desc: "Manually checking completeness and explaining to the client why something is missing again.",
    leak3Bill: "Bill: Lack of client discipline costs you approx. 12h per month.",
    
    // Profiles & Packages
    profileIdealTitle: "Model Organization",
    profileIdealDesc: "Congratulations! Your processes are at the highest level of professionalism. A full report with congratulations is being sent to your email.",
    packageIdealName: "Model Organization",
    packageIdealPrice: "0 PLN",
    
    profileATitle: "Minor Leaks",
    profileADesc: "Your organization is solid, but there are minor friction points that can be easily automated.",
    packageAName: "Document Assistant",
    packageAPrice: "399 PLN / mo",
    
    profileBTitle: "Operational Overload",
    profileBDesc: "Your team spends too much time 'chasing' documents. You need deep process reorganization.",
    packageBName: "Cleanup Package",
    packageBPrice: "799 PLN / mo",
    
    profileCTitle: "Emergency State / Chaos",
    profileCDesc: "Operational overload threatens your office's efficiency. Immediate transformation and full automation are required.",
    packageCName: "Operational Package",
    packageCPrice: "1599 PLN / mo",
    
    ctaSystem: "SEE HOW THE ARTWEBCRAFT SYSTEM WORKS",
    ctaBtn: "Want to regain those hours?",
    ctaDesc: "We will implement a system that disciplines your clients for you.",
    resetBtn: "Start Over",
    systemLive: "System Live",
    version: "Efficiency v2.5",
    forOffices: "For the Accountant (but not just any)",
    contact: "Contact",
    footerDesc: "Prestigious diagnostic tools for modern accounting.",
    leadFormHeader: "Your operational diagnosis is ready. Where should we send the full Time Leak Report?",
    leadNamePlaceholder: "Your Name",
    leadEmailPlaceholder: "Company Email",
    leadSubmitBtn: "GENERATE REPORT AND GET RESULT",
    leadSending: "Generating...",
    gdprInfo: "The administrator of your data is ArtWebCraft Artur Mochnia. We process data to send audit results and present AI solutions. Full privacy policy: https://artwebcraft.com",
    gdprConsent: "I consent to the processing of my data to receive the report and ArtWebCraft offers",
    gdprError: "Without consent to process your email address, we cannot generate and send an individual diagnosis report.",
    successHeader: "Your operational diagnosis is ready!",
    successCTA: "CROSS THE BRIDGE: TRY THE BRAKOMAT DEMO",
    timeLossLabel: "Time Loss",
    indexLabel: "Index"
  }
};

// --- Data ---

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: { PL: "Kanały dostarczania", EN: "Delivery Channels" },
    description: { PL: "Czy Twoi klienci „bombardują” Cię dokumentami przez WhatsApp, Messenger, e-mail i papier równocześnie?", EN: "Do your clients 'bombard' you with documents via WhatsApp, Messenger, email, and paper simultaneously?" },
    icon: <FileText className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Nie, mamy jeden sztywny kanał", EN: "No, we have one strict channel" }, points: 0 },
      { id: 'B', text: { PL: "Zdarza się, ale staramy się to tępić", EN: "It happens, but we try to stop it" }, points: 5 },
      { id: 'C', text: { PL: "To standard – szukamy faktur wszędzie", EN: "It's standard – we look for invoices everywhere" }, points: 10 },
    ]
  },
  {
    id: 2,
    title: { PL: "Dyscyplina terminowa", EN: "Deadline Discipline" },
    description: { PL: "Jaki procent klientów traktuje termin 25-go jako „sugestię”, a nie świętość?", EN: "What percentage of clients treat the 25th deadline as a 'suggestion' rather than sacred?" },
    icon: <Clock className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Prawie wszyscy są terminowi", EN: "Almost everyone is on time" }, points: 0 },
      { id: 'B', text: { PL: "Około 30-50% się spóźnia", EN: "About 30-50% are late" }, points: 5 },
      { id: 'C', text: { PL: "Większość – to walka o życie co miesiąc", EN: "Most – it's a fight for survival every month" }, points: 10 },
    ]
  },
  {
    id: 3,
    title: { PL: "Ręczne przypomnienia", EN: "Manual Reminders" },
    description: { PL: "Ile razy w miesiącu musisz grać rolę „sekretarki”, przypominając o tej samej brakującej fakturze?", EN: "How many times a month do you have to play 'secretary', reminding about the same missing invoice?" },
    icon: <RefreshCcw className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "System robi to za nas", EN: "The system does it for us" }, points: 0 },
      { id: 'B', text: { PL: "Wysyłamy maile/SMSy ręcznie", EN: "We send emails/SMS manually" }, points: 5 },
      { id: 'C', text: { PL: "Dzwonimy i prosimy się o dokumenty", EN: "We call and beg for documents" }, points: 10 },
    ]
  },
  {
    id: 4,
    title: { PL: "Szukanie prawdy", EN: "Finding the Truth" },
    description: { PL: "Czy znalezienie statusu dokumentów klienta X wymaga „śledztwa” w mailach i segregatorach?", EN: "Does finding the status of client X's documents require an 'investigation' in emails and folders?" },
    icon: <Search className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Nie, widzę to w sekundę w systemie", EN: "No, I see it in a second in the system" }, points: 0 },
      { id: 'B', text: { PL: "Muszę zapytać pracownika", EN: "I have to ask an employee" }, points: 5 },
      { id: 'C', text: { PL: "Tak, to zawsze trwa i irytuje", EN: "Yes, it always takes time and irritates" }, points: 10 },
    ]
  },
  {
    id: 5,
    title: { PL: "Wracanie do tematów", EN: "Repeating Explanations" },
    description: { PL: "Jak często musisz dwa razy wyjaśniać to samo, bo klient „nie doczytał” lub „zapomniał”?", EN: "How often do you have to explain the same thing twice because the client 'didn't read' or 'forgot'?" },
    icon: <Users className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Mamy bazę wiedzy/instrukcje", EN: "We have a knowledge base/instructions" }, points: 0 },
      { id: 'B', text: { PL: "Często, ale to część pracy", EN: "Often, but it's part of the job" }, points: 5 },
      { id: 'C', text: { PL: "Ciągle – czuję się jak zdarta płyta", EN: "Constantly – I feel like a broken record" }, points: 10 },
    ]
  },
  {
    id: 6,
    title: { PL: "Frustracja zespołu", EN: "Team Frustration" },
    description: { PL: "Czy Twoi pracownicy czują się bardziej jak księgowi, czy jak poganiacze dokumentów?", EN: "Do your employees feel more like accountants or document chasers?" },
    icon: <Zap className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Robią merytoryczną robotę", EN: "They do substantive work" }, points: 0 },
      { id: 'B', text: { PL: "Mieszane uczucia", EN: "Mixed feelings" }, points: 5 },
      { id: 'C', text: { PL: "Są sfrustrowani chaosem klientów", EN: "They are frustrated by client chaos" }, points: 10 },
    ]
  },
  {
    id: 7,
    title: { PL: "Cena chaosu", EN: "Price of Chaos" },
    description: { PL: "Czy czujesz, że chaos operacyjny klientów zjada Twój czas prywatny i spokój ducha?", EN: "Do you feel that client operational chaos eats your private time and peace of mind?" },
    icon: <AlertCircle className="w-5 h-5 text-[#5b7fff]" />,
    options: [
      { id: 'A', text: { PL: "Nie, mam pełną kontrolę", EN: "No, I have full control" }, points: 0 },
      { id: 'B', text: { PL: "Czasem biorę pracę do domu", EN: "Sometimes I take work home" }, points: 5 },
      { id: 'C', text: { PL: "Tak, czuję ciągłe napięcie", EN: "Yes, I feel constant tension" }, points: 10 },
    ]
  }
];

// --- Components ---

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-10 relative">
      <motion.div 
        className="h-full gradient-primary glow-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: "circOut" }}
      />
    </div>
  );
};

const LeadForm = ({ onComplete, lang, score, answers, recommendedPackage }: { onComplete: (email: string) => void, lang: Language, score: number, answers: Record<number, number>, recommendedPackage: string }) => {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showGdprError, setShowGdprError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    if (!gdprAccepted) {
      setShowGdprError(true);
      return;
    }

    setIsSending(true);
    setShowGdprError(false);
    
    try {
      // Webhook to n8n
await fetch('https://n8n.srv1151721.hstgr.cloud/webhook/mini-audyt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name,
    email,
    score: Math.round((score / 70) * 100),
    answers,
    recommendedPackage,
    lang,
    timestamp: new Date().toISOString(),
    gdprConsent: true
  })
});

// --- DODANE KODY ŚLEDZENIA ZDARZEŃ ---
// 1. Meta Pixel - Zdarzenie Lead
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Lead', {
    content_name: 'Mini Audyt Księgowy',
    value: 0.00,
    currency: 'PLN'
  });
}

// 2. Google Tag Manager / GA4 - Zdarzenie Lead
if (typeof window !== 'undefined' && (window as any).dataLayer) {
  (window as any).dataLayer.push({
    event: 'generate_lead',
    form_name: 'mini_audyt_form',
    package_recommended: recommendedPackage
  });
}
// ------------------------------------

} catch (error) {
  console.error('Webhook failed:', error);
} finally {
  setIsSending(false);
  onComplete(email);
}
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full mx-auto"
    >
      <div className="bg-brand-card/60 backdrop-blur-xl rounded-[24px] p-8 md:p-12 border border-brand-border shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <FileText className="w-24 h-24 text-brand-primary-start" />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 glow-primary">
            <CheckCircle2 className="text-white w-8 h-8" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter leading-none">
            {t.leadFormHeader}
          </h2>
          
          <p className="text-gray-400 mb-10 font-medium tracking-tight">
            {lang === 'PL' 
              ? 'Twój wynik jest gotowy. Podaj dane, abyśmy mogli przesłać Ci pełną analizę i rekomendacje.' 
              : 'Your result is ready. Provide your details so we can send you a full analysis and recommendations.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  {t.leadNamePlaceholder}
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.leadNamePlaceholder}
                  className="w-full bg-black/40 border border-brand-border rounded-xl px-5 py-4 text-white focus:border-brand-primary-start focus:ring-1 focus:ring-brand-primary-start outline-none transition-all font-bold placeholder:text-gray-700"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                  {t.leadEmailPlaceholder}
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.leadEmailPlaceholder}
                  className="w-full bg-black/40 border border-brand-border rounded-xl px-5 py-4 text-white focus:border-brand-primary-start focus:ring-1 focus:ring-brand-primary-start outline-none transition-all font-bold placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[11px] leading-relaxed text-gray-400 font-medium">
                  {t.gdprInfo}
                </p>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox"
                    checked={gdprAccepted}
                    onChange={(e) => {
                      setGdprAccepted(e.target.checked);
                      if (e.target.checked) setShowGdprError(false);
                    }}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${gdprAccepted ? 'bg-brand-primary-start border-brand-primary-start' : 'border-gray-600 group-hover:border-gray-400'}`}>
                    {gdprAccepted && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-semibold leading-tight select-none">
                  {t.gdprConsent}
                </span>
              </label>

              <AnimatePresence>
                {showGdprError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                  >
                    <p className="text-[11px] text-rose-400 font-bold flex items-center">
                      <AlertCircle className="w-3 h-3 mr-2 shrink-0" />
                      {t.gdprError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className={`w-full py-5 px-8 mt-2 gradient-warning text-white font-black rounded-[16px] transition-all glow-warning group text-xl uppercase tracking-tight flex items-center justify-center ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isSending ? t.leadSending : t.leadSubmitBtn}
              {!isSending && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const ResultCard = ({ score, answers, onReset, lang, email }: { score: number, answers: Record<number, number>, onReset: () => void, lang: Language, email: string }) => {
  const [showMath, setShowMath] = useState(false);
  const percentage = Math.round((score / 70) * 100);
  const t = TRANSLATIONS[lang];
  
  const result = useMemo(() => {
    // Logic Segments based on System Prompt
    
    // PROFIL C: "Transformacja Operacyjna" (Indeks 76-100%)
    if (percentage >= 76) {
      return {
        profileId: 'C',
        title: t.profileCTitle,
        diagnosis: t.profileCDesc,
        recommendation: t.packageCName,
        price: t.packageCPrice,
        timeLoss: "25h+",
        practical: [
          {
            title: lang === 'PL' ? "Pełna tarcza operacyjna" : "Full Operational Shield",
            desc: lang === 'PL' ? "Przejmujemy proces fakturowania i kontrolę nad obiegiem płatności." : "We take over the invoicing process and control over payment flow.",
            icon: <Zap className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Automatyzacja płatności" : "Payment Automation",
            desc: lang === 'PL' ? "Integracja z bankowością i automatyczne rozliczanie dokumentów." : "Integration with banking and automatic document settlement.",
            icon: <RefreshCcw className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Dedykowane procesy" : "Dedicated Processes",
            desc: lang === 'PL' ? "Szyte na miarę procedury eliminujące chaos w 100%." : "Tailor-made procedures eliminating chaos 100%.",
            icon: <Search className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Opiekun wdrożenia" : "Implementation Manager",
            desc: lang === 'PL' ? "Osobiste wsparcie w transformacji Twojego biura." : "Personal support in transforming your office.",
            icon: <Users className="w-5 h-5" />
          }
        ],
        color: "text-rose-400",
        glow: "shadow-[0_0_30px_rgba(251,113,133,0.2)]",
        border: "border-rose-400/30",
        bg: "bg-rose-400/5"
      };
    }
    
    // PROFIL A: "Szybka Naprawa" (Indeks 0-40%)
    if (percentage <= 40) {
      return {
        profileId: 'A',
        title: t.profileATitle,
        diagnosis: t.profileADesc,
        recommendation: t.packageAName,
        price: t.packageAPrice,
        timeLoss: "5-8h",
        practical: [
          {
            title: lang === 'PL' ? "Scalenie kanałów" : "Channel Merging",
            desc: lang === 'PL' ? "WhatsApp, Email i Messenger w jednym, uporządkowanym miejscu." : "WhatsApp, Email, and Messenger in one organized place.",
            icon: <FileText className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Powiadomienia Real-time" : "Real-time Notifications",
            desc: lang === 'PL' ? "Natychmiastowa informacja o każdym nowym dokumencie." : "Immediate information about every new document.",
            icon: <Zap className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Panel Klienta" : "Client Portal",
            desc: lang === 'PL' ? "Koniec z pytaniami 'czy dotarło' – klient widzi status sam." : "No more 'did it arrive' questions – the client sees the status themselves.",
            icon: <Search className="w-5 h-5" />
          },
          {
            title: lang === 'PL' ? "Oszczędność czasu" : "Time Savings",
            desc: lang === 'PL' ? "Odzyskujesz ok. 5-8h miesięcznie na samej komunikacji." : "You regain approx. 5-8h per month on communication alone.",
            icon: <Clock className="w-5 h-5" />
          }
        ],
        color: "text-emerald-400",
        glow: "shadow-[0_0_30px_rgba(52,211,153,0.2)]",
        border: "border-emerald-400/30",
        bg: "bg-emerald-400/5"
      };
    }

    // PROFIL B: "Głębokie Uporządkowanie" (Default 40-75%)
    return {
      profileId: 'B',
      title: t.profileBTitle,
      diagnosis: t.profileBDesc,
      recommendation: t.packageBName,
      price: t.packageBPrice,
      timeLoss: "15-20h",
      practical: [
        {
          title: lang === 'PL' ? "Inteligentny Follow-up" : "Intelligent Follow-up",
          desc: lang === 'PL' ? "System sam ściga klientów o brakujące faktury i dokumenty." : "The system automatically chases clients for missing invoices and documents.",
          icon: <RefreshCcw className="w-5 h-5" />
        },
        {
          title: lang === 'PL' ? "Weryfikacja kompletności" : "Completeness Verification",
          desc: lang === 'PL' ? "AI sprawdza czy dokumenty są czytelne i czy niczego nie brakuje." : "AI checks if documents are legible and if anything is missing.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: lang === 'PL' ? "Raporty terminowości" : "Deadline Reports",
          desc: lang === 'PL' ? "Widzisz czarno na białym, kto notorycznie spóźnia się z dostawą." : "You see clearly who is notoriously late with delivery.",
          icon: <Search className="w-5 h-5" />
        },
        {
          title: lang === 'PL' ? "Spokój zespołu" : "Team Peace",
          desc: lang === 'PL' ? "Koniec z rolą 'sekretarki' – Twoi ludzie robią merytoryczną robotę." : "No more 'secretary' role – your people do substantive work.",
          icon: <Users className="w-5 h-5" />
        }
      ],
      color: "text-brand-primary-start",
      glow: "shadow-[0_0_30px_rgba(91,159,255,0.2)]",
      border: "border-brand-primary-start/30",
      bg: "bg-brand-primary-start/5"
    };
  }, [percentage, lang, t]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`max-w-2xl w-full mx-auto bg-[#1A1F2E]/80 backdrop-blur-xl rounded-[24px] border border-brand-border glow-primary overflow-hidden mb-12 summary-banner`}
    >
      <div className="p-8 md:p-12 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 glow-primary">
            <CheckCircle2 className="text-white w-8 h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tighter leading-none">
            {t.successHeader}
          </h2>
          <p className="text-brand-primary-start font-bold tracking-tight">{email}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{t.indexLabel}</p>
            <p className="text-2xl font-black text-gradient-primary tracking-tighter">{percentage}%</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{t.timeLossLabel}</p>
            <p className="text-2xl font-black text-rose-400 tracking-tighter">{result.timeLoss}</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Pakiet</p>
            <p className="text-sm font-black text-emerald-400 tracking-tight leading-tight mt-1">{result.recommendation}</p>
          </div>
        </div>
        
        <div className="space-y-6 text-left mb-10">
          {/* Diagnosis Section */}
          <div className={`${result.bg} rounded-2xl p-6 border border-white/5 relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${result.color.replace('text', 'bg')}`} />
            <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${result.color}`}>{t.diagnosisLabel}</h3>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
              {result.diagnosis}
            </p>
          </div>

          {/* Practical Points Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{t.practicalLabel}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.practical.map((item, idx) => (
                <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-start space-x-3">
                  <div className={`mt-1 ${result.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white mb-1">{item.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <a 
            href="https://client.accounting.artwebcraft.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-5 px-8 gradient-warning hover:scale-[1.01] active:scale-[0.99] text-white font-black rounded-[16px] transition-all glow-warning group text-xl uppercase tracking-tight"
          >
            {t.successCTA}
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
          
          {/* Math Section Toggle */}
          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => setShowMath(!showMath)}
              className="flex items-center justify-center mx-auto text-[10px] font-black text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors py-2"
            >
              <Info className="w-3 h-3 mr-2" />
              {t.mathLabel}
              {showMath ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
            </button>
            
            <AnimatePresence>
              {showMath && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 p-6 bg-black/60 rounded-2xl border border-white/5 text-left space-y-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Zap className="w-12 h-12 text-[#5b7fff]" />
                    </div>
                    <h4 className="text-xs font-black text-[#5b7fff] uppercase tracking-widest">{t.mathTitle}</h4>
                    
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <p className="text-sm font-black text-white flex items-center">
                          <span className="w-1 h-1 bg-[#5b7fff] rounded-full mr-2" />
                          {t.leak1Title}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed pl-3">
                          {t.leak1Desc} <br/>
                          <span className="text-[#5b7fff] font-bold">{t.leak1Bill}</span>
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black text-white flex items-center">
                          <span className="w-1 h-1 bg-[#5b7fff] rounded-full mr-2" />
                          {t.leak2Title}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed pl-3">
                          {t.leak2Desc} <br/>
                          <span className="text-[#5b7fff] font-bold">{t.leak2Bill}</span>
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black text-white flex items-center">
                          <span className="w-1 h-1 bg-[#5b7fff] rounded-full mr-2" />
                          {t.leak3Title}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed pl-3">
                          {t.leak3Desc} <br/>
                          <span className="text-[#5b7fff] font-bold">{t.leak3Bill}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={onReset}
            className="mt-10 text-gray-600 hover:text-[#5b7fff] text-xs font-black tracking-[0.3em] uppercase transition-all flex items-center mx-auto group"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            {t.resetBtn}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('PL');
  const [step, setStep] = useState<number>(0); 
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const t = TRANSLATIONS[lang];

  const handleAnswer = (points: number, optionId: 'A' | 'B' | 'C') => {
    setSelectedOption(optionId);
    
    setTimeout(() => {
      const newAnswers = { ...answers, [step]: points };
      setAnswers(newAnswers);
      setStep(step + 1);
      setSelectedOption(null);
    }, 400);
  };

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((acc: number, curr: number) => acc + curr, 0);
  }, [answers]);

  const recommendedPackage = useMemo(() => {
    const percentage = Math.round((totalScore / 70) * 100);
    if (percentage >= 76) return TRANSLATIONS[lang].packageCName;
    if (percentage >= 41) return TRANSLATIONS[lang].packageBName;
    if (percentage >= 11) return TRANSLATIONS[lang].packageAName;
    return TRANSLATIONS[lang].packageIdealName;
  }, [totalScore, lang]);

  const reset = () => {
    setStep(0);
    setAnswers({});
    setSelectedOption(null);
    setUserEmail('');
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-white selection:bg-brand-primary-start/40 overflow-x-hidden flex flex-col calc-container">
      {/* Particle Background Simulation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Navigation */}
<nav className="relative z-20 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
  <div className="max-w-3xl mx-auto px-6 py-6 flex justify-between items-center">
    <div className="flex items-center space-x-4 group cursor-pointer" onClick={reset}>
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#4facfe] to-[#9747ff] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <img 
          src="logo_accounting_artwebcraft.png" 
          alt="ArtWebCraft Accounting Logo" 
          className="relative w-12 h-12 rounded-full object-cover border border-white/10"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#4facfe] to-[#9747ff]">
        ArtWebCraft
      </span>
    </div>

    <div className="flex items-center space-x-6">
      {/* Language Switcher Pill */}
      <div className="bg-black/40 p-1 rounded-full border border-brand-border flex items-center">
        <button 
          onClick={() => setLang('EN')}
          className={`px-3 py-1 text-xs font-black rounded-full transition-all ${lang === 'EN' ? 'gradient-primary text-white glow-primary' : 'text-gray-500 hover:text-gray-300'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang('PL')}
          className={`px-3 py-1 text-xs font-black rounded-full transition-all ${lang === 'PL' ? 'gradient-primary text-white glow-primary' : 'text-gray-500 hover:text-gray-300'}`}
        >
          PL
        </button>
      </div>
      
      <div className="hidden sm:flex items-center space-x-2">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{t.systemLive}</span>
      </div>
    </div>
  </div>
</nav>

      <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-8 md:py-16">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-center max-w-3xl flex flex-col items-center"
            >
              <div className="relative mb-10 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4facfe] to-[#9747ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <img 
                  src="/logo_accounting_artwebcraft.png" 
                  alt="ArtWebCraft Logo" 
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-white/10 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="inline-block px-6 py-2 mb-8 bg-[#5b7fff]/10 border border-[#5b7fff]/20 text-[#5b7fff] text-sm md:text-base font-black uppercase tracking-[0.3em] rounded-full">
                {t.forOffices}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                {t.auditTitle} <br />
                <span className="text-gradient-primary">{t.auditSubtitle}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-tight font-medium tracking-tight">
                {t.introDesc}
              </p>
              <button 
                onClick={() => setStep(1)}
                className="inline-flex items-center px-6 py-3 gradient-warning hover:scale-105 active:scale-95 text-white font-black rounded-[16px] transition-all glow-warning group text-lg"
              >
                {t.startBtn}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= QUESTIONS.length && (
            <motion.div 
              key={`q-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl w-full mx-auto"
            >
              <div className="flex justify-between items-end mb-6 px-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-[#5b7fff] uppercase tracking-[0.3em]">{t.diagnostics}</span>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.question} {step} {t.of} {QUESTIONS.length}</h3>
                </div>
                <span className="text-xl font-black text-white/20 tracking-tighter">{Math.round((step/QUESTIONS.length)*100)}%</span>
              </div>
              <ProgressBar current={step} total={QUESTIONS.length} />
              
              <div className="bg-brand-card/60 backdrop-blur-xl rounded-[24px] p-6 md:p-10 border border-brand-border shadow-2xl relative overflow-hidden">
                <div className="mb-8 flex items-center gap-5 relative z-10">
                  <div className="w-12 h-12 glass-icon flex items-center justify-center shrink-0">
                    <span className="text-gradient-primary font-black text-lg tracking-tighter">
                      {step < 10 ? `0${step}` : step}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white mb-0.5 tracking-tighter leading-none">
                      {QUESTIONS[step - 1].title[lang]}
                    </h2>
                    <p className="text-sm text-gray-400 font-medium tracking-tight">{QUESTIONS[step - 1].description[lang]}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 relative z-10">
                  {QUESTIONS[step - 1].options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.points, option.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group flex items-center justify-between relative overflow-hidden task-item task-item-glow ${
                        selectedOption === option.id 
                        ? 'border-brand-primary-start bg-brand-primary-start/10 glow-primary' 
                        : 'border-brand-border bg-black/30 hover:border-brand-primary-start/30 hover:bg-brand-card-hover'
                      }`}
                    >
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs transition-all duration-300 ${
                          selectedOption === option.id 
                          ? 'gradient-primary text-white glow-primary' 
                          : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'
                        }`}>
                          {option.id}
                        </div>
                        <span className={`text-base font-bold transition-colors duration-300 ${
                          selectedOption === option.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {option.text[lang]}
                        </span>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedOption === option.id ? 'border-brand-primary-start gradient-primary scale-110' : 'border-white/10'
                      }`}>
                        {selectedOption === option.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === QUESTIONS.length + 1 && (
            <LeadForm 
              onComplete={(email) => {
                setUserEmail(email);
                setStep(step + 1);
              }} 
              lang={lang} 
              score={totalScore} 
              answers={answers} 
              recommendedPackage={recommendedPackage}
            />
          )}

          {step === QUESTIONS.length + 2 && (
            <ResultCard score={totalScore} answers={answers} onReset={reset} lang={lang} email={userEmail} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-white/5 mt-auto bg-black/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <p className="text-gray-600 text-xs font-black uppercase tracking-[0.4em]">
                © 2026 ArtWebCraft
              </p>
              <span className="hidden md:block text-gray-700">|</span>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                All Rights Reserved
              </p>
            </div>
            <p className="text-gray-500 text-sm font-semibold">
              Budujemy mosty między technologią a księgowością.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
            <div className="text-left">
              <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Legal</p>
              <a 
                href="https://artwebcraft.com/polityka" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-[#5B9FFF] hover:text-white transition-colors underline decoration-[#5B9FFF]/30"
              >
                Privacy Policy
              </a>
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Contact</p>
              <p className="text-sm font-bold text-gray-400">accounting@artwebcraft.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
