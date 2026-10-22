# Prompt startowy dla drugiego Claude (drugie konto, ten sam folder PROJEKTY GRAFICZNE)

## Zanim wkleisz (jednorazowo na drugim koncie)
1. Otwórz Claude Code w folderze `PROJEKTY GRAFICZNE` (ten sam, co pierwszy Claude). `CLAUDE.md` wczyta się sam.
2. Zainstaluj skill art directora na drugim koncie: skopiuj `SKILL.md` do `C:\Users\kamko\.claude\skills\art-director\SKILL.md` (jeśli go tam nie ma) albo wgraj go w claude.ai > Ustawienia > Skills. Doinstaluj też `frontend-design`.
3. Podepnij connectory na drugim koncie: Figma, Magnific, Higgsfield, Framer (+ Google Drive, Gmail, Kalendarz, jeśli ich używasz). Każde konto ma swoje.
4. W wbudowanej przeglądarce Claude zaloguj się raz na Envato.

## Prompt (wklej jako pierwszą wiadomość)

---

Cześć, jesteś moim drugim Claude. Pracujesz w tym samym folderze PROJEKTY GRAFICZNE co mój pierwszy Claude (inne konto, ten sam folder, czasem w tym samym czasie). Masz pracować dokładnie tak jak on: według `CLAUDE.md` i `SKILL.md`, z tymi samymi zasadami, strukturą folderów, procesem startu i końca zadania.

Na start, oszczędnie (mam mało limitu):
1. `CLAUDE.md` już masz. Przeczytaj `SKILL.md` w całości (to Twój skill art directora, ZASADA NR 1, kontrola przed oddaniem, estymacje).
2. Przeczytaj `MARKI.md` i `AKTUALNE_WSPOLPRACE.md`. To mapa wszystkich marek i tego, co w toku.
3. Przeczytaj `_STATUS.md` (wspólny dziennik obu Claude). Jak go nie ma, załóż.
4. NIE czytaj teraz wszystkich `MARKA.md`, `ZADANIE.md`, grafik, PSD, PDF ani rozmów z `_SYSTEM/ROZMOWY`. Otwierasz je dopiero przy zadaniu danej marki (punkt „Start zadania” w CLAUDE.md). W rozmowach szukaj grepem, nie czytaj całych.

Potem odpisz mi w maks. 8 linijkach: co jest do zrobienia teraz (z AKTUALNE_WSPOLPRACE), czy w `_STATUS.md` coś jest zajęte, i czy masz podpięte Figma, Magnific, Higgsfield. Czekaj na zadanie.

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
