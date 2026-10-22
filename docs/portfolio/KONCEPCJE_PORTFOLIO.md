# Koncepcje portfolio kochdesign.pl

Na podstawie `RESEARCH_PORTFOLIO.md`. Każda koncepcja ma ideę w jednym zdaniu, wygląd, zachowanie, tryb szybki, technologię, czas i ryzyko. Na końcu druga analiza i rekomendacja.

## Punkt wyjścia

- **Kim jesteś na stronie:** art director i senior grafik, który prowadzi pracę od key visuala do pliku przyjętego przez drukarnię, z AI jako częścią warsztatu.
- **Dla kogo:** (1) agencje i dyrektorzy kreatywni (szukają punktu widzenia i jakości), (2) klienci bezpośredni i Useme (szukają pewności, że dowieziesz), (3) rekruterzy (55 sekund, szukają ról, marek i wyników).
- **Twarde zasady:** praca widoczna od pierwszej sekundy, 5-8 case studies, tryb szybki zawsze pod ręką, bez długich myślników i kropek „·”, bez marek pod NDA, przy markach z They zgoda agencji.

---

## A. ARKUSZ (rekomendacja główna)

**Idea:** portfolio to arkusz prosto z maszyny drukarskiej, na którym są złożone wszystkie Twoje prace, z paskiem kontrolnym, znacznikami cięcia i lupą drukarską do oglądania detali.

**Dlaczego Ty:** technik procesów graficznych z wykształcenia, druk to Twoja przewaga (PDF/X-4, UV, spady, CMYK FOGRA39). Jury nagradza metafory z życia autora (Minitel, BIOS), a tej nie ma nikt z ponad 90 sprawdzonych stron.

