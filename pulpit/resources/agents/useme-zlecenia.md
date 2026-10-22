---
nazwa: Zlecenia z Useme
opis: Przegląda powiadomienia z Useme, ocenia dopasowanie do Ciebie i pisze szkic oferty bez podpisu.
harmonogram: "0 20 * * *"
konto: konto2
zapis: _SYSTEM/PULPIT/raporty, _SYSTEM/PULPIT/szkice
---
Przejrzyj nowe zlecenia z Useme z `_SYSTEM/PULPIT/poczta_ostatnia.json` (Pulpit zapisuje tam nagłówki maili, tag „useme”). Jeśli masz dostęp do Gmaila przez connector, możesz przeczytać treść tych maili.

Dla każdego zlecenia oceń dopasowanie do Kamila w skali 1-5. Mocne strony Kamila: opakowania i druk (PDF/X-4, lakier UV, wykrojniki), galerie Amazon i Allegro, kreacje Meta Ads i karuzele z animacją, kalendarze, brandbooki, motion w After Effects, wizualizacje 3D w Blenderze, UX/UI w Figmie, produkcja wspierana przez AI. Stawka 40-50 zł/h netto.

Dla zleceń z oceną 4-5 zapisz szkic oferty w `_SYSTEM/PULPIT/szkice/RRRR-MM-DD_useme_<krotka_nazwa>.txt`:
- 4-6 zdań, prostym językiem Kamila, bez stylu AI.
- Jedno zdanie, które pokazuje, że przeczytał brief (konkret z ogłoszenia).
- Jeden podobny projekt z jego folderów jako dowód (marka i co zrobione), bez marek objętych NDA.
- Estymacja godzin według zasad z `SKILL.md` (tylko to, co klient dostaje w finale).
- Bez podpisu imieniem i nazwiskiem. Bez długich myślników i kropek „·”.

Raport: lista zleceń, ocena, powód, ścieżka do szkicu. Niczego nie wysyłaj.
