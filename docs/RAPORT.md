# Pulpit: research, wnioski i plan

Kamil Kochanowski, 22.10.2026. Research w sieci, na GitHubie i w dokumentacji Anthropic, Twoje pliki (CLAUDE.md, SKILL.md, MARKI.md, AKTUALNE_WSPOLPRACE.md, CV, PDF-y) i żywa strona kochdesign.pl.

## Werdykt

Da się zrobić aplikację, która spina cały Twój system, i to bez łamania zasad Anthropic. Kluczowe jest to, że Twój folder PROJEKTY GRAFICZNE już jest bazą danych: MARKI.md, MARKA.md i ZADANIE.md z nagłówkami YAML, WYCENY.md, ZAROBKI.md. Pulpit nie kopiuje tych danych do własnej bazy, tylko je czyta i pokazuje. Claude dalej pracuje na plikach, a Pulpit widzi każdą zmianę od razu.

Czat i agenci działają przez oficjalny Claude Code (Agent SDK), na Twoim koncie, w Twoim folderze, z Twoim CLAUDE.md i skillami. Pulpit nigdy nie dotyka tokenów logowania.

Stan na dziś: działający szkielet z interfejsem, parserem przetestowanym na Twoich plikach, serwerem MCP i 6 agentami jest w repo. Na Twoim komputerze trzeba go uruchomić, podpiąć drugie konto i pocztę, a potem dokańczać z lokalnym Claude.

## Co jest gotowe

| Element | Stan | Gdzie |
|---|---|---|
| Parser plików (MARKI, AKTUALNE, ZAROBKI, WYCENY, YAML w MARKA i ZADANIE) | działa, 7 testów na Twoich plikach | `pulpit/src/main/workspace/parse.ts` |
| Odczyt folderu na żywo, odhaczanie listy, zmiana statusu z kopią pliku | gotowe, do sprawdzenia na Windowsie | `pulpit/src/main/workspace` |
| Interfejs: Dziś, Współprace, Zlecenia, Finanse, Claude, Poczta, Agenci, Portfolio, Ustawienia, Ctrl+K | gotowe, podgląd do klikania | `pulpit/src/renderer` |
| Czat z Claude Code na wybranym koncie, zgoda przed zapisem, wznawianie rozmów | gotowe, do testu z Twoim logowaniem | `pulpit/src/main/claude/chat.ts` |
| Historia rozmów obu kont z wyszukiwarką, tokeny dziennie | gotowe | `pulpit/src/main/claude/history.ts` |
| Limity 5 h i tygodniowe obu kont | gotowe (3 źródła, opis niżej) | `pulpit/src/main/claude/limits.ts` |
| 6 agentów w tle | gotowe polecenia, harmonogram, ograniczony zapis | `pulpit/resources/agents` |
| Serwer MCP dla Claude Desktop | działa, sprawdzony na Twoich plikach | `pulpit/src/main/mcp/server.ts` |
| Gmail x2 (IMAP), kalendarz (iCal), czas pracy (ActivityWatch) | szkielet, do podpięcia | `pulpit/src/main/mail`, `calendar`, `time` |
| Drugie konto ze wspólną historią | skrypt | `pulpit/scripts/konto2.ps1` |
| Audyt kochdesign.pl i polecenie dla Framera | gotowe | `docs/AUDYT_PORTFOLIO.md`, `docs/PROMPT_FRAMER_LOKALNIE.md` |

## Research: co już istnieje

