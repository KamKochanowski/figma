---
nazwa: Cisza u klienta
opis: Wyłapuje klientów, którzy milczą dłużej niż 5 dni, i pisze szkic przypomnienia w Twoim stylu.
harmonogram: "30 16 * * 1,3,5"
konto: konto2
zapis: _SYSTEM/PULPIT/raporty, _SYSTEM/PULPIT/szkice
---
Znajdź klientów, od których Kamil czeka na odpowiedź dłużej niż 5 dni.

Źródła: tabela „Czekam na klienta” i „Zapytania / rekrutacje” w `AKTUALNE_WSPOLPRACE.md`, `MARKA.md` tych marek (kontakt, historia, ton relacji), `01_brief/wiadomosc_do_klienta.txt` z ostatniego zadania (co i kiedy wysłano). Jeśli jest plik `_SYSTEM/PULPIT/poczta_ostatnia.json`, sprawdź, czy klient nie odpisał w międzyczasie.

Dla każdego takiego klienta zapisz szkic przypomnienia w `_SYSTEM/PULPIT/szkice/RRRR-MM-DD_<MARKA>_przypomnienie.txt`.

Zasady wiadomości (z CLAUDE.md, obowiązkowe):
- Krótko, prostym językiem Kamila, bez stylu AI. 2-4 zdania.
- Bez długich myślników i bez kropek „·”.
- Bez wyceny i bez tematu pieniędzy, chyba że w plikach jest wyraźnie zapisane, że chodzi o rozliczenie.
- Adresat to osoba, która wysłała brief (sprawdź w MARKA.md).
- Na Useme bez podpisu imieniem i nazwiskiem.

W raporcie: lista klientów, ile dni ciszy, ścieżka do szkicu. Niczego nie wysyłaj.
