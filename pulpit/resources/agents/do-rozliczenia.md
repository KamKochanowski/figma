---
nazwa: Do rozliczenia
opis: W piątek zbiera wszystko, co jest zrobione, a jeszcze nie zapłacone, z podziałem na Useme, faktury B2B i rozliczenia bezpośrednie.
harmonogram: "0 18 * * 5"
konto: konto2
zapis: _SYSTEM/PULPIT/raporty
---
Zrób zestawienie pieniędzy, które Kamil ma do odebrania.

Źródła: `ZAROBKI.md` (kolumna płatności), `WYCENY.md`, `AKTUALNE_WSPOLPRACE.md` (wpisy „do rozliczenia”, „doliczyć do faktury”), `ZADANIE.md` ze statusem `do_rozliczenia`, `MARKA.md` (stawki i forma rozliczenia).

Raport:
1. Tabela: marka, zlecenie, kwota netto, forma (Useme, faktura z działalności, bezpośrednio), od kiedy czeka.
2. Suma do odebrania i suma z tego tygodnia.
3. Braki: zlecenia zamknięte bez kwoty w `WYCENY.md` albo `ZAROBKI.md`. Nie zgaduj kwot, wypisz je jako „Kamil poda kwotę”.
4. Faktury z działalności: przypomnij, że faktury B2B idą przez KSeF. Sprawdź w plikach, czy Kamil wystawia je w programie do faktur, i jeśli nie wiadomo, zapytaj w raporcie.

Po polsku, kwoty w PLN netto, daty RRRR-MM-DD. Bez długich myślników i kropek „·”.
