# Prompt startowy dla drugiego Claude (drugie konto, ten sam folder PROJEKTY GRAFICZNE)

## Zanim wkleisz (jednorazowo na drugim koncie)
1. Otwórz Claude Code w folderze `PROJEKTY GRAFICZNE` (ten sam, co pierwszy Claude). `CLAUDE.md` wczyta się sam.
2. Skille z `C:\Users\kamko\.claude\skills\` są przypisane do użytkownika Windows, nie do konta Claude. Jeśli drugie konto działa na tym samym użytkowniku Windows (kamko), widzi je samo. Jeśli działa z osobnym folderem konfiguracji (inny użytkownik Windows, inny komputer, `CLAUDE_CONFIG_DIR`), skopiuj tam cały folder `skills`. Skille wgrane w claude.ai > Ustawienia > Skills trzeba wgrać też na drugim koncie.
3. Podepnij connectory na drugim koncie: Figma, Magnific, Higgsfield, Framer (+ Google Drive, Gmail, Kalendarz, jeśli ich używasz). Każde konto ma swoje.
4. W wbudowanej przeglądarce Claude zaloguj się raz na Envato.

## Prompt (wklej jako pierwszą wiadomość)

---

Cześć, jesteś moim drugim Claude. Pracujesz w tym samym folderze PROJEKTY GRAFICZNE co mój pierwszy Claude (inne konto, ten sam folder, czasem w tym samym czasie). Masz pracować dokładnie tak jak on: według `CLAUDE.md` i `SKILL.md`, z tymi samymi zasadami, strukturą folderów, procesem startu i końca zadania.

Na start, oszczędnie (mam mało limitu):
1. `CLAUDE.md` już masz. Przeczytaj `SKILL.md` w całości (to Twój skill art directora, ZASADA NR 1, kontrola przed oddaniem, estymacje).
2. Przeczytaj `MARKI.md` i `AKTUALNE_WSPOLPRACE.md`. To mapa wszystkich marek i tego, co w toku.
3. Przeczytaj `_STATUS.md` (wspólny dziennik obu Claude). Jak go nie ma, załóż.
4. Sprawdź wszystkie miejsca, w których Claude trzyma moje ustawienia i wiedzę. Najpierw listing, potem czytaj tylko małe pliki z instrukcjami:
   - `C:\Users\kamko\.claude\CLAUDE.md` (moje ogólne instrukcje, jeśli jest),
   - `C:\Users\kamko\.claude\skills\*\SKILL.md` (wszystkie moje skille, przeczytaj każdy),
   - `.claude\` w folderze PROJEKTY GRAFICZNE (skille, settings) i `CLAUDE.local.md`, jeśli są,
   - `C:\Users\kamko\.claude\projects\` > folder tego projektu > `memory\` (pamięć pierwszego Claude, przeczytaj `MEMORY.md` i pliki, do których prowadzi),
   - `C:\Users\kamko\AppData\Roaming\Claude\claude_desktop_config.json` (tylko sprawdź, jakie MCP są ustawione).
   Nie czytaj: plików `.jsonl` w `.claude\projects` (to całe historie czatów, ogromne; tylko grep, gdy czegoś szukasz) ani `AppData\Local\Claude\Logs` (logi techniczne aplikacji, nie ma tam wiedzy o projektach).
5. NIE czytaj teraz wszystkich `MARKA.md`, `ZADANIE.md`, grafik, PSD, PDF ani rozmów z `_SYSTEM/ROZMOWY`. Otwierasz je dopiero przy zadaniu danej marki (punkt „Start zadania” w CLAUDE.md). W rozmowach szukaj grepem, nie czytaj całych.

Potem odpisz mi w maks. 8 linijkach: jakie skille i pamięć znalazłeś, co jest do zrobienia teraz (z AKTUALNE_WSPOLPRACE), czy w `_STATUS.md` coś jest zajęte, i czy masz podpięte Figma, Magnific, Higgsfield. Czekaj na zadanie.

Praca we dwóch na jednym folderze:
- Przed zadaniem dopisz w `_STATUS.md`: `RRRR-MM-DD GG:MM [Claude-2] PRACUJE: MARKA/ZAD_NN - co`. Po skończeniu zmień na `ZROBIONE`. Pierwszy Claude robi to samo jako [Claude-1].
- Nie ruszaj zadania, które drugi Claude ma jako PRACUJE. Wtedy zapytaj mnie.
- Pliki wspólne (`MARKI.md`, `AKTUALNE_WSPOLPRACE.md`, `WYCENY.md`, `ZAROBKI.md`, `SKILL.md`, `CLAUDE.md`): przeczytaj je ponownie tuż przed edycją i dopisuj tylko swój wiersz albo sekcję, nigdy nie przepisuj całego pliku. Drugi Claude mógł coś dopisać w międzyczasie.
- Nowe zadanie zakładaj tylko przez `node "_SYSTEM/SZABLONY/nowe_zadanie.js" MARKA "krotka_nazwa"`. Przed tym sprawdź, czy numer ZAD nie jest już zajęty.
- Nowe zasady i lekcje dopisuj do `SKILL.md` lub `MARKA.md` tak jak w CLAUDE.md, żeby pierwszy Claude też je miał.

Oszczędzanie limitu:
- Nie czytaj drugi raz plików, które znasz. Grep i listing zamiast otwierania całych plików.
- Bez subagentów i deep research, chyba że poproszę.
- Higgsfield i Magnific tylko po mojej zgodzie, najpierw 1 próbka.
- Na koniec większego zadania zapisz rozmowę (`node "_SYSTEM/NARZEDZIA/zapisz_czat.js"` z id tej sesji), żeby pierwszy Claude mógł ją przeszukać.

---
