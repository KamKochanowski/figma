# Wdrożenie: Arkusz i Zapytaj na kochdesign.pl

Werdykt: dwa wieczory pracy. Wieczór 1 to Arkusz we Framerze (bez kodu po Twojej stronie, tylko wklejenie i wypełnienie pól). Wieczór 2 to Zapytaj: Worker na Cloudflare (darmowy plan) plus panel we Framerze.

Oba komponenty są sprawdzone: kompilują się w TypeScript i przeszły test w przeglądarce (przesuwanie, zoom kółkiem, lupa, klik w pracę otwiera case study, przeciąganie nie otwiera, lista poniżej 700 px i powrót do arkusza, czat pokazuje karty prac i podpowiedzi). Worker kompiluje się z `@anthropic-ai/sdk` 1.1.0 i przechodzi `wrangler deploy --dry-run`.

Zasady bezpieczeństwa:

1. Pracujesz tylko w kopii projektu `Kamil-Kochanowski-Portfolio-copy--fMkDXvd11ta2CYFfhhdz-8WBaD`. Oryginału nie ruszasz.
2. Nie publikujesz, dopóki nie przejdziesz listy kontrolnej na dole.
3. Klucz API Anthropic trzymasz tylko w sekrecie Workera. Nigdy we Framerze, nigdy w repo.
4. Materiały pod NDA (RUE DE SKIN) nie trafiają ani na arkusz, ani do `wiedza.json`.

## 1. Arkusz (wieczór 1)

| Krok | Co robisz |
|---|---|
| 1 | Otwórz kopię projektu we Framerze. Assets, zakładka Code, plus, New code file, nazwa `Arkusz`. |
| 2 | Usuń przykładowy kod i wklej całą zawartość `framer/Arkusz.tsx`. Zapisz. |
| 3 | Przeciągnij komponent na stronę główną pod nagłówek. Szerokość Fill, wysokość 100vh albo stałe 820 px. |
| 4 | W panelu po prawej, w polu Prace, dodaj 8 do 12 prac: Nazwa, Klient, Obraz, Case study (link do strony projektu w CMS). |
| 5 | Kolumny: 4 przy 8 pracach, 5 przy 10 do 15. Kolory marek: spot kolory z Twoich projektów (pasek kontrolny na dole arkusza). |
| 6 | Podgląd (Preview). Sprawdź przeciąganie, kółko, lupę, klik. Zwęź okno poniżej 700 px: arkusz zamienia się w listę. |

Okładki prac: poziomo, proporcja 280 do 198 (czyli 1,414, format A poziomo), eksport 1400 x 990 px, JPG lub WebP do 300 KB. Wybierz kadr z detalem, bo lupa pokazuje go w powiększeniu.

Fonty: komponent używa Bodoni Moda i Schibsted Grotesk po nazwie. Najprościej użyć obu fontów w dowolnym tekście na stronie (wtedy Framer je ładuje). Jeśli nie są nigdzie użyte, dodaj w ustawieniach strony (Custom Code, sekcja head) link z Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Schibsted+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

Prototyp HTML (`prototyp/arkusz.html`) ma więcej niż komponent: kartę zlecenia po kliknięciu, wejście z przebiegami farb CMYK i klawisz L. We Framerze kartę zlecenia robisz natywnie (strona CMS albo overlay), a przebiegi farb jako animację wejścia sekcji (Appear effect), bez kodu. Komponent trzyma tylko to, czego Framer sam nie zrobi: arkusz, zoom, lupę i listę na telefonie.

Dane wpisujesz ręcznie w polach komponentu. Pola komponentu kodu nie łączą się z całą kolekcją CMS, więc lista na arkuszu to Twoja selekcja (i dobrze, bo to filtr, nie archiwum). Raz na kwartał podmieniasz 1 do 2 prac.

## 2. Zapytaj: Worker (wieczór 2, część 1)

