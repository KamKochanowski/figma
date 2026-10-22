# Pulpit

Panel freelancera Kamila Kochanowskiego na Windows: współprace, zlecenia, kasa, poczta i dwa konta Claude w jednym oknie. Dane bierze z folderu PROJEKTY GRAFICZNE (pliki .md), a z Claude rozmawia przez oficjalny Claude Code.

Podgląd interfejsu na danych z 22.10.2026: https://claude.ai/artifact/FePBkNWGMEZCXpMrpbHQ2G (albo lokalnie `npm run preview:web` i `dist-preview/index.html`). Raport: https://claude.ai/artifact/VgatC6cSXrMqSERy7sNMi4

## Uruchomienie

Potrzebne: Node 22 albo nowszy (masz 26), Git, Claude Code zalogowany na koncie 1.

```powershell
git clone https://github.com/kamkochanowski/figma.git
cd figma
git checkout claude/laughing-gauss-zo5lcd
cd pulpit
npm install
npm run dev
```

Pierwszy `npm install` pobiera Electrona (ok. 100 MB). `npm test` sprawdza parser na Twoich plikach z `tests/fixtures`.

Sprawdzenie na prawdziwym folderze (nic nie zapisuje):

```powershell
$env:PULPIT_ROOT = "$env:USERPROFILE\Desktop\PROJEKTY GRAFICZNE"; npm run build; npm run mcp
```

Instalator: `npm run dist` (plik w `dist/`).

## Drugie konto Claude

```powershell
powershell -ExecutionPolicy Bypass -File scripts\konto2.ps1
```

Skrypt zakłada `%USERPROFILE%\.claude-konto2` i łączy z kontem 1 historię rozmów, skille i polecenia. Logowanie: w Pulpicie widok Claude, Konto 2, „Zaloguj w terminalu”, a w terminalu `/login`. Pulpit nie czyta i nie zapisuje tokenów, logujesz się przez oficjalny Claude Code.

Limity 5 h i tygodniowe: przycisk Odśwież w widoku Claude, a dla terminala przycisk „Linia statusu” (dopisuje do Claude Code skrypt, który zapisuje limity do pliku, z kopią `settings.json.przed-pulpitem`).

## Poczta

Dla każdego Gmaila: weryfikacja dwuetapowa, potem Konto Google, Bezpieczeństwo, Hasła do aplikacji, nowe hasło „Pulpit”. W Gmailu włącz IMAP. Adres i hasło wpisz w Ustawieniach Pulpitu. Hasło szyfruje Windows i zostaje na tym komputerze.

## Pulpit w Claude Desktop (MCP)

Po `npm run build` dopisz do `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pulpit": {
      "command": "node",
      "args": ["C:\\Users\\kamko\\figma\\pulpit\\out\\main\\mcp.js"],
      "env": { "PULPIT_ROOT": "C:\\Users\\kamko\\Desktop\\PROJEKTY GRAFICZNE" }
    }
  }
}
```

Narzędzia: `pulpit_dzis`, `pulpit_marki`, `pulpit_zadania`, `pulpit_zarobki`, `pulpit_odhacz`.

## Agenci

Wbudowani są w `resources/agents`. Własnego dodajesz jako plik .md w `PROJEKTY GRAFICZNE/_SYSTEM/PULPIT/agenci` (ten sam format). Raporty lądują w `_SYSTEM/PULPIT/raporty`, szkice wiadomości w `_SYSTEM/PULPIT/szkice`.

## Pakowanie samych plików .md

`scripts\spakuj-md.ps1` robi zip z samych .md (bez Rue de Skin i rozmów), np. żeby pokazać je Claude w chmurze.
