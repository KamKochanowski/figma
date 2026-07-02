# Benecol — redesign KV konkursowego (2 wersje)

Plik Figma: [KV BENECOL](https://www.figma.com/design/CRSVy91ln063I6LhgEUGKM/KV-BENECOL)

Na podstawie briefu klientki (KV inspiracyjne z klimatem foodowo-lifestyle'owym) powstały
**dwie nowe wersje KV 1920×1080** na tej samej stronie co frame „aktualne KV i claimy".
Wszystkie claimy, ikony, zdjęcia nagród, CTA, logo i przypis zostały **sklonowane 1:1
z frame'a „aktualne KV i claimy"** — treści i font (Kyrial Sans Pro) są identyczne.

## Wersja 1 — foto full-bleed + panel nagród (układ 1:1 z inspiracji)

- Link: https://www.figma.com/design/CRSVy91ln063I6LhgEUGKM/KV-BENECOL?node-id=5-2
- Frame: `KV KONKURS — WERSJA 1 (foto full-bleed + panel)` (id `5:2`)
- Zdjęcie lifestyle na całym tle (placeholder), nagłówek w tealu `#007378`
  z czerwonym sercem, subline z czerwoną końcówką „dla Ciebie i Twojego serca",
- po prawej **panel nagród w tealu** (zaokrąglony, z badgem KONKURS! i logo Benecol),
  nagrody oddzielone przerywanymi liniami jak w inspiracji,
- **flow zakupowy w zaokrąglonej ramce** (teal) z ikonami z aktualnego KV
  + czerwone numerki kroków 1-2-3 jak w inspiracji,
- CTA „Zgłoś się na www.benecol.pl" na dole po lewej,
- biały pasek przypisu na dole (treść przypisu 1:1 z aktualnego KV, kolor teal).

## Wersja 2 — brand teal + karta foto

- Link: https://www.figma.com/design/CRSVy91ln063I6LhgEUGKM/KV-BENECOL?node-id=8-2
- Frame: `KV KONKURS — WERSJA 2 (teal brand + karta foto)` (id `8:2`)
- Tło teal ze swirlem jak w aktualnym KV, logo + nagłówek + badge KONKURS! na górze,
- duża **zaokrąglona karta na zdjęcie AI** po lewej (z białą ramką i cieniem),
  CTA nachodzi na dolną krawędź karty,
- po prawej **biały panel nagród** (numery „10x/20x/100x" w czerwieni, opisy w tealu,
  przerywane separatory),
- flow zakupowy w białej pigułce na dole (ikony + claimy w tealu, numerki 1-2-3),
- przypis biały bezpośrednio na tealu — jak w aktualnym KV.

## Runda 2 — Wersje 3 i 4 (feedback: tło KV_BG + lepsze rozplanowanie nagród)

Po feedbacku (za duże puste przestrzenie przy nagrodach, tło „KV _BG" ma być głównym,
mocno widocznym motywem) powstały dwie kolejne wersje. Obie mają za bazę **klon frame'a
„KV _BG"** (teal + duży jasny swirl), a sekcje nagród są kompaktowe — bez martwych
przestrzeni po bokach.

### Wersja 3 — zdjęcie w karcie po lewej + kompaktowy biały panel nagród

- Link: https://www.figma.com/design/CRSVy91ln063I6LhgEUGKM/KV-BENECOL?node-id=10-2
- Frame: `KV KONKURS — WERSJA 3 (KV_BG + panel kompakt)` (id `10:2`)
- Duża karta na zdjęcie (1080×580) po lewej, wąski panel nagród (480 px) po prawej —
  między nimi widoczny pas swirla z KV_BG; treść panelu wyśrodkowana (zdjęcie 160 px +
  liczba + opis), separatory przerywane, numery w czerwieni, opisy w tealu,
- biały flow bar na dole (ikony + claimy w tealu + numeracja 1‑2‑3), CTA na zdjęciu,
  przypis biały na tle.

### Wersja 4 — nagrody bezpośrednio na tle + zdjęcie po prawej

- Link: https://www.figma.com/design/CRSVy91ln063I6LhgEUGKM/KV-BENECOL?node-id=12-2
- Frame: `KV KONKURS — WERSJA 4 (KV_BG + nagrody na tle)` (id `12:2`)
- Nagrody w lewej kolumnie bez panelu — bezpośrednio na swirlu (białe teksty jak
  w aktualnym KV, przerywane białe separatory) → maksimum widocznego tła,
- karta na zdjęcie (916×580) po prawej z CTA na dolnej krawędzi,
- flow bar w ciemniejszym tealu z oryginalnymi białymi claimami.

### Zdjęcie „ZDJĘCIE DO KV"

Plik ze zdjęciem **nie był jeszcze wgrany do pliku Figma** w momencie pracy (w pliku
jest tylko frame „KV _BG"). W wersjach 3 i 4 czeka ramka
`ZDJĘCIE DO KV — miejsce (podmień wypełnienie)` — po wrzuceniu zdjęcia do Figmy
wystarczy ustawić je jako wypełnienie (Fill → Image) tej ramki i usunąć tekst pomocniczy.

## Jak podmienić placeholder na zdjęcie AI (wersje 1 i 2)

W obu wersjach jest frame o nazwie **„🖼 TU WKLEJ ZDJĘCIE AI (podmień wypełnienie tej ramki)"**:

1. Wygeneruj zdjęcie (sugerowany prompt: jasna, ciepła kuchnia, drewniany stół,
   jogurty pitne Benecol + masło Benecol, jagody, pieczywo, klimat foodowy jak
   w KV inspiracyjnym).
2. Zaznacz frame placeholdera → w panelu Fill podmień kolor na **Image** i wgraj plik
   (lub przeciągnij obraz do ramki).
3. Usuń pomocnicze napisy „MIEJSCE NA ZDJĘCIE AI…" (są dziećmi tego frame'a).

## Uwagi techniczne

- Font **Kyrial Sans Pro nie jest dostępny** w środowisku edycji (font lokalny/Adobe) —
  dlatego teksty są klonami oryginałów (bez zmiany treści można je dowolnie przestawiać,
  przebarwiać i skalować przez Scale/K). Zmiana treści wymaga otwarcia pliku
  z zainstalowanym fontem.
- W przypisie w aktualnym KV jest literówka — cudzysłów na końcu
  `www.benecol.pl"` — sklonowana 1:1; do poprawienia ręcznie przy okazji edycji fontem.
- Kolory brandu użyte w projekcie: teal `#007378`, czerwień `#E73F4E`, biel.