Potrzebujesz: Node 20 lub nowszy, darmowe konto Cloudflare, klucz API z [console.anthropic.com](https://console.anthropic.com). API rozlicza się za tokeny osobno od subskrypcji Max.

```bash
cd zapytaj-worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npm run typecheck
npx wrangler dev
```

Test lokalny w drugim oknie terminala (dla dev dopisz `http://localhost:8787` do `ALLOWED_ORIGIN` albo testuj curlem, który CORS nie dotyczy):

```bash
curl -X POST http://localhost:8787 -H "Content-Type: application/json" -d "{\"question\":\"Jakie opakowania projektowałeś?\"}"
```

Gdy odpowiedź wygląda dobrze:

```bash
npm run deploy
```

Wrangler poda adres w stylu `https://kochdesign-zapytaj.TWOJE-KONTO.workers.dev`. Ten adres wpisujesz w komponencie Zapytaj.

Przed wdrożeniem uzupełnij w `wiedza.json`:

1. `kontakt.kalendarz`: link do Cal.com (teraz jest `UZUPELNIJ_LINK_CAL_COM`).
2. Projekty: każdy ma `id`. Te same id wpisujesz w kartach prac w komponencie Zapytaj, wtedy odpowiedź pokazuje właściwe miniatury.
3. Wszystko, czego asystent ma nie mówić, po prostu tam nie wpisuj. Odpowiada wyłącznie z tego pliku.

Co jest w kodzie i dlaczego:

| Element | Po co |
|---|---|
| Model `claude-opus-5-5` | Domyślny, najlepsza jakość odpowiedzi. Tańszy `claude-haiku-5-5` to Twoja decyzja: zmiana jednej linii `MODEL` w `src/index.ts`. |
| Fallback po stronie serwera (`betas: ["server-side-fallback-2026-07-01"]`, `fallbacks: "default"`) | Jest włączony. Jeśli filtr bezpieczeństwa modelu odrzuci pytanie, API samo uruchomi zalecany model zapasowy i zwróci jego odpowiedź. Jeśli nie chcesz, usuń te dwie linie. Haiku 5.5 nie ma fallbacku po stronie serwera, więc przy zmianie na Haiku też je usuń. |
| Pamięć podręczna promptu (1 godzina) | Zasady i wiedza są stałe, więc kolejne pytania czytają je z cache: taniej i szybciej. |
| Odpowiedź w schemacie JSON | Strona zawsze dostaje `answer`, `project_ids` (tylko istniejące id) i `follow_ups`. |
| Limit 8 pytań na minutę z jednego IP | Chroni budżet przed botami. Zmienisz w `wrangler.toml`, sekcja `ratelimits`. |
| CORS tylko dla Twojej domeny | Inne strony nie wkleją Twojego czatu u siebie. Lista domen po przecinku w `ALLOWED_ORIGIN`. |

Budżet: w Console ustaw miesięczny limit wydatków (sekcja Limits w ustawieniach organizacji) i po pierwszym tygodniu sprawdź zużycie w Usage. Dopiero wtedy decyduj o zmianie modelu.

## 3. Zapytaj: panel we Framerze (wieczór 2, część 2)

| Krok | Co robisz |
|---|---|
| 1 | Assets, Code, New code file, nazwa `Zapytaj`, wklej `framer/Zapytaj.tsx`. |
| 2 | Wstaw komponent obok arkusza albo jako wysuwany panel (przycisk "Zapytaj o projekt" w nawigacji otwiera overlay). Rozmiar 380 x 520. |
| 3 | Adres Workera: adres z kroku deploy. |
| 4 | Karty prac: dla każdej pracy id z `wiedza.json`, nazwa, obraz, link do case study. |
| 5 | Podpowiedzi: 3 pytania, które naprawdę zadają agencje (na start są gotowe). |
| 6 | Na czas testu w podglądzie Framera dopisz adres podglądu do `ALLOWED_ORIGIN` w `wrangler.toml` i zrób `npm run deploy`. Po teście usuń. |

## Lista kontrolna przed publikacją

1. Strona główna w Lighthouse: Performance co najmniej 85 na telefonie (okładki WebP, lazy loading).
2. Na telefonie widać listę prac, nie arkusz.
3. Klik w każdą pracę otwiera właściwe case study.
4. Zapytaj odpowiada po polsku i po angielsku, nie podaje cen, przy pytaniu spoza wiedzy kieruje na mail.
5. 10 szybkich pytań pod rząd: po 8 przychodzi komunikat o limicie.
6. Na arkuszu i w `wiedza.json` nie ma nic z NDA.
7. Dopiero teraz publikujesz kopię albo przenosisz sekcje do głównego projektu.

## Pliki

```
wdrozenie/
  README.md                 ta instrukcja
  framer/Arkusz.tsx         komponent arkusza (pan, zoom, lupa, lista na telefonie)
  framer/Zapytaj.tsx        panel rozmowy z kartami prac
  zapytaj-worker/           funkcja Cloudflare z Claude API
    src/index.ts
    wiedza.json             o Tobie i projektach, jedyne źródło odpowiedzi
    wrangler.toml           domeny i limit pytań
    package.json, tsconfig.json
```