**Pierwszy ekran:** jasnoszary stół, na nim biały arkusz z 20 „użytkami” (Twoje projekty w formie stron) z linią cięcia. Na marginesie pasek kontrolny: farby C, M, Y, K i kolory Twoich klientów (żółty Niemca #F8B002, czerwień AW Parts #E31C25). Na marginesie drukarskim (slug) tekst: „KOCHANOWSKI_PORTFOLIO_2026, arkusz 1/1, 4/4 CMYK, FOGRA39”. Nazwisko i jedna linia pozycjonowania jak na metryczce arkusza. **Prace widać od razu**, więc test 55 sekund przechodzi bez klikania.

**Zachowanie:**
- przeciąganie i przybliżanie arkusza (mysz, gładzik, dotyk), przyciski + i -;
- kursor nad arkuszem zmienia się w **lupę drukarską** (licznik nitek) i powiększa detal 2,5x: rastry, ostre krawędzie, pliki do druku;
- kliknięcie użytku otwiera **kartę zlecenia** (jak karta z drukarni): klient, rok, kanał, format, narzędzia, „co zrobiło AI”, „co ja”, wynik w liczbach, przycisk do pełnego case study;
- wejście strony: arkusz „wychodzi z maszyny”, cztery przebiegi farb C, M, Y, K nakładają się w 1,2 s, potem tekst. Z `prefers-reduced-motion` od razu gotowy arkusz;
- opcjonalny dźwięk: krótki odgłos maszyny przy otwarciu karty, tylko po włączeniu.

**Tryb szybki:** przycisk „Lista prac” (klawisz L) zawsze w prawym górnym rogu: zwykła lista z miniaturą, klientem, rokiem i jedną linią wyniku. Na telefonie lista jest domyślna, arkusz pod przyciskiem.

**Fizyczne przedłużenie:** ten sam arkusz wydrukowany (np. B1 złożony do A4, z lakierem UV wybiórczo na Twoim nazwisku) jako przesyłka do agencji, z QR na stronę. Zgodnie z radą Louisa Mossa: zostaje na biurku.

**Technologia:** Framer, kolekcja CMS „Projekty”, strona case study z szablonu CMS, a sam arkusz jako własny komponent kodu (`Arkusz.tsx` w tej paczce, React i transformacje CSS, bez WebGL). Efekt przebiegów farb: CSS (mix-blend-mode: multiply) albo Unicorn Studio. Animowana typografia: wtyczka Kinetic Type albo GSAP.

**Czas:** 6-9 wieczorów z lokalnym Claude (komponent jest gotowy w wersji startowej, dochodzi treść, case studies i dopieszczanie).

**Ryzyko:** metafora może wyglądać jak ozdobnik dla klientów UX i social. Rozwiązanie: projekty cyfrowe też są „użytkami” na arkuszu, a jedno zdanie w nagłówku tłumaczy ideę.

---

## B. KK_STUDIO (system produkcji jako interfejs)

**Idea:** portfolio to Twoje prawdziwe studio: foldery marek, zadania ZAD_NN, eksporty i Claude, który pilnuje zasad, tak jak pracujesz na co dzień.

**Wygląd:** okno w stylu Findera z drzewem `PROJEKTY GRAFICZNE/AW_PARTS/ZAD_02_druk_D2_pudelka_foliopak/05_export`, podgląd plików (Quick Look), okno „Claude” z fragmentem Twoich zasad (CLAUDE.md: „Nic nie kasuj na stałe”, „stop znaczy stop”), aplikacja „Preflight” z raportem pliku. Menu to nazwy plików jak u EddyOS: `prace.vol`, `o_mnie.md`, `kontakt.app`.

**Dlaczego:** najmocniej pokazuje „AI specialist” jako system pracy, nie generowanie obrazków. Agencje widzą, że uporządkujesz im produkcję.

**Tryb szybki:** „Otwórz folder 05_export” daje płaską listę prac.

**Technologia:** Next.js albo Framer z komponentami okien, dane z Twoich plików MARKA.md i ZADANIE.md (eksport skryptem do JSON, bez NDA).

**Czas:** 9-12 wieczorów. **Ryzyko:** system operacyjny to moda z gotowymi szablonami (Moreau OS, RetroOS, AeroOS we Framerze). Wyróżnia się tylko wtedy, gdy struktura jest Twoja prawdziwa.

---

## C. ZAPYTAJ STUDIO (warstwa AI do A albo B)

**Idea:** portfolio, z którym rozmawiasz: pytasz o druk, opakowania albo AI i dostajesz odpowiedź z kartami prawdziwych projektów.

**Wygląd:** przycisk „Zapytaj” przy nawigacji, panel z polem pytania i podpowiedziami dla trzech odbiorców: „Jestem z agencji”, „Potrzebuję opakowań do druku”, „Rekrutuję art directora”. Odpowiedź ma 2-4 zdania i karty projektów, a pod nią kolejne pytania i „Umów rozmowę” (Cal.com).

**Zasady:** odpowiada tylko z bazy wiedzy (case studies i CV), bez wycen (Twoja zasada), bez marek pod NDA. Gdy nie wie, mówi to wprost i daje mail. Pokazuje źródło (kartę projektu).

**Technologia:** komponent czatu we Framerze i mała funkcja serwerowa (Cloudflare Workers albo Vercel), która trzyma klucz API i wysyła pytanie z bazą wiedzy do modelu Claude. Limit długości, limit pytań na odwiedzającego, gotowe odpowiedzi na 10 najczęstszych pytań bez wywołania modelu. Szablon funkcji jest w tej paczce (`zapytaj-worker.ts`).

**Czas:** 3-4 wieczory. **Ryzyko:** gadżet bez treści. Dlatego to warstwa, nie główna nawigacja.

---

## D. KONTAKTÓWKA (archiwum)

**Idea:** wszystkie Twoje pliki z 05_export na jednej stykówce, z nazwami plików pod klatkami, jak katalog Bena Mingo.

**Wygląd:** siatka klatek z podpisami w stylu `AW_PARTS_ZAD02_foliopak_przod.pdf`, filtry: druk, opakowania, Amazon, Meta Ads, motion, 3D, UX. Klik otwiera powiększenie.

**Dlaczego:** pokazuje skalę (setki gotowych plików) bez rozbijania case studies. Dobre jako podstrona „Archiwum” w A.

**Technologia:** Framer CMS i siatka, 1-2 wieczory.

---

## E. Wersja bezpieczna (minimum)

Reel 20-30 s na pierwszym ekranie, jedna linia pozycjonowania, 6 kart case studies, marki, kontakt. 2-3 wieczory we Framerze na kopii. Ta wersja realizuje P0 z audytu i jest bazą, na którą później wchodzi A.

---

## Ocena (1-5)

| Kryterium | A Arkusz | B Studio OS | C Zapytaj | D Kontaktówka | E Minimum |
|---|---|---|---|---|---|
| Twój świat, nie do podrobienia | 5 | 4 | 3 | 3 | 2 |
| Praca w 55 sekund | 5 | 3 | 3 | 5 | 5 |
| Pokazuje druk i produkcję | 5 | 4 | 3 | 4 | 3 |
| Pokazuje AI w praktyce | 3 | 5 | 5 | 2 | 2 |
| Telefon | 4 | 2 | 4 | 5 | 5 |
| Czas i koszt | 4 | 2 | 3 | 5 | 5 |
| Szansa na nagrodę (CSSDA, Framer, Awwwards HM) | 5 | 4 | 3 | 2 | 1 |
| **Suma** | **31** | **24** | **24** | **26** | **23** |

## Druga analiza (krytyka własnych pomysłów)

1. **Czy A to nie ozdobnik?** Sprawdzian z frontend-design: po zmianie nazwiska strona nadal pasowałaby tylko do kogoś z drukiem w CV. Pasek kontrolny niesie informację (kolory marek i stan prac), lupa pokazuje jakość plików, karta zlecenia zastępuje case study w pigułce. Zostaje.
2. **Czy A przejdzie 55 sekund?** Tak, bo prace leżą na arkuszu od pierwszej klatki, a lista jest pod jednym klawiszem. Wejście z przebiegami farb trwa 1,2 s i nie blokuje kliknięć.
3. **Czy to nie „near-black z jednym akcentem” albo „krem z szeryfem”?** Nie: biały papier powlekany na chłodnym szarym stole, kolor tylko z farb procesowych i kolorów klientów. Bodoni Moda zostaje do nazwiska i liczb, bo to Twoja identyfikacja z PDF-a.
4. **Czego A nie pokazuje dobrze?** AI. Dlatego C jako warstwa i przekładka „co zrobiło AI, co ja” w każdej karcie zlecenia.
5. **Co z B?** Mocny, ale moda na OS jest zbyt widoczna (szablony we Framerze, EddyOS, ryOS). Elementy B wchodzą do case studies: zrzut struktury folderów i zasad z CLAUDE.md jako dowód procesu.
6. **Waga:** 20 użytków jako miniatury WebP (ok. 60-90 KB), duże pliki dopiero przy przybliżeniu. Cel: strona główna poniżej 5 MB.
7. **Marki z They:** Vaillant, MOYA, MAPEI i MSD są w PDF-ie, ale przed publikacją na stronie zapytaj agencję. Na arkuszu można je pokazać jako „przez agencję They” albo zostawić puste użytki z podpisem „pod NDA”, co też jest prawdziwe i ciekawe.

## Rekomendacja

**A jako główna strona + D jako „Archiwum” + C jako „Zapytaj”, a pod spodem struktura E.**

Kolejność:
1. **Tydzień 1:** P0 z audytu na kopii we Framerze (kontakt, tytuły, usunięcie statystyk rynku, 6 kart prac).
2. **Tydzień 2-3:** Arkusz: komponent z tej paczki, kolekcja CMS „Projekty”, 6 case studies według szablonu niżej.
3. **Tydzień 4:** Zapytaj (funkcja i komponent), Archiwum, wersja EN.
4. **Potem:** druk arkusza dla agencji, zgłoszenie do CSS Design Awards i Framer Awards, włączenie indeksowania.

## Struktura strony (A + C + D + E)

```
/                 Arkusz (z listą prac pod klawiszem L) + reel w karcie „Showreel”
/prace/[slug]     Case study z CMS
/archiwum         Kontaktówka
/o-mnie           Krótko: rola, marki, sposób pracy z AI, CV do pobrania
/kontakt          Mail, Cal.com, LinkedIn, Behance
Zapytaj           panel dostępny wszędzie
```

## Kolekcja CMS „Projekty” (Framer)

| Pole | Typ | Przykład |
|---|---|---|
| nazwa | tekst | Kalendarz trójdzielny 2027 |
| klient | tekst | Ślusarstwo Niemiec, przez agencję DPPG |
| rok | liczba | 2026 |
| kategoria | opcje | druk, opakowania, Amazon, Meta Ads, motion, 3D, UX, branding |
| naglowek | tekst | Cztery wersje, jeden warsztat |
| problem | tekst | Kalendarz firmowy dla zakładu ślusarskiego... |
| co_ai | tekst | Claude Code: research i kontrola druku |
| co_ja | tekst | 4 kierunki, geometria znaku, wizualizacje 3D |
| wynik | tekst | Pliki PDF/X-4 z lakierem UV, 4 wersje |
| format | tekst | 350x270 mm główka, plecki 320x790 mm |
| narzedzia | tekst | Illustrator, Photoshop, Blender |
| kolor | kolor | #F8B002 |
| miniatura | obraz | 1200 px WebP |
| galeria | obrazy | kadry z 05_export i 06_podglady |
| wideo | plik | opcjonalnie |
| nda | przełącznik | jeśli tak, użytek pusty z podpisem |

## Szablon case study (Twój format z PDF-a)

1. **Nagłówek:** konkret z projektu („Film 4K w tydzień”).
2. **Kontekst w jednym zdaniu:** klient, kanał, termin.
3. **Problem:** co było na starcie (np. „zrzuty z Google Maps i lektor w jednym pliku”).
4. **Idea:** jedno zdanie.
5. **Co zrobiłem z AI** i **co zrobiłem ja:** dwie kolumny obok siebie.
6. **Efekt w liczbach:** formaty, wersje, języki, dni, poprawki.
7. **Kadry:** przed i po, detale pod lupą, finalne pliki.
8. **Następny projekt.**

## Teksty startowe (do Twojej poprawki)

- **PL, nagłówek arkusza:** „Kamil Kochanowski. Art director i senior grafik. Kampanie, opakowania i motion, od pomysłu do pliku w drukarni.”
- **EN:** „Kamil Kochanowski. Art director and senior graphic designer. Campaigns, packaging and motion, from idea to press-ready file.”
- **Podpis lupy:** „Przybliż. Tak sprawdzam każdy plik przed drukiem.”
- **Przycisk trybu szybkiego:** „Lista prac”.
- **Zapytaj, powitanie:** „Zapytaj o dowolny projekt. Odpowiadam na podstawie moich case studies.”
