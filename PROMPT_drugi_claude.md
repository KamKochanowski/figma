# Drugie konto Claude w Claude Code (folder PROJEKTY GRAFICZNE)

Konta używane na zmianę, nigdy jednocześnie. Wszystko, co lokalne, jest wspólne dla obu kont: folder projektów, `C:\Users\kamko\.claude` (skille, pamięć, ustawienia, historia czatów) i MCP dodane lokalnie. Konto zmienia tylko to, czyj limit się zużywa, oraz connectory z claude.ai.

## Przełączenie (jednorazowo)
1. Terminal w folderze `PROJEKTY GRAFICZNE`, uruchom `claude`.
2. Wpisz `/login` i zaloguj się drugim kontem. Na tym samym użytkowniku Windows skille z `.claude\skills`, pamięć i ustawienia zostają same.
3. Wpisz `/mcp` i sprawdź Figma, Magnific, Higgsfield i Framer. To, co było dodane jako connector na claude.ai, trzeba podpiąć na drugim koncie (na claude.ai albo z poziomu `/mcp`).
4. Nowa rozmowa (nie `/resume` starej, bo wczytanie długiego czatu zjada limit). Wklej prompt poniżej.

Kolejne razy wystarczy `/login` i zwykła praca. Zasady zostają w `CLAUDE.md` (krok 4 promptu), więc prompt jest potrzebny tylko raz.

## Prompt

---

Cześć, przełączyłem się na drugie konto Claude. Folder, pliki, skille i pamięć są te same, zmienia się tylko konto. Pracuj dokładnie tak jak dotąd: według `CLAUDE.md` i `SKILL.md`. Mam mało limitu, więc rób to oszczędnie.

1. `CLAUDE.md` już masz. Przeczytaj `SKILL.md`, `MARKI.md` i `AKTUALNE_WSPOLPRACE.md`.
2. Sprawdź, co jeszcze o mnie wiesz. Najpierw listing, potem czytaj tylko małe pliki z instrukcjami:
   - `C:\Users\kamko\.claude\CLAUDE.md`, jeśli jest,
   - `C:\Users\kamko\.claude\skills\*\SKILL.md` (każdy skill),
   - `.claude\` i `CLAUDE.local.md` w tym folderze, jeśli są,
   - pamięć: `C:\Users\kamko\.claude\projects\` > folder tego projektu > `memory\MEMORY.md` i pliki, do których prowadzi.
   Nie czytaj plików `.jsonl` (całe historie czatów, tylko grep, gdy czegoś szukasz), `_SYSTEM/ROZMOWY` (też tylko grep) ani `AppData\Local\Claude\Logs` (logi techniczne).
3. Nie otwieraj teraz `MARKA.md`, `ZADANIE.md`, grafik ani PDF. Czytasz je przy zadaniu danej marki, według „Start zadania” w CLAUDE.md.
4. Dopisz do `CLAUDE.md` krótką sekcję „Dwa konta Claude”: pracuję na zmianę na dwóch kontach w tym samym folderze, więc stan pracy ma być w plikach, nie w czacie. Przed przełączeniem konta albo gdy napiszę „koniec”, „zmieniam konto” lub skończy się limit: zaktualizuj `ZADANIE.md` bieżącego zadania (co zrobione, co dalej, następny krok), `AKTUALNE_WSPOLPRACE.md` i zapisz rozmowę `node "_SYSTEM/NARZEDZIA/zapisz_czat.js"`. Na starcie nowej rozmowy zacznij od `AKTUALNE_WSPOLPRACE.md`.
5. Odpisz w maks. 6 linijkach: jakie skille i pamięć znalazłeś, co jest do zrobienia teraz i czy w `/mcp` są Figma, Magnific i Higgsfield. Czekaj na zadanie.

Limit: nie czytaj drugi raz plików, które znasz, grep zamiast całych plików, bez subagentów i deep research, chyba że poproszę. Higgsfield i Magnific tylko po mojej zgodzie.

---
