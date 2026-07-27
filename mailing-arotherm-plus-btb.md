# Mailing aroTHERM plus — B2B, lipiec 2026

Makieta: Figma → plik `mailing` (`eM1ymvF4Gytco31xPEbq4i`), frame **MAILING aroTHERM plus B2B — lipiec 2026** (`3:2`).
Obok makiety frame **NOTATKI — tematy, preheadery, uwagi** (`13:2`).

Źródła: brief `MAILING TECHNICZNY dla BTB - nowa PC PLUS lipiec 2026`, reklama prasowa
`V_AROTHERM_REKLAMA_205x290_30.06.26_KK_2_wersja_dodatkowe_produkty`, próbki mailingów `1:10` i `1:133`.

## Grupa docelowa

Branża BTB: projektanci, instalatorzy, pracownicy branży budowlanej, architekci, hydraulicy, firmy branżowe.

## Tematy i preheadery (3 warianty z briefu)

| # | Temat | Preheader |
|---|-------|-----------|
| 1 | Poznaj nową aroTHERM plus | 75°C zasilania, ηs do 202%, cicha praca i większa swoboda montażu |
| 2 | Nowa aroTHERM plus! Jeszcze lepsze parametry | 75°C zasilania, ηs do 202% i tylko 27,5 dB(A). |
| 3 | 75°C zasilania i tylko 27,5 dB(A) | Poznaj nową generację aroTHERM plus |

## Struktura (600 px, jedna kolumna)

| Sekcja | Node | Zawartość |
|--------|------|-----------|
| header | `3:3` | logo Vaillant, tło białe (klon z próbki) |
| hero | `3:8` | foto główne (instalator + pompa), falka, badge'e, headline |
| strip | `7:2` | Monoblokowe pompy ciepła powietrze-woda **aroTHERM plus** |
| sekcja II | `7:4` | nagłówek, lead, lista 7 benefitów, CTA |
| sekcja III | `9:5` | nagłówek, copy, zestaw urządzeń, CTA |
| footer | `10:18` | stopka teal z logo, www i social (klon z próbki) |

### Hero

- Badge'e (prawy górny róg, zgodnie z briefem „gdzieś na górze przy zdjęciu"):
  `NOWOŚĆ` (asset `nowosc_icon`), `tylko 27,5 dB(A)`, ikona R290 (asset `leaf-r290_krzywe 1`)
  + opis `Naturalny czynnik chłodniczy R290`
- Headline (lewy dolny róg): `NASZ HIT.` (pomarańcz) → `NOWY TYPOSZEREG.` → `JESZCZE LEPSZE PARAMETRY` (teal)

### Sekcja II — copy

**Absolutnie wydajne i energooszczędne! Poznaj nowe pompy ciepła aroTHERM plus**

Nowa generacja monoblokowych pomp ciepła powietrze-woda została zaprojektowana z myślą o jeszcze wyższej
wydajności, większej elastyczności montażu i komforcie użytkowania. Parametry urządzeń odpowiadają
wymaganiom nowych i modernizowanych instalacji.

aroTHERM plus to:

1. temperatura zasilania do **75°C** – idealna także do modernizowanych instalacji z grzejnikami; przy
   temperaturze zewnętrznej **-15°C** urządzenie osiąga **60°C bez użycia dodatkowej grzałki**
2. współczynnik sezonowej efektywności **ηs do 202%** oraz klasa energetyczna **A+++**
3. zredukowane strefy bezpieczeństwa wokół jednostki zewnętrznej dzięki funkcji **FSF**
4. wyjątkowo cicha praca – **tylko 27,5 dB(A)** z odległości 3 metrów
5. **4 warianty mocy**: 5, 7, 10 i 12 kW
6. **4 jednostki wewnętrzne** do wyboru: wieża hydrauliczna, dwa moduły naścienne lub interfejs użytkownika
7. moduł komunikacji internetowej **VR 940 myVaillant connect**

CTA: `Poznaj aroTHERM plus`

### Sekcja III — copy

**Elastyczna konfiguracja dla różnych inwestycji**

Sprawdź nowe modele, warianty mocy i dostępne konfiguracje systemu.
Zobacz, jak **aroTHERM plus** może ułatwić projektowanie i realizację instalacji.

Zestaw urządzeń: Regulator · Jednostka zewnętrzna · Jednostka wewnętrzna

CTA: `Poznaj aroTHERM plus`

## Style

| Element | Wartość |
|---------|---------|
| Szerokość | 600 px |
| Teal (nagłówki, boxy, stopka) | `#00917E` |
| Pomarańcz (CTA, „NASZ HIT.") | `#FF8500` |
| Szare tło sekcji | `#F4F4F4` |
| Nagłówki H2 | 24 px bold, teal, centrowane |
| Body | 16 px, lista 15 px, interlinia 135% |
| CTA | 16 px bold, białe na pomarańczowym, wys. 40 px |

## Uwagi produkcyjne

- **Typografia** – użyto `Arimo` (metrycznie zgodny z Arial, tak jak obie próbki). `Vaillant_16` nie jest
  dostępny po stronie serwera Figmy — do podmiany na firmowy krój.
- **Ikona R290** – dostarczony asset `leaf-r290_krzywe 1` ma napis „NATURAL PERFORMANCE" po angielsku,
  a brief wymaga wersji polskiej. Ikona została użyta w oryginale, a obok dodano opis
  „Naturalny czynnik chłodniczy R290". Do podmiany, jeśli istnieje wersja PL.
- **Packshoty** – w pliku dostępne 3: regulator, jednostka zewnętrzna (jednowentylatorowa),
  jednostka wewnętrzna. Brief sugeruje dodatkowo model dwuwentylatorowy i moduł naścienny —
  brak tych assetów w pliku.
- Oba CTA do podlinkowania pod LP kampanii.
