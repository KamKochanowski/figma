# Audyt kochdesign.pl (22.10.2026)

Sprawdzone automatem (Chromium) na żywej stronie: zrzuty 1440, 768 i 390 px, cała strona główna, podstrona SOHO, treści, nagłówki, linki, meta, robots, szybkość. Podstrony Trec i Endurance są tak ciężkie, że automat nie zdążył zrobić zrzutu w 30 s. Awwwards odrzuca połączenia z serwera, na którym pracuję, więc dane o Awwwards są z wyszukiwarki (zaznaczone niżej). Behance przeczytany bezpośrednio.

## Werdykt

Strona wygląda jak szablon Framera i mówi o rynku zamiast o Tobie. Twoje najmocniejsze rzeczy z 2026 (20 projektów z PDF-a: druk, opakowania, Amazon, Meta Ads, motion, 3D, praca z Claude Code) w ogóle się na niej nie pojawiają. PDF „Wybrane projekty 2026” jest dziś lepszym portfolio niż strona.

## Co działa

1. Strona działa na telefonie i tablecie, nie przewija się w bok, układ nie skacze (CLS ok. 0,00).
2. Na górze jest jasna lista usług („What I do”), kontakt i LinkedIn są na wyciągnięcie ręki.
3. Doświadczenie jest mocne i konkretne: They (agencja 360), Trec Nutrition (4 rynki, targi FIBO, Dubai Muscle Show), Wojtex.
4. Prawdziwe zdjęcie buduje zaufanie przy freelance.
5. Dobry kierunek w temacie AI: „AI is my collaborator, not my replacement, decisions stay mine”.
6. Case studies Trec i Endurance pokazują prawdziwe kampanie, 3D i targi.

## Co nie działa (z dowodem)

| # | Problem | Dowód | Waga |
|---|---|---|---|
| 1 | Pierwszy ekran to zdjęcie i imię, zero pracy | hero 1440x900: portret, „Kamil Kochanowski”, przyciski; pierwszy projekt bardzo nisko na stronie o wysokości ok. 22 600 px | krytyczna |
| 2 | Sekcja „The numbers” to statystyki rynku, nie Twoje wyniki | 48%, 86%, 45%, 3.2x, +56% ze źródeł typu „IFDA Institute”, „Colorlib report”, „Framer Industry Benchmark 2026”; zdanie „These aren't my opinions” | krytyczna, wiarygodność |
| 3 | Brak całego 2026 | na stronie tylko Trec, Endurance, Soho i e-commerce (Behance); brak kalendarza Niemiec, AW Parts, ZOX, RPMS, Green Essence, Domator24 (11 języków), Vaillant, MOYA, MAPEI, MSD | krytyczna |
| 4 | Błąd w kontakcie | adres e-mail w sekcji kontakt linkuje do https://cal.com/ (strona główna Cal.com), nie do Twojego kalendarza ani do maila | krytyczna, łatwa |
| 5 | Wygląd szablonu | czarne tło + limonkowy akcent + Poppins i Sulphur Point; Poppins jest na Twojej liście fontów do unikania w SKILL.md | wysoka |
| 6 | Dwie różne identyfikacje | PDF i CV: Bodoni Moda + Schibsted Grotesk; strona: Poppins + Sulphur Point + Satoshi | wysoka |
| 7 | Trzy różne tytuły | hero „Senior Graphic Designer”, stopka „Creative Designer”, CV „Graphic Designer & Motion Designer” | wysoka |
| 8 | Case SOHO osłabia | zdjęcia stockowe (wieżowce, uśmiechnięta kobieta), tekst wyjustowany z dziurami, przypadkowe pogrubienia, brak Twojej roli i wyniku | wysoka |
| 9 | Brak showreela | przy „Motion Design” jako usłudze nr 2 nie ma reela na górze | wysoka |
| 10 | Suwaki umiejętności | „Figma PRO, Framer ADV, SketchUP INT” to sygnał juniorski, seniora ocenia się po pracach | średnia |
| 11 | Opinie bez autora | jedno zdanie „The feedback from customers was very positive...” bez imienia i firmy | średnia |
| 12 | SEO i dostępność | `noindex`, opis „My personal portfolio, which showcases the scope of my work.”, 110 z 198 obrazów bez opisu alt | średnia (po aktualizacji: wysoka) |
| 13 | Ciężka strona | ok. 160 zapytań i 198 obrazów na stronie głównej, podstrony Trec i Endurance nie zdążyły się wyrenderować w 30 s; LCP na desktopie wyszedł bardzo wysoki (test przez proxy, traktuj orientacyjnie), na telefonie ok. 0,8 s | średnia |
| 14 | Treść czeka na przewinięcie | na zrzucie całej strony duże puste pola: sekcje pojawiają się dopiero przy scrollu, więc podglądy linków i szybkie przewijanie pokazują pustkę | średnia |
| 15 | Języki i znaki | `lang="en"`, ale „AI Workflow Case Study (PL)”; długie myślniki w tekstach; „6+ years” na stronie, „7 lat” w PDF | niska |

