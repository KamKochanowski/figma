# Pulpit: jak tu pracujemy

Aplikacja desktop (Electron + React + TypeScript) dla Kamila. Czytaj też `../docs/RAPORT.md` (decyzje i research) i `README.md` (uruchomienie). Zasady Kamila z `PROJEKTY GRAFICZNE/CLAUDE.md` obowiązują też tu: po polsku, najpierw werdykt, bez długich myślników i kropek „·” w interfejsie i tekstach, nic nie kasujemy na stałe.

## Architektura
- `src/shared/types.ts`: typy i interfejs `PulpitApi` (most preload).
- `src/main/workspace/parse.ts`: czyste funkcje .md na dane. Każda zmiana parsera = test w `tests/parse.test.mts` na plikach z `tests/fixtures`.
- `src/main/workspace/scan.ts`: czyta folder, zapisuje tylko odhaczenia i status, zawsze z kopią w `_SYSTEM/PULPIT/kopie`.
- `src/main/claude/*`: Agent SDK (`runClaude` w chat.ts to wspólny silnik czatu i agentów), historia z `projects/*.jsonl`, limity.
- `src/main/agents/runner.ts`: agenci z plików .md, cron, zapis tylko do ścieżek z pola `zapis`.
- `src/main/mcp/server.ts`: serwer MCP (bez Electrona, `node out/main/mcp.js`).
- `src/renderer`: React. `api.ts` wybiera prawdziwe API albo `demo.ts` (podgląd w przeglądarce).
- Wygląd: tokeny w `styles.css` (`:root` ciemny, jasny w media i `[data-theme]`). Statusy zleceń to farby procesowe (C, M, Y, K), kolor należy do marek.

## Twarde zasady
- Nigdy nie czytaj ani nie zapisuj tokenów logowania Claude. Logowanie tylko przez oficjalne `/login` w Claude Code. Konto domyślne uruchamiaj bez `CLAUDE_CONFIG_DIR`.
- Agenci w tle niczego nie wysyłają (maile, Useme) i piszą tylko w `_SYSTEM/PULPIT`.
- Marki pod NDA (Rue de Skin) nie trafiają do portfolio ani ofert.

## Etap 1 (najpierw)
1. `npm install`, `npm run dev`, sprawdź na prawdziwym folderze: marki, lista, statusy, odhaczanie (kopia w `_SYSTEM/PULPIT/kopie`).
2. Porównaj parser z prawdziwymi `ZAROBKI.md`, `WYCENY.md`, `MARKA.md`, `ZADANIE.md`. Dopisz brakujące klucze YAML do `pick()` i testy z prawdziwymi fragmentami.
3. Czat na koncie 1: wiadomość, prośba o zgodę na zapis, wznowienie z historii.
4. `scripts/konto2.ps1`, logowanie konta 2, odświeżenie limitów obu kont.
5. Gmail (hasło aplikacji), jeden kalendarz iCal.

## Etap 2
- Uruchom każdego agenta raz ręcznie, popraw polecenia po wynikach.
- Zapis `_SYSTEM/PULPIT/poczta_ostatnia.json` po pobraniu poczty (dla agenta Useme), bez treści maili.
- Miniatury z `06_podglady` w Współpracach.
- `npm run dist`, autostart z Windows.

## Etap 3
- Faktury (API programu do faktur Kamila), czas z ActivityWatch obok estymacji, Telegram albo Hermes do agentów z telefonu.
