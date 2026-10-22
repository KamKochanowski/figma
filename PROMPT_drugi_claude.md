# Drugie konto Claude: pełny prompt startowy (Claude Code, folder PROJEKTY GRAFICZNE)

## Co zostaje Kamilowi do zrobienia ręcznie (raz)
Nic nie instalujesz od nowa. Na tym samym komputerze i tym samym użytkowniku Windows zostaje wszystko, co lokalne:
- folder PROJEKTY GRAFICZNE ze wszystkimi plikami, skryptami (`_SYSTEM`) i `CLAUDE.md`,
- `C:\Users\kamko\.claude`: skille, pamięć, ustawienia, historia czatów, MCP dodane lokalnie,
- programy: Node, Python (pydesign), Blender, ffmpeg, Chrome, UnRAR, Adobe (Illustrator i Photoshop działają przez COM, wystarczy, że są zalogowane w Creative Cloud jak zawsze).

Do podpięcia na drugim koncie (to jest przypisane do konta, nie do komputera):
1. Connectory: Figma, Magnific, Higgsfield, Framer (i Gmail, Google Drive, Kalendarz, Notion, Gamma, jeśli ich używasz). W Claude Code: `/mcp`, przy każdym, co nie działa, „Authenticate”. Albo na claude.ai > Ustawienia > Connectors.
2. Rozszerzenie Claude in Chrome: zaloguj się w nim drugim kontem.
3. Skille wgrane kiedyś przez claude.ai (nie te z dysku): wgraj je też na drugim koncie.
4. Envato w wbudowanej przeglądarce: jeśli wyloguje, zaloguj raz.

Przełączenie: terminal w folderze PROJEKTY GRAFICZNE, `claude`, `/login` (drugie konto), `/mcp`, nowa rozmowa i wklej prompt poniżej. Prompt wklejasz tylko raz, potem zasady są w `CLAUDE.md`.

## Prompt (wklej całość)

---

To jest start pracy na moim drugim koncie Claude. Ten sam komputer, ten sam folder PROJEKTY GRAFICZNE, te same pliki, skille i pamięć. Konta używam na zmianę, nigdy jednocześnie. Masz pracować dokładnie tak jak Claude na pierwszym koncie i od razu mieć całą wiedzę. Mam mało limitu: czytaj oszczędnie, nic dwa razy.

### Kim jestem
Kamil Kochanowski, graphic i motion designer, 7 lat doświadczenia, etat w agencji reklamowej They. Po godzinach freelance: Useme, agencje (DPPG, Better and More, Mentor Bridge), klienci bezpośredni, stała współpraca B2B z Rue de Skin (60 zł/h). Piszę szybko, po polsku, z literówkami. Odpowiadaj po polsku: najpierw werdykt, potem lista kroków. Duże zadania: foldery, pliki .md, podglądy. Stawka 40-50 zł/h netto (małe zlecenia 40).

### Zasady stałe
- Bez długich myślników (—, –), tylko dywiz „-”. Bez kropek „·” jako separatorów.
- Wiadomości do klientów krótko, moim prostym językiem, bez stylu AI. Bez wyceny, chyba że każę. Oferty Useme bez podpisu imieniem i nazwiskiem.
- Pliki i warstwy dla klienta: proste, potoczne nazwy.
- „stop” znaczy stop.
- Higgsfield i Magnific zużywają kredyty: zapytaj, zanim coś wygenerujesz.
- Nic nie kasuj na stałe. Zbędne rzeczy do `smiecie/` z powodem w `smiecie/CO_TU_JEST.md`.
- Jeśli `CLAUDE.md` w folderze mówi coś inaczej niż ten prompt, wygrywa `CLAUDE.md`.

### Krok 1: wczytaj wiedzę (raz)
1. `CLAUDE.md` w folderze (jeśli nie masz go już w kontekście): mapa folderu, start i koniec zadania, dane pod aplikację, narzędzia.
2. `SKILL.md` w całości: skill art directora, ZASADA NR 1, kontrola przed oddaniem, druk, estymacje.
3. `MARKI.md` (wszystkie marki) i `AKTUALNE_WSPOLPRACE.md` (co w toku).
4. Moje ustawienia i pamięć. Najpierw listing, czytaj tylko małe pliki z instrukcjami:
   - `C:\Users\kamko\.claude\CLAUDE.md`, jeśli jest,
   - `C:\Users\kamko\.claude\skills\*\SKILL.md` (każdy skill, m.in. `frontend-design` do stron www),
   - `.claude\` i `CLAUDE.local.md` w folderze projektu, jeśli są,
   - `C:\Users\kamko\.claude\projects\` > folder tego projektu > `memory\MEMORY.md` i pliki, do których prowadzi.
5. Nie czytaj teraz: `MARKA.md` i `ZADANIE.md` (czytasz przy zadaniu danej marki), grafik, PSD, PDF, plików `.jsonl` z historią czatów i `_SYSTEM/ROZMOWY` (w nich tylko grep, gdy szukasz, jak coś robiliśmy), `AppData\Local\Claude\Logs` (logi techniczne).

### Krok 2: sprawdź narzędzia (jedno polecenie, bez instalowania czegokolwiek)
- `node -v` (Node v26: sharp, playwright, pdfjs),
- `C:\Users\kamko\Apps\pydesign\Scripts\python.exe --version` (pymupdf, Pillow, numpy, opencv, fontTools),
- `C:\Users\kamko\Apps\ffmpeg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe -version`,
- czy istnieją: `C:\Users\kamko\Apps\blender-4.5.14-windows-x64\blender.exe` i `C:\Program Files\WinRAR\UnRAR.exe`.
Illustrator i Photoshop przez COM, Chrome headless zawsze z osobnym `--user-data-dir`. CorelDRAW portable z `_SYSTEM/NARZEDZIA` nie uruchamiaj. Framer tylko kopia portfolio, nigdy nie publikuj. Envato przez wbudowaną przeglądarkę, tylko zdjęcia bez oznaczenia AI, każde pobranie potwierdzam ja.
Potem sprawdź MCP: Figma, Magnific, Higgsfield, Framer. Czego brakuje, wypisz mi, nie obchodź tego.

### Krok 3: dopisz do `CLAUDE.md` sekcję „Dwa konta Claude” (krótko)
Pracuję na zmianę na dwóch kontach Claude w tym samym folderze, więc stan pracy ma być w plikach, nie w czacie. Przed przełączeniem konta albo gdy napiszę „koniec”, „zmieniam konto” lub kończy się limit: zaktualizuj `ZADANIE.md` bieżącego zadania (co zrobione, co dalej, następny krok), `AKTUALNE_WSPOLPRACE.md` i zapisz rozmowę `node "_SYSTEM/NARZEDZIA/zapisz_czat.js"`. Nowa rozmowa zaczyna od `AKTUALNE_WSPOLPRACE.md`.

### Krok 4: raport (maks. 8 linijek)
Jakie skille i pamięć znalazłeś, które narzędzia i MCP działają, czego brakuje (co mam podpiąć), co jest do zrobienia teraz. Potem czekaj na zadanie.

### Zawsze przy pracy
- Zadanie zaczynasz i kończysz dokładnie według „Start zadania” i „Koniec zadania” w `CLAUDE.md` (nowe zadanie: `node "_SYSTEM/SZABLONY/nowe_zadanie.js" MARKA "krotka_nazwa"`).
- Limit: nie czytaj drugi raz plików, które znasz, grep zamiast całych plików, bez subagentów i deep research, chyba że poproszę.

---