**Aplikacje wokół Claude Code (GitHub)**
- **opcode (dawniej Claudia)**: desktop na Tauri 2, GUI do sesji Claude Code, historia, licznik kosztów. Licencja AGPL-3.0, ok. 20 tys. gwiazdek. Dobry wzór na historię i wznawianie sesji, ale to narzędzie programisty, nie panel freelancera. [claudelog.com/addons/claudia](https://claudelog.com/addons/claudia)
- **ccboard, claude-viz, ccusage**: czytają `~/.claude/projects/*.jsonl`, liczą tokeny i koszty bez wysyłania czegokolwiek w sieć. Z tego samego źródła Pulpit bierze historię i wykres tokenów. [docs.rs/ccboard](https://docs.rs/ccboard), [raycast ccusage](https://www.raycast.com/nyatinte/ccusage)
- **Kilka kont**: claude-switch, clauth, swapdex i ccsw trzymają każde konto w osobnym `CLAUDE_CONFIG_DIR`. Na Windowsie logowanie siedzi w tym folderze, więc konta są w pełni rozdzielone (na macOS logowanie idzie do Pęku kluczy i to nie działa tak łatwo). [claude-switch](https://github.com/hoangvu12/claude-switch), [clauth](https://docs.rs/crate/clauth/0.6.0), [swapdex](https://docs.rs/crate/swapdex/0.94.0)
- **Limity w pasku menu**: headroom zapisuje limity przez linię statusu Claude Code, bez sieci. claude-meter i CodexBar czytają nieudokumentowany endpoint z tokenem z Pęku kluczy, a tego Pulpit celowo nie robi. [headroom](https://github.com/patwalls/headroom), [claude-meter](https://github.com/aki77/claude-meter)

**Aplikacje dla freelancerów**
- **Midday**: open source „system dla freelancera” (czas, faktury, pliki, asystent AI), desktop na Tauri. AGPL-3.0 tylko do użytku niekomercyjnego, ok. 14 tys. gwiazdek. Wzór na moduł faktur i czasu, ale bez Claude i bez Twojego folderu. [github.com/midday-ai/midday](https://github.com/midday-ai/midday)

**Agenci**
- **Hermes Agent (Nous Research)**: open source agent z pamięcią w MEMORY.md i USER.md, skillami, harmonogramem i bramką do Telegrama, WhatsAppa i Slacka. Działa z różnymi modelami, w tym z Claude przez API. [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com/docs/user-guide/features/overview), [jimmysong.io](https://jimmysong.io/ai/hermes-agent)
- **Cowork, zaplanowane zadania**: Claude Desktop sam umie uruchamiać zadania według harmonogramu (od 02.2026). [fast.io](https://fast.io/resources/claude-cowork-features-overview.md)
- Wniosek: Twoi agenci w Pulpicie robią to samo co Hermes (pamięć w plikach, skille, harmonogram), ale na Twoim koncie Claude, w Twoim folderze i z Twoimi skillami. Hermes ma sens później, jeśli chcesz pisać do agenta z telefonu przez Telegrama (wtedy przez klucz API).

**Twoje narzędzia**
- **Adobe**: od 28.04.2026 jest oficjalny connector Adobe for Creativity w Claude (ponad 50 narzędzi z Photoshopa, Illustratora, Premiere, Lightrooma, InDesigna, Firefly i Stock, przez MCP). Do tego masz już własne skrypty COM i ExtendScript. Pulpit nie musi sterować Adobe: otwiera pliki z folderu marki i liczy czas w Illustratorze, Photoshopie i After Effects przez ActivityWatch. [weandthecolor.com](https://weandthecolor.com/how-does-the-adobe-for-creativity-connector-work-in-claude/210357), [photoworkout.com](https://www.photoworkout.com/?p=220081)
- **Useme**: nie ma publicznego API ani webhooków. Zostają maile z powiadomieniami, które Pulpit oznacza jako „Useme” i podaje agentowi od ofert.
- **Twoja działalność i KSeF**: KSeF obowiązuje od 01.02.2026 (duże firmy) i od 01.04.2026 (pozostałe). Mikrofirmy do 10 tys. zł brutto sprzedaży miesięcznie mają czas do 01.01.2027, a projekt ustawy chce to przesunąć na koniec 2027. Faktury zakupowe trzeba odbierać przez KSeF już od 01.02.2026. [jpk.info.pl](https://jpk.info.pl/faktury/e-faktura-ustrukturyzowana-ksef/harmonogram/), [fakturownia.pl](https://fakturownia.pl/aktualnosci/mikroprzedsiebiorcy-a-ksef-czy-limit-10-000-zl-cie-dotyczy-i-jak-go-liczyc), [legeartis.org](https://czasopismo.legeartis.org/2026/02/odroczenie-ksef-mikroprzedsiebiorcow-31-grudnia-2027-obowiazek-wystawiania-faktur/)
- **Gmail**: dla zwykłego konta Gmail IMAP z hasłem aplikacji dalej działa (wymaga weryfikacji dwuetapowej). Konta Google Workspace wymagają OAuth. [elevenforum](https://www.elevenforum.com/t/gmail-outlook-2016-fail.45280/post-719282), [mailjerry](https://www.mailjerry.com/how-to-enable-imap-in-gmail/)

## Zasady Anthropic (ważne dla dwóch kont)

- **Aktualizacja z 07.10.2026**: Agent SDK, `claude -p` i aplikacje firm trzecich mogą korzystać z limitów Twojego planu. Plany Max i Team dostają też miesięczne kredyty API ($100 dla Max 5x, $200 dla Max 20x, Pro nie ma). Kredyty działają tylko z kluczem API z podpiętej organizacji Console. Po zalogowaniu kontem planu wszystko idzie z limitów planu. [support.claude.com/articles/15036540](https://support.claude.com/articles/15036540), [support.claude.com/en/articles/17154008](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans)
- **Zasady prawne**: logowanie OAuth jest dla zwykłego, osobistego używania Claude Code i aplikacji Anthropic. Twórcom produktów nie wolno zbierać ani pośredniczyć w tokenach logowania. Wolno natomiast logować się do niezmienionego Claude Code własną subskrypcją. [code.claude.com/docs/en/legal-and-compliance](https://code.claude.com/docs/en/legal-and-compliance)
- **Jak to robi Pulpit**: aplikacja jest tylko dla Ciebie. Logujesz się przez oficjalne `/login` w terminalu Claude Code, a Pulpit uruchamia niezmieniony Claude Code przez Agent SDK i nie czyta, nie zapisuje ani nie przesyła tokenów.
- **Limity bez tokenów**: (1) zdarzenia `rate_limit_event` z SDK podczas pracy w Pulpicie, (2) przycisk Odśwież, który pyta Claude Code przez SDK o dane z komendy /usage (oficjalne, ale oznaczone jako eksperymentalne, więc może się zmienić), (3) linia statusu w terminalu, która zapisuje `rate_limits` do pliku. Pola `rate_limits.five_hour` i `seven_day` są w oficjalnej dokumentacji linii statusu. [code.claude.com/docs/en/statusline](https://code.claude.com/docs/en/statusline)

## Decyzje i dlaczego

1. **Electron, nie Tauri.** Agent SDK, MCP, IMAP i obsługa plików to TypeScript i Node, więc w Electronie wszystko działa w jednym języku. Tauri wymaga Rusta, narzędzi Visual Studio i osobnego procesu Node dla SDK. Electron waży więcej (ok. 100 MB instalator, 150-300 MB RAM), ale Claude Desktop, Figma i VS Code też stoją na Electronie, a Ty masz RTX 3060 i Node 26. [tech-insider.org](https://tech-insider.org/tauri-vs-electron-2026/), [dev.to](https://dev.to/devtoolpicks/tauri-vs-electron-for-indie-hackers-in-2026-honest-comparison-o0e)
2. **Pliki są bazą.** Żadnej drugiej bazy, którą trzeba synchronizować. Pulpit zapisuje tylko odhaczenia w AKTUALNE_WSPOLPRACE.md i status w ZADANIE.md, a przed każdym zapisem robi kopię do `_SYSTEM/PULPIT/kopie` (Twoja zasada: nic nie kasujemy).
3. **Dwa konta przez dwa foldery konfiguracji.** Konto 1 zostaje w `~/.claude`, konto 2 dostaje `~/.claude-konto2`. Historia, skille i polecenia są wspólne przez połączenia folderów (skrypt `konto2.ps1`), więc rozmowę z konta 1 da się wznowić na koncie 2. Pulpit pokazuje, które konto ma więcej zapasu, i jednym kliknięciem przełącza nowe rozmowy.
4. **Zgoda przed zapisem.** W czacie Claude czyta swobodnie, ale każdy zapis pliku i polecenie wymaga Twojego kliknięcia. Agenci w tle mogą pisać tylko w `_SYSTEM/PULPIT` (raporty, szkice) i niczego nie wysyłają.
5. **Poczta tylko do odczytu.** IMAP z hasłem aplikacji, bez własnej aplikacji w Google Cloud i bez tokenów wygasających co 7 dni. Klienta rozpoznaję po adresach z MARKA.md, Useme po domenie.
6. **Kalendarz bez logowania.** Tajny adres iCal z Google Calendar plus terminy z ZADANIE.md.
7. **Wygląd z Twojego świata.** Pasek kontrolny jak na arkuszu z drukarni: farby procesowe to stany zleceń (cyjan: w pracy, magenta: Twój ruch, żółty: czeka na klienta, czerń: zamknięte), a kolory dodatkowe to marki. Typografia z Twojego PDF-a: Bodoni Moda i Schibsted Grotesk. Tryb ciemny jako „nocna zmiana”, bo pracujesz po etacie.

## Moduły

- **Dziś**: lista z AKTUALNE_WSPOLPRACE.md do odhaczania, oba konta Claude z limitami, kto milczy i od ilu dni, terminy na 30 dni, kasa miesiąca, dziennik zmian, ostatnie raporty agentów.
- **Współprace**: wszystkie marki z kolorami, źródłem (Useme, agencja, bezpośrednio), notatkami „w trakcie”, zadaniami, mailami i kasą danej marki. Przycisk „Otwórz folder” i zakładanie zadania skryptem `nowe_zadanie.js`.
- **Zlecenia**: tablica według statusów z ZADANIE.md, zmiana statusu zapisuje się w pliku.
- **Finanse**: 12 miesięcy z celem, źródła, klienci, udział największego klienta, do rozliczenia, przypomnienie o KSeF.
- **Claude**: czat na wybranym koncie, szybkie polecenia („Zmieniam konto” robi procedurę z Twojego CLAUDE.md), historia obu kont z wyszukiwarką, tokeny dziennie, logowanie i linia statusu.
- **Poczta**: dwa Gmaile, zakładki Klienci, Useme, Wszystko, otwieranie wątku w Gmailu.
- **Agenci**: włączanie, harmonogram, uruchom teraz, ostatni wynik.
- **Portfolio**: plan z audytu kochdesign.pl do odhaczania, kandydaci na case study (bez NDA), przycisk agenta „Case study”.
- **Ustawienia**: folder, cel i stawka, konta Claude, poczta, kalendarze, ActivityWatch, motyw.
- **Wszędzie**: Ctrl+K szuka marek, zleceń i widoków, Ctrl+Alt+P pokazuje i chowa Pulpit z Illustratora czy Photoshopa, ikona w zasobniku, agenci działają, gdy okno jest schowane.

## Agenci (Twój „Hermes”)

| Agent | Kiedy | Co robi |
|---|---|---|
| Plan na wieczór | dni robocze 17:00 | 5 punktów na wieczór, najpierw to, co do wysłania |
| Cisza u klienta | pon., śr., pt. 16:30 | kto milczy ponad 5 dni, szkic przypomnienia w Twoim stylu |
| Do rozliczenia | piątek 18:00 | co zrobione i niezapłacone: Useme, faktury, bezpośrednio |
| Przegląd tygodnia | niedziela 19:00 | zarobki, stawka efektywna, ryzyko jednego klienta, co podnieść, co do portfolio |
| Case study | na żądanie | szkic case study PL i EN z ZADANIE.md i podglądów |
| Zlecenia z Useme | codziennie 20:00 | ocena dopasowania i szkic oferty bez podpisu |

Każdy agent to plik .md po polsku. Własnego dodajesz do `_SYSTEM/PULPIT/agenci`.

## Co jeszcze warto dołożyć (kolejność)

1. **Faktury**: podpięcie programu do faktur z API (np. Fakturownia albo inFakt, sprawdź ich dokumentację), szkic faktury z zadania „do rozliczenia”, status płatności w Finansach.
2. **Czas pracy**: ActivityWatch (darmowy) i porównanie prawdziwych godzin z estymacjami z WYCENY.md. Wtedy widać stawkę efektywną na klienta.
3. **Podglądy prac**: miniatury z `06_podglady` przy zadaniach i markach, przydatne też do case studies.
4. **Telefon**: Hermes albo bot w Telegramie z dostępem do agentów, gdy chcesz pisać z telefonu po drodze z agencji.
5. **Pulpit w Claude Desktop**: serwer MCP jest gotowy, wystarczy go dopisać do konfiguracji (README).

## Ryzyka

- Zakaz konkurencji w umowie z They i NDA z Rue de Skin: Pulpit tylko porządkuje dane, ale agenci od Useme i portfolio pomijają marki pod NDA. Przed publikacją prac agencyjnych sprawdź umowę.
- Funkcja odczytu limitów z /usage w SDK jest oznaczona jako eksperymentalna. Gdy przestanie działać, zostają zdarzenia z SDK i linia statusu.
- Jeden klient może dawać większość przychodu (Rue de Skin, ok. 4 800 zł netto miesięcznie przy 20 h tygodniowo). Przegląd tygodnia o tym przypomina.
- Formaty ZAROBKI.md i WYCENY.md znam tylko z opisu w CLAUDE.md. Parser czyta tabele po nazwach kolumn, ale sprawdź go na prawdziwych plikach (polecenie w README).

## Kroki na Twoim komputerze

1. `git clone` repozytorium figma, gałąź `claude/laughing-gauss-zo5lcd`, potem `cd pulpit`, `npm install`, `npm run dev`.
2. Ustawienia: sprawdź ścieżkę do PROJEKTY GRAFICZNE.
3. `powershell -ExecutionPolicy Bypass -File scripts\konto2.ps1`, potem w Pulpicie Claude, Konto 2, „Zaloguj w terminalu” i `/login`.
4. Linia statusu dla obu kont (przycisk w widoku Claude).
5. Gmail: hasła aplikacji dla obu kont, wklejone w Ustawieniach.
6. Agenci: włącz „Plan na wieczór” i „Cisza u klienta”, resztę po tygodniu.
7. W lokalnej sesji Claude Code w folderze `pulpit` powiedz: „Przeczytaj CLAUDE.md i dokończ etap 1”.