## Benchmark: co robią najlepsi w 2026

**Behance (przeczytane bezpośrednio, 22.10.2026)**
- „Portfolio 2026, Art Director, Sr Graphic Designer” (opublikowane 29.12.2025): 63,1 tys. wyświetleń, 1,6 tys. docenień. Przekrój prac z markami i nagrodami (MENA Effie), narzędzia w tagach (Photoshop, Illustrator, After Effects, Premiere), zero suwaków.
- „Portfolio, Senior Graphic Designer & Art Director” (16.03.2026): 8,3 tys. wyświetleń, 7 filmów w projekcie, czyli ruch pokazany wideo, nie opisem.
- „Visual Creative Director Portfolio ©2026” (03.07.2026): całość jako wideo, tagi art direction, branding, AI.
- AI pokazane jako warsztat: „AI Product Photography for Biologique Recherche” (12.10.2026, 3 tys. wyświetleń i 227 docenień w 10 dni, tagi Midjourney, Figma, Photoshop); „AI Motion Designer Demo Reel 2026” (tagi Higgsfield, Suno, After Effects). Nikt z topowych nie pokazuje statystyk rynku. Pokazują efekt i narzędzia.
- Wnioski: projekt na Behance to pełne case study (8-15 obrazów, okładka bez tekstu, ok. 1400 px szerokości, wideo procesu). Źródło wtórne: [unilink.us, 2026](https://www.unilink.us/blog/best-behance-projects-2026).

**Awwwards (z wyszukiwarki, Awwwards blokuje automaty)**
- Ocena jury według źródeł wtórnych: Design 40%, Usability 30%, Creativity 20%, Content 10%; Honorable Mention od ok. 6,5 ([hontran.dev](https://www.hontran.dev/blog/awwwards-judging-criteria), [utsubo.com](https://www.utsubo.com/blog/award-winning-website-design-guide)).
- Portfolia z SOTD w 2026 stoją na jednym mocnym pomyśle i własnym ruchu: kinetyczna typografia (Mat Voyce), GSAP i WebGL (Minh Pham, „Made With Gsap” SOTD 29.07.2026, Nick Ho SOTD 11.10.2026). Szablon Framera bez własnego pomysłu nie przejdzie progu Creativity.
- Realny cel na pierwszy raz: Honorable Mention po wdrożeniu P0 i P1. SOTD wymaga własnej animacji (np. tekst odsłaniany zza maski, który już masz w lekcjach z RPMS) i jednego pomysłu, który niesie całą stronę.

**Rekruterzy i AD (źródła wtórne)**
- Senior ma w kilka sekund pokazać rolę i pracę, potem wynik: wyzwanie, podejście, wykonanie, mierzalny efekt ([designproject.io](https://designproject.io/jobs/senior-marketing-designer-at-1stdibs-com-pcyyzk), [colorlib](https://colorlib.com/wp/ux-portfolio-examples/)).
- AI: liczy się „jak”, nie „czy”. Pokaż szkic z AI obok finalnej pracy po Twoich decyzjach, z liczbami (czas, warianty) ([fueler.io](https://fueler.io/blog/how-to-show-ai-assisted-work-in-your-portfolio-honestly), [belmont.edu](https://belmont.edu/stories/articles/2025/ai-in-design.html)).

## Kim jesteś (na podstawie CV, PDF-ów, folderu i strony)

Graphic i motion designer z 7 latami pracy, technik procesów graficznych z wykształcenia (druk masz w kościach), dziś w agencji 360 (They: Vaillant, MOYA, MSD, MAPEI, Bridgestone, Żabka), wcześniej senior in-house w Trec Nutrition (4 rynki, targi w Kolonii i Dubaju), po godzinach studio freelance z kilkunastoma markami (opakowania, galerie Amazon, Meta Ads, kalendarze, brandbooki, UX/UI). Do tego coś, czego prawie nikt nie ma: własny system produkcji z Claude Code (research, kontrola plików do druku, skrypty do Illustratora i After Effects, Blender), opisany w CLAUDE.md i SKILL.md jak w dobrym studiu.

Najmocniejsza obietnica, jaką możesz złożyć: **od key visuala do pliku, który drukarnia przyjmuje za pierwszym razem, szybciej dzięki AI, z decyzjami po Twojej stronie.** „AI specialist” jako tytuł rozmywa przekaz. Lepiej: art director i senior graphic designer, a AI jako sposób pracy pokazany w case studies.

Propozycja nagłówka (do Twojej poprawki):
- PL: „Kamil Kochanowski. Art director i senior grafik. Kampanie, opakowania i motion, od pomysłu do pliku w drukarni.”
- EN: „Art director and senior graphic designer. Campaigns, packaging and motion, from idea to press-ready file.”

Uwaga do DELTA (AI Workflow): to wymyślona marka, w briefie Poppins, w PDF-ie długie myślniki i kropki „·”, a na stronie tytułowej zdanie „Prezentacja stworzona przez Claude”. Zamiast tego pokaż AI na prawdziwym zleceniu (kalendarz Niemiec albo RPMS), z jasnym podziałem: co zrobiło AI, co Ty.

## Plan zmian

**P0, w tym tygodniu (we Framerze na kopii, publikujesz Ty)**
1. Kontakt: mailto:kam.kochanowski@gmail.com i Twój link do Cal.com zamiast strony głównej Cal.com.
2. Pierwszy ekran: showreel 20-30 s z prac 2026 (bez dźwięku, w pętli, z okładką) i jedna linia pozycjonowania. Zdjęcie niżej, w „O mnie”.
3. Usuń sekcję „The numbers” i „How I think about design in 2026” w obecnej formie. Zamiast niej trzy Twoje liczby z projektów (np. 11 języków x ok. 20 SKU miesięcznie dla Domator24, 46 zestawień packshotów, 4 rynki Trec).
4. Siatka 6-8 najlepszych prac 2026 z PDF-a (bez marek pod NDA, a przy markach z They sprawdź, co wolno pokazać).
5. Tytuł i opis strony, alt w obrazach, jeden tytuł zawodowy wszędzie.

**P1, 2-3 tygodnie**
1. 4 pełne case studies: Ślusarstwo Niemiec (druk, 3D, UV), AW Parts (system opakowań), ZOX (galerie Amazon), kampania AI (RPMS albo MAPEI). Struktura: wyzwanie, idea w jednym zdaniu, proces z podziałem Ty i AI, wynik z liczbami, kadry. Agent „Case study” w Pulpicie robi szkice z Twoich ZADANIE.md.
2. Jedna identyfikacja ze strony, PDF-a i CV. Bodoni Moda + Schibsted Grotesk z PDF-a już działa i jest Twoja.
3. Usuń suwaki umiejętności, zostaw narzędzia jako krótką listę.
4. 3 prawdziwe opinie z imieniem i firmą, za zgodą (np. Iza z Better and More, Leszek z ZOX).
5. Lżejsze podstrony: obrazy w WebP, wideo zamiast setek klatek, mniej animacji przy scrollu.

**P2, potem**
1. Wersja PL i EN (lokalizacja we Framerze), osobne adresy.
2. Te same 4 case studies na Behance (1400 px, okładka bez tekstu, wideo procesu).
3. Włącz indeksowanie, dodaj mapę strony do Google Search Console.
4. Zgłoszenie na Awwwards po P1, z jednym własnym pomysłem w ruchu (np. tekst odsłaniany zza maski, kontrolka drukarska jako motyw).
