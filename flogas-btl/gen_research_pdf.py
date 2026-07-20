# -*- coding: utf-8 -*-
"""Generator PDF: research + wytyczne do taska 'Kreacje BTL – przetarg Flogas'."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------------------------------------------------------------- fonts
FDIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DVS", f"{FDIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DVS-B", f"{FDIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily("DVS", normal="DVS", bold="DVS-B", italic="DVS", boldItalic="DVS-B")

# ---------------------------------------------------------------- brand colours
PURPLE   = colors.HexColor("#5A2A82")
TURQ     = colors.HexColor("#00ACC8")
BURGUNDY = colors.HexColor("#60003A")
RUBY     = colors.HexColor("#ED1556")
BLUE     = colors.HexColor("#0056B8")
CYAN     = colors.HexColor("#06A7E2")
ORANGE   = colors.HexColor("#F04F23")
YELLOW   = colors.HexColor("#FDB813")
FOREST   = colors.HexColor("#047832")
LIME     = colors.HexColor("#76BD1D")
VIRIDIAN = colors.HexColor("#00B09B")
WARMGRAY = colors.HexColor("#766863")
LIGHTBG  = colors.HexColor("#F4F1EC")
INK      = colors.HexColor("#2B2B2B")

PAGE_W, PAGE_H = A4
M = 16 * mm

# ---------------------------------------------------------------- styles
def st(name, **kw):
    base = dict(fontName="DVS", fontSize=9.5, leading=14, textColor=INK,
                alignment=TA_LEFT, spaceAfter=5)
    base.update(kw)
    return ParagraphStyle(name, **base)

S_H1   = st("h1", fontName="DVS-B", fontSize=19, leading=23, textColor=PURPLE,
            spaceBefore=2, spaceAfter=8)
S_H2   = st("h2", fontName="DVS-B", fontSize=13, leading=17, textColor=PURPLE,
            spaceBefore=10, spaceAfter=4)
S_H3   = st("h3", fontName="DVS-B", fontSize=10.5, leading=14, textColor=TURQ,
            spaceBefore=8, spaceAfter=3)
S_BODY = st("body")
S_SMALL= st("small", fontSize=8.5, leading=12, textColor=WARMGRAY)
S_LI   = st("li", leftIndent=10, bulletIndent=2, spaceAfter=3)
S_TAG  = st("tag", fontName="DVS-B", fontSize=8.5, textColor=colors.white)
S_TH   = st("th", fontName="DVS-B", fontSize=8.5, leading=11, textColor=colors.white, spaceAfter=0)
S_TD   = st("td", fontSize=8.5, leading=11, spaceAfter=0)
S_TDB  = st("tdb", fontName="DVS-B", fontSize=8.5, leading=11, spaceAfter=0)

def P(text, style=S_BODY):
    return Paragraph(text, style)

def LI(text):
    return Paragraph(text, S_LI, bulletText="•")

def section_header(num, title):
    t = Table(
        [[Paragraph(f"<font color='white'><b>{num}</b></font>", st("num", fontName="DVS-B", fontSize=13, textColor=colors.white, spaceAfter=0)),
          Paragraph(f"<b>{title}</b>", st("secttl", fontName="DVS-B", fontSize=14.5, leading=18, textColor=PURPLE, spaceAfter=0))]],
        colWidths=[12*mm, PAGE_W - 2*M - 12*mm], rowHeights=[11*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), PURPLE),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN", (0,0), (0,0), "CENTER"),
        ("LINEBELOW", (1,0), (1,0), 2, TURQ),
        ("LEFTPADDING", (1,0), (1,0), 6),
    ]))
    return [t, Spacer(1, 5*mm)]

def info_box(title, lines, bg=LIGHTBG, accent=TURQ):
    rows = [[Paragraph(f"<b>{title}</b>", st("bxt", fontName="DVS-B", fontSize=9.5, textColor=PURPLE, spaceAfter=0))]]
    for ln in lines:
        rows.append([Paragraph(ln, st("bxb", fontSize=8.8, leading=12.5, spaceAfter=0))])
    t = Table(rows, colWidths=[PAGE_W - 2*M - 6])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("LINEBEFORE", (0,0), (0,-1), 3, accent),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (0,0), 7),
        ("BOTTOMPADDING", (0,-1), (0,-1), 7),
        ("TOPPADDING", (0,1), (0,-1), 2),
        ("BOTTOMPADDING", (0,0), (0,-2), 2),
    ]))
    return t

# ---------------------------------------------------------------- page furniture
def later_pages(canv, doc):
    canv.saveState()
    canv.setStrokeColor(TURQ); canv.setLineWidth(2)
    canv.line(M, PAGE_H - 12*mm, PAGE_W - M, PAGE_H - 12*mm)
    canv.setFont("DVS-B", 7.5); canv.setFillColor(PURPLE)
    canv.drawString(M, PAGE_H - 10*mm, "FLOGAS — research do taska BTL (przetarg)")
    canv.setFont("DVS", 7.5); canv.setFillColor(WARMGRAY)
    canv.drawRightString(PAGE_W - M, PAGE_H - 10*mm, "poufne / wewnętrzne")
    canv.setFont("DVS", 8); canv.setFillColor(WARMGRAY)
    canv.drawRightString(PAGE_W - M, 8*mm, f"{doc.page}")
    canv.setFillColor(TURQ)
    canv.rect(M, 7.6*mm, 5*mm, 1.2*mm, stroke=0, fill=1)
    canv.restoreState()

def cover(canv, doc):
    canv.saveState()
    canv.setFillColor(PURPLE)
    canv.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canv.setFillColor(TURQ)
    canv.roundRect(M, PAGE_H - 165*mm, PAGE_W - 2*M, 120*mm, 6*mm, stroke=0, fill=1)
    # fake logo lockup
    canv.setFillColor(colors.white)
    canv.setFont("DVS-B", 34)
    canv.drawString(M + 12*mm, PAGE_H - 78*mm, "Kreacje BTL")
    canv.drawString(M + 12*mm, PAGE_H - 92*mm, "dla Flogas")
    canv.setFont("DVS", 13)
    canv.drawString(M + 12*mm, PAGE_H - 106*mm, "Research brandbooka + wytyczne wykonawcze")
    canv.drawString(M + 12*mm, PAGE_H - 114*mm, "do 8 formatów z brifu przetargowego")
    # deco circles (brand motif)
    for (cx, cy, r, col) in [(158, 210, 16, PURPLE), (176, 235, 8, PURPLE),
                             (185, 197, 11, BURGUNDY), (147, 246, 5, BURGUNDY)]:
        canv.setFillColor(col)
        canv.circle(cx*mm, cy*mm, r*mm, stroke=0, fill=1)
    canv.setFillColor(colors.white)
    canv.setFont("DVS-B", 11)
    canv.drawString(M + 12*mm, 52*mm, "Hasło przewodnie:")
    canv.setFont("DVS-B", 20)
    canv.drawString(M + 12*mm, 42*mm, "„Energia, którą tworzą ludzie”")
    canv.setFont("DVS", 10)
    canv.drawString(M + 12*mm, 30*mm, "Zadanie: Przygotowanie kreacji BTL na potrzeby przetargu Flogas   |   Data zlecenia: 17.07")
    canv.drawString(M + 12*mm, 24*mm, "Opracowano na podstawie: Flogas Brand Identity Guidelines (Update 1.1, 59 str.) + brief")
    canv.setFont("DVS", 9)
    canv.setFillColor(colors.HexColor("#C9B8DD"))
    canv.drawString(M + 12*mm, 14*mm, "Energy for everyone — strapline zawsze w lockupie logo, nie tłumaczymy go na PL.")
    canv.restoreState()

# ---------------------------------------------------------------- helpers
def color_row(name, chip, pantone, cmyk, rgb, hexv):
    return [chip, Paragraph(f"<b>{name}</b>", S_TDB), Paragraph(pantone, S_TD),
            Paragraph(cmyk, S_TD), Paragraph(rgb, S_TD), Paragraph(hexv, S_TD)]

def chip(col):
    t = Table([[""]], colWidths=[9*mm], rowHeights=[5.5*mm])
    t.setStyle(TableStyle([("BACKGROUND", (0,0), (0,0), col),
                           ("BOX", (0,0), (0,0), 0.25, colors.HexColor("#DDDDDD"))]))
    return t

# ================================================================ content
story = []
story.append(PageBreak())

# ---------- 1. TL;DR
story += section_header("1", "Najważniejsze w 60 sekund (TL;DR)")
story.append(P("Kompletny research z brandbooka Flogas (59 stron) pod kątem naszego taska. "
               "Jeżeli masz tylko minutę — to jest esencja:"))
story.append(Spacer(1, 2*mm))
for x in [
    "<b>Dwa kolory rządzą wszystkim:</b> Flogas Purple <b>#5A2A82</b> + Flogas Turquoise <b>#00ACC8</b> "
    "+ dużo <b>bieli</b> (biel to oficjalnie trzeci kolor primary — identyfikacja ma „oddychać”).",
    "<b>Fonty:</b> ITC Avant Garde Gothic Pro — <b>wyłącznie nagłówki/hasła</b> (nigdy body copy). "
    "Lexia — podtytuły i teksty. Obydwa są na Adobe Fonts (linki w brifie).",
    "<b>Logo:</b> preferowana wersja pełnokolorowa na białym tle. Pole ochronne = wysokość litery „F”. "
    "Minimalna szerokość w druku: 8 mm. Logo zawsze w prawym dolnym rogu layoutu (tam gdzie się da).",
    "<b>Wersja reversed (biała) logo wymaga zgody marketingu Flogas</b> — na przetarg bezpieczniej "
    "projektować gadżety na białym/jasnym tle z logo full-colour.",
    "<b>Motyw graficzny „energii”:</b> brandbook używa turkusowego fluidu (tusz w wodzie) i fioletowych "
    "cząsteczek na białym tle — dokładnie to jest na referencjach ścianek i roll-upów (str. 46–47 brandbooka). "
    "Nasz „fantom człowieka z fluidu” idealnie się w to wpisuje.",
    "<b>Fotografia:</b> autentyczna, kadry naturalne, ciepłe światło, różnorodność, zero pozowania "
    "i „stockowego” looku. Flogas ma być jedyną widoczną marką w kadrze.",
    "<b>Hasła taska:</b> ścianka — „Energia, którą tworzą” + <b>puste miejsce zamiast „LUDZIE”</b> "
    "(staje tam uczestnik). Gadżety — „Tworzę Flogas” + logotyp.",
]:
    story.append(LI(x))
story.append(Spacer(1, 3*mm))
story.append(info_box("Strapline", [
    "„Energy for everyone” jest zablokowany przy logo (lockup) — traktujemy go jako element logotypu. "
    "Nie tłumaczymy go i nie oddzielamy od znaku. Nasze polskie hasła żyją obok, jako headline’y."]))

story.append(PageBreak())

# ---------- 2. zakres
story += section_header("2", "Zadanie i zakres — 8 formatów")
story.append(P("Cel: spójna oprawa graficzna wydarzenia dla pracowników Flogas, wzmacniająca poczucie "
               "przynależności — „to ludzie tworzą energię marki”. Specyfikacja: mockupy generowane AI. "
               "Deadline: zgodnie z taskiem. Referencja w prezentacji przetargowej: slajdy 76–78."))
rows = [[Paragraph("<b>#</b>", S_TH), Paragraph("<b>Format</b>", S_TH), Paragraph("<b>Hasło</b>", S_TH), Paragraph("<b>Uwagi</b>", S_TH)]]
data = [
    ("1", "Ścianka fotograficzna", "„Energia, którą tworzą [ ]”", "puste miejsce = uczestnik; grafiki stockowe + fluid"),
    ("2", "Wizualizacja ścianki na evencie", "—", "przestrzeń wydarzenia pracowniczego"),
    ("3", "Mockup zdjęcia uczestnika", "—", "osoba na tle ścianki „dopełnia” hasło"),
    ("4", "Mockup cover photo LinkedIn", "—", "wykorzystuje zdjęcie spod ścianki"),
    ("5", "Kubek termiczny", "„Tworzę Flogas”", "+ logotyp Flogas"),
    ("6", "Bluza", "„Tworzę Flogas”", "+ logotyp Flogas"),
    ("7", "Kubek ceramiczny", "„Tworzę Flogas”", "+ logotyp Flogas"),
    ("8", "Baton energetyczny", "„Tworzę Flogas”", "+ logotyp Flogas"),
]
for r in data:
    rows.append([Paragraph(r[0], S_TD), Paragraph(f"<b>{r[1]}</b>", S_TDB), Paragraph(r[2], S_TD), Paragraph(r[3], S_TD)])
t = Table(rows, colWidths=[8*mm, 46*mm, 52*mm, 72*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 4*mm))
story.append(P("Elementy koncepcji wymagane w brifie:", S_H3))
for x in [
    "grafiki stockowe kojarzące się z energią (w kolorach brandbooka);",
    "motyw abstrakcyjnego człowieka / fantomu zbudowanego z energetycznego fluidu;",
    "dynamiczne, płynne formy nawiązujące do przepływu energii;",
    "pozytywny, angażujący, pracowniczy charakter komunikacji.",
]:
    story.append(LI(x))
story.append(Spacer(1, 3*mm))
story.append(info_box("Formaty plików (do potwierdzenia z PM)", [
    "W brifie pole wymiarów zawiera przykład „600×1200 px, figma, jpg…” — wygląda na placeholder szablonu. "
    "Rekomendacja: projekty w <b>Figma</b>, eksporty <b>JPG/PNG</b> do prezentacji + <b>PDF (CMYK)</b> dla formatów drukowanych. "
    "Potwierdź wymiary docelowe ścianki z produkcją przed finałem."]))

story.append(PageBreak())

# ---------- 3. marka
story += section_header("3", "Fundamenty marki Flogas")
story.append(P("<b>Kim jest Flogas:</b> irlandzki dostawca energii (LPG, gaz ziemny, energia elektryczna, "
               "LNG, autogaz, OZE), spółka grupy DCC. Strapline: <b>„Energy for everyone”</b>. "
               "Sponsor Team Ireland (osobny system co-brandingu — nie dotyczy naszego taska)."))
story.append(P("Tone of voice — 4 filary:", S_H2))
tv = Table([[
    Paragraph("<b>Real</b><br/><font size=8.5>konkret, prosty język, „can-do”, autentyczność</font>", st("tv1", textColor=colors.white, fontSize=9.5, leading=13, spaceAfter=0)),
    Paragraph("<b>Warm</b><br/><font size=8.5>ludzie w centrum, empatia, przyjazny ton</font>", st("tv2", textColor=colors.white, fontSize=9.5, leading=13, spaceAfter=0)),
    Paragraph("<b>Engaging</b><br/><font size=8.5>aktywność, innowacja, angażowanie odbiorcy</font>", st("tv3", textColor=colors.white, fontSize=9.5, leading=13, spaceAfter=0)),
    Paragraph("<b>Energetic</b><br/><font size=8.5>dynamika, życie, energia w każdym elemencie</font>", st("tv4", textColor=colors.white, fontSize=9.5, leading=13, spaceAfter=0)),
]], colWidths=[(PAGE_W-2*M)/4.0]*4)
tv.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,0), VIRIDIAN),
    ("BACKGROUND", (1,0), (1,0), ORANGE),
    ("BACKGROUND", (2,0), (2,0), CYAN),
    ("BACKGROUND", (3,0), (3,0), RUBY),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ("LEFTPADDING", (0,0), (-1,-1), 7), ("RIGHTPADDING", (0,0), (-1,-1), 7),
]))
story.append(tv)
story.append(Spacer(1, 3*mm))
story.append(P("Nasze hasła „Energia, którą tworzą ludzie” i „Tworzę Flogas” wprost realizują filary "
               "Warm + Energetic — komunikacja pracownicza ma być pozytywna i osobista (1 os. l.poj. "
               "w „Tworzę Flogas” daje efekt deklaracji/dumy)."))
story.append(P("Biała przestrzeń", S_H2))
story.append(P("Brandbook wielokrotnie podkreśla: biel jest kluczowym składnikiem identyfikacji. Layouty "
               "mają być czyste, na siatce (A4: marginesy 10 mm, 6 kolumn × 12 wierszy), z dużą ilością "
               "światła. Referencyjne ścianki i roll-upy są na <b>białym tle</b> — nie projektujemy "
               "„zalanych” kolorem powierzchni bez potrzeby."))

# ---------- 4. logo
story.append(PageBreak())
story += section_header("4", "Logo — zasady użycia")
story.append(P("Wersje logo", S_H2))
for x in [
    "<b>Primary</b> — pełny kolor na białym tle. Zawsze pierwszy wybór.",
    "<b>Keyline</b> — z białą obwódką, wyłącznie na tłach kolorowych (nigdy na bieli). Grubości obwódki nie wolno zmieniać.",
    "<b>Mono</b> — czarna, gdy dostępny jest tylko czarny kolor (np. grawer, jednokolorowy nadruk).",
    "<b>Outline</b> — konturowa, do szyb/drzwi szklanych.",
    "<b>Reversed (biała)</b> — <font color='#ED1556'><b>tylko za zgodą marketingu Flogas!</b></font> "
    "Ważne przy ciemnych gadżetach i fioletowych tłach.",
]:
    story.append(LI(x))
story.append(P("Zasady twarde", S_H2))
for x in [
    "Pole ochronne = wysokość litery <b>„F”</b> z logotypu, mierzone z każdej strony (dla keyline liczone z białą obwódką).",
    "Minimalna szerokość w druku: <b>8 mm</b>. Na małych przedmiotach (długopisy itp.) dopuszczalna wersja "
    "<b>bez strapline’u</b> min. 3,5 mm — tylko w wyjątkowych, zaakceptowanych przypadkach.",
    "Pozycja: <b>prawy dolny róg</b> komunikacji, wszędzie tam gdzie to możliwe (na ściance z ref. str. 47 logo jest u góry po prawej — dozwolony wariant przy dużych formatach ekspozycyjnych).",
    "Strapline „Energy for everyone” zawsze przy logo — czytelny, ani za duży, ani za mały.",
]:
    story.append(LI(x))
story.append(P("Czego nie wolno (incorrect usage)", S_H2))
for x in [
    "rozdzielać romboidów FLO/GAS ani odrywać strapline’u; zmieniać wzajemnych proporcji elementów;",
    "rozciągać/ściskać znaku; skalować elementy niezależnie; układać FLO nad GAS („stackować”);",
    "zmieniać kolorów — logo istnieje tylko w wersjach brandowych, mono i reversed;",
    "pogrubiać/pocieniać obwódki keyline.",
]:
    story.append(LI(x))
story.append(Spacer(1, 2*mm))
story.append(info_box("Paczka logo z brifu", [
    "Link „flogas-rgb-zip” = wersje <b>RGB</b> (digital). Do druku (ścianka, gadżety) potrzebujemy plików "
    "wektorowych <b>CMYK</b> (EPS/AI/PDF) — poproś o master artworks (kontakt w brandbooku: eoflynn@flogas.ie) "
    "albo konwertuj pilnując wartości: Purple C85 M98 Y0 K22, Turquoise C76 M0 Y18 K0."]))

story.append(PageBreak())

# ---------- 5. kolory
story += section_header("5", "Paleta kolorów — pełna specyfikacja")
story.append(P("Kolory primary", S_H2))
rows = [[Paragraph("", S_TH), Paragraph("<b>Kolor</b>", S_TH), Paragraph("<b>Pantone</b>", S_TH),
         Paragraph("<b>CMYK</b>", S_TH), Paragraph("<b>RGB</b>", S_TH), Paragraph("<b>HEX</b>", S_TH)]]
rows.append(color_row("Flogas Purple", chip(PURPLE), "268", "85 / 98 / 0 / 22", "76, 33, 119", "#5A2A82"))
rows.append(color_row("Flogas Turquoise", chip(TURQ), "3125", "76 / 0 / 18 / 0", "0, 171, 191", "#00ACC8"))
rows.append(color_row("White (pełnoprawny kolor)", chip(colors.white), "—", "0 / 0 / 0 / 0", "255, 255, 255", "#FFFFFF"))
t = Table(rows, colWidths=[13*mm, 45*mm, 22*mm, 34*mm, 30*mm, 24*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 3.5), ("BOTTOMPADDING", (0,0), (-1,-1), 3.5),
]))
story.append(t)
story.append(P("Kolory secondary", S_H2))
rows = [[Paragraph("", S_TH), Paragraph("<b>Kolor</b>", S_TH), Paragraph("<b>Pantone</b>", S_TH),
         Paragraph("<b>CMYK</b>", S_TH), Paragraph("<b>RGB</b>", S_TH), Paragraph("<b>HEX</b>", S_TH)]]
sec = [
    ("Flogas Burgundy", BURGUNDY, "229", "26 / 100 / 19 / 61", "103, 33, 70", "#60003A"),
    ("Flogas Ruby", RUBY, "1925", "0 / 100 / 66 / 0", "224, 0, 77", "#ED1556"),
    ("Flogas Blue", BLUE, "2935", "100 / 68 / 0 / 0", "0, 87, 184", "#0056B8"),
    ("Flogas Cyan (Light Blue)", CYAN, "2995", "80 / 10 / 0 / 0", "0, 169, 224", "#06A7E2"),
    ("Flogas Orange", ORANGE, "1655", "0 / 85 / 100 / 0", "252, 76, 2", "#F04F23"),
    ("Flogas Yellow", YELLOW, "1235", "0 / 30 / 100 / 0", "255, 184, 28", "#FDB813"),
    ("Flogas Forest (Dark Green)", FOREST, "356", "100 / 26 / 100 / 15", "0, 122, 51", "#047832"),
    ("Flogas Lime", LIME, "368", "60 / 0 / 100 / 0", "120, 190, 32", "#76BD1D"),
    ("Flogas Viridian", VIRIDIAN, "3275", "100 / 0 / 50 / 0", "0, 179, 152", "#00B09B"),
    ("Flogas Warm Gray", WARMGRAY, "Warm Gray 10", "0 / 15 / 15 / 65", "121, 110, 100", "#766863"),
]
for (n, c, pnt, cm, rgbv, hx) in sec:
    rows.append(color_row(n, chip(c), pnt, cm, rgbv, hx))
t = Table(rows, colWidths=[13*mm, 45*mm, 22*mm, 34*mm, 30*mm, 24*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 3.5), ("BOTTOMPADDING", (0,0), (-1,-1), 3.5),
]))
story.append(t)
story.append(Spacer(1, 3*mm))
story.append(P("Gradienty produktowe (Tab Device)", S_H2))
story.append(P("Gradienty przypisane do produktów/usług — używane <b>wyłącznie</b> w „Tab Device” "
               "(zakładka z nazwą produktu, wisząca od lewej górnej krawędzi). Tylko CMYK/RGB, nie Pantone: "
               "LPG (Purple→Ruby), Renewables (Forest→Lime), Natural Gas (Orange→Yellow), Electricity "
               "(Blue→Cyan), LNG (Burgundy→Orange), Autogas (Viridian→Cyan). W naszym tasku raczej "
               "niepotrzebne (event pracowniczy ≠ komunikat produktowy), ale warto znać system."))
story.append(info_box("Dla naszego taska", [
    "Trzymaj się bazy: <b>Purple + Turquoise + biel</b>. Kolory secondary tylko akcentowo "
    "(np. cząsteczki fluidu, drobne detale). To wystarczy do „kolorów zgodnych z brandbookiem” z brifu, "
    "a projekt pozostanie czysty i rozpoznawalny."]))

story.append(PageBreak())

# ---------- 6. typografia
story += section_header("6", "Typografia")
rows = [
    [Paragraph("<b>Font</b>", S_TH), Paragraph("<b>Rola</b>", S_TH), Paragraph("<b>Zasady</b>", S_TH)],
    [Paragraph("<b>ITC Avant Garde Gothic Pro</b>", S_TDB), Paragraph("nagłówki, hasła", S_TD),
     Paragraph("geometryczny sans; <b>wyłącznie headline’y</b> — nigdy body copy. W brifie wskazany jako font haseł "
               "(Adobe Fonts). Odważne, krótkie hasła, często Bold/Demi.", S_TD)],
    [Paragraph("<b>Lexia</b>", S_TDB), Paragraph("podtytuły, body copy", S_TD),
     Paragraph("slab-serif, przyjazny i czytelny; sub-heading i teksty. W brifie wskazany jako font copy (Adobe Fonts).", S_TD)],
    [Paragraph("Myriad", S_TD), Paragraph("zastępczy", S_TD),
     Paragraph("gdy powyższe niedostępne.", S_TD)],
    [Paragraph("Arial", S_TD), Paragraph("MS Office", S_TD),
     Paragraph("prezentacje, maile, dokumenty biurowe.", S_TD)],
]
t = Table(rows, colWidths=[48*mm, 32*mm, 98*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 3*mm))
story.append(P("Hierarchia copy (z brandbooka)", S_H2))
for x in [
    "<b>01 Heading</b> — sedno idei, krótko, po ludzku („Tailored to you”); duży Avant Garde, Purple/Burgundy lub biel na zdjęciu.",
    "<b>02 Sub-heading</b> — pragmatycznie, konkretnie; Avant Garde/Lexia, np. Ruby lub Turquoise.",
    "<b>03 Main copy</b> — opisowo; Lexia, Warm Gray lub czerń.",
]:
    story.append(LI(x))
story.append(Spacer(1, 2*mm))
story.append(info_box("Polskie znaki — sprawdź przed finałem!", [
    "Hasła zawierają <b>ą, ó, ę, ż</b> („Energia, którą tworzą”, „Tworzę Flogas”). ITC Avant Garde Gothic Pro "
    "i Lexia na Adobe Fonts wspierają alfabet CE, ale <b>zweryfikuj rendering diakrytyków</b> (szczególnie ogonki "
    "w Avant Garde przy Bold) zanim wyeksportujesz finalne pliki. Ustaw język tekstu na polski w Figmie/AI."],
    accent=RUBY))

# ---------- 7. foto & grafika
story.append(PageBreak())
story += section_header("7", "Fotografia i motywy graficzne")
story.append(P("Styl fotografii", S_H2))
for x in [
    "autentyczne, „złapane” momenty; ludzie w różnym wieku, różnych etniczności — różnorodność jest wprost wymagana;",
    "naturalne światło (poranek / późne popołudnie = cieplejszy klimat), wysoki kontrast OK jeśli naturalny;",
    "kompozycja prosta, głębia ostrości, przestrzeń wokół akcji (możliwość kadrowania);",
    "Flogas jedyną widoczną marką — żadnych rozpoznawalnych logotypów/etykiet w tle.",
]:
    story.append(LI(x))
story.append(P("Czego unikać", S_H2))
for x in [
    "pozowania i „katalogowego” looku; przesadnie uśmiechniętych twarzy; sztucznych/kolorowanych teł;",
    "kamery skierowanej z góry na bohatera; płaskiego, zimnego światła; nadmiernego retuszu, filtrów i efektów;",
    "przekolorowywania i nienaturalnego skalowania zdjęć.",
]:
    story.append(LI(x))
story.append(P("Motyw „energetycznego fluidu” (kluczowa referencja: str. 46–47 brandbooka)", S_H2))
story.append(P("Systemy ekspozycyjne Flogas używają dwóch motywów na białym tle: "
               "<b>turkusowy fluid</b> (jak tusz rozpuszczający się w wodzie — organiczna, dymna forma) oraz "
               "<b>fioletowy „particle burst”</b> (rozproszone drobinki/cząsteczki). Duży backdrop: logo u góry "
               "po prawej, wielki fioletowy headline po lewej, turkusowy fluid po prawej stronie, adres www. "
               "Roll-upy: logo u góry po lewej, headline, motyw graficzny na dole. To jest gotowy przepis "
               "na naszą ściankę — wystarczy podmienić hasło i wpleść fantom człowieka we fluid."))
story.append(Spacer(1, 2*mm))
story.append(info_box("Gdzie szukać stocków", [
    "Frazy: „turquoise ink in water black/white background”, „colored smoke abstract flow”, „particle wave "
    "purple”, „energy flow abstract fluid”. Wybieraj zdjęcia/rendery na białym lub łatwym do wybielenia tle, "
    "potem tonuj do #00ACC8 / #5A2A82. Uwaga na zasadę „no filters” — tonowanie ma wyglądać naturalnie."]))

story.append(PageBreak())

# ---------- 8. formaty 1-4
story += section_header("8", "Wytyczne wykonawcze — ścianka i digital (formaty 1–4)")
story.append(P("1. Ścianka fotograficzna „Energia, którą tworzą [   ]”", S_H2))
for x in [
    "<b>Wymiar:</b> do potwierdzenia z produkcją; typowo 3×2,4 m lub 4×2,4 m. Projekt 1:1 w min. 100 dpi "
    "(lub 1:10 w 1000 dpi), CMYK, spady wg specyfikacji drukarni; druk matowy (bez refleksów na zdjęciach!).",
    "<b>Layout wg wzorca backdropu (str. 47):</b> białe tło, hasło w ITC Avant Garde Gothic Pro Bold w Flogas Purple, "
    "wyrównane do lewej w górnej strefie; logo w prawym górnym rogu; turkusowy fluid wchodzący od prawej/dołu.",
    "<b>Puste miejsce na uczestnika:</b> strefa min. 90–100 cm szerokości, na wysokości sylwetki (do ~190 cm). "
    "Trik: wydrukuj samo <b>podkreślenie „______”</b> po słowach „Energia, którą tworzą” — osoba stojąca nad "
    "linią staje się brakującym słowem. Dodaj dyskretny marker na podłodze (naklejka „Stań tutaj”).",
    "<b>Fantom z fluidu:</b> abstrakcyjna sylwetka człowieka uformowana z turkusowego fluidu po przeciwnej "
    "stronie niż uczestnik — balans kompozycji i czytelna metafora „człowiek = energia”.",
    "<b>Wysokość hasła:</b> wersaliki min. 15–20 cm — musi być czytelne na zdjęciu z telefonu z 3–4 m.",
    "<b>Produkcja winylowa (spec z brandbooka):</b> Simply Polymeric 7640/7642, Metamark M7-183/M7-151, "
    "Avery 600 / 617 / 609.",
]:
    story.append(LI(x))
story.append(P("2. Wizualizacja ścianki w przestrzeni eventu", S_H2))
for x in [
    "Scena jak na referencji z brifu: przestrzeń biurowa/rooftop, ciepłe wieczorne światło, pracownicy w tle, "
    "gadżety na stole (kubki, torby, notesy) — pokazujemy cały ekosystem brandingu.",
    "Zachowaj zasady foto Flogas: naturalne światło, candid, bez pozowania. Format 16:9 pod slajd przetargowy.",
]:
    story.append(LI(x))
story.append(P("3. Mockup zdjęcia uczestnika na tle ścianki", S_H2))
for x in [
    "Jedna osoba (lub dwie) w miejscu „LUDZIE” — uśmiech naturalny, nie przesadny; kadr frontalny, "
    "oko aparatu na wysokości oczu (nigdy z góry!).",
    "Przygotuj kadry: poziomy 4:1 (pod cover LinkedIn), 4:5 i 1:1 (social) — od razu pokażesz użyteczność konceptu.",
]:
    story.append(LI(x))
story.append(P("4. Mockup cover photo na LinkedIn", S_H2))
for x in [
    "<b>Profil osobisty: 1584×396 px (4:1)</b>, JPG/PNG do 8 MB. (Strona firmowa: 1128×191 px — gdyby brief "
    "rozszerzono.)",
    "<b>Strefy bezpieczne:</b> na desktopie awatar zasłania lewy dolny róg, na mobile kadr jest ciaśniejszy — "
    "kluczowe elementy (osoba + hasło) trzymaj w prawych 2/3 szerokości i w pionowym centrum.",
    "Koncept: zdjęcie spod ścianki wkomponowane tak, by uczestnik „dopełniał” hasło również w coverze — "
    "spójność między eventem a wizerunkiem pracownika w sieci (employee advocacy).",
    "Zrób mockup w kontekście UI LinkedIn (jak referencja z brifu — profil z awatarem) — sprzedaje ideę lepiej "
    "niż sama grafika.",
]:
    story.append(LI(x))

story.append(PageBreak())

# ---------- 9. formaty 5-8
story += section_header("9", "Wytyczne wykonawcze — gadżety (formaty 5–8)")
story.append(P("Zasady wspólne dla wszystkich gadżetów", S_H2))
for x in [
    "Hasło „Tworzę Flogas” w ITC Avant Garde Gothic Pro (Demi/Bold), w Flogas Purple lub Turquoise; "
    "logo full-colour z zachowanym polem ochronnym (wysokość „F”) i min. szerokością 8 mm.",
    "Najbezpieczniejsze tło: <b>białe / jasne</b> — primary logo bez ryzyka. Ciemne/fioletowe gadżety wymagają "
    "reversed logo = zgoda marketingu Flogas (na przetargu można pokazać jako wariant „opcjonalny”).",
    "Przy sitodruku/tampodruku ogranicz liczbę kolorów: Purple + Turquoise (2 kolory spot) wystarczą.",
    "Nie rozdzielaj logo od strapline’u; nie graweruj wersji kolorowej — do graweru służy mono.",
]:
    story.append(LI(x))
story.append(P("5. Kubek termiczny", S_H2))
for x in [
    "Referencja z brifu: beżowy/kremowy kubek — uwaga: beż nie jest kolorem Flogas; rekomendacja: <b>biały</b> "
    "(primary logo) albo wariant Purple z białym nadrukiem (do akceptacji).",
    "Pole zadruku: typowo ~170–200 × 70–80 mm (wrap) lub panel 60×80 mm; hasło z jednej strony, logo z drugiej "
    "(albo lockup hasło+logo jednostronny, frontem do wręczającego).",
]:
    story.append(LI(x))
story.append(P("6. Bluza (hoodie)", S_H2))
for x in [
    "Referencja: biała bluza — zgodna z brandem. Nadruk centralny na piersi: hasło „Tworzę Flogas” dużym "
    "Avant Garde + logo poniżej lub logo małe na lewej piersi (9–10 cm) i hasło na plecach.",
    "Max pole nadruku przód: ~30×35 cm. DTG lub sitodruk; na białym pełny kolor bez kompromisów.",
    "Fajny detal do zaproponowania: mała metka/print na rękawie z fluidem turkusowym.",
]:
    story.append(LI(x))
story.append(P("7. Kubek ceramiczny", S_H2))
for x in [
    "Standard 330 ml, biały; pole zadruku ~190×80 mm (wrap).",
    "Układ: hasło po stronie „do świata” (gdy praworęczny trzyma kubek), logo po drugiej stronie lub przy dnie; "
    "opcja: wnętrze/ucho w Turquoise (kalka) jako energetyczny akcent.",
]:
    story.append(LI(x))
story.append(P("8. Baton energetyczny", S_H2))
for x in [
    "Flow-pack, front ~140–150 × 45–55 mm. Gra słów: baton energetyczny = „energia, którą tworzą ludzie” — "
    "warto dodać mikrocopy na opakowaniu, np. „Dawka energii od Flogas”.",
    "Referencja z brifu (granatowy Vilgain) sugeruje ciemne tło: u nas = Flogas Purple z białym „Tworzę Flogas” "
    "→ wymaga reversed logo (zgoda) <b>lub</b> keyline logo (dozwolone na kolorze bez pytania!) — to elegancki "
    "unik: <b>na kolorowych tłach używaj wersji keyline</b>.",
    "Wariant bezpieczny: białe opakowanie, fluid turkusowy, primary logo.",
]:
    story.append(LI(x))
story.append(Spacer(1, 2*mm))
story.append(info_box("Patent na ciemne tła — bez czekania na zgody", [
    "Brandbook wprost dopuszcza <b>keyline logo na tłach kolorowych</b> (biała obwódka, bez zgody marketingu). "
    "Jeśli chcesz fioletowy baton/kubek — użyj keyline zamiast reversed i jesteś w 100% zgodny z guidelines."]))

story.append(PageBreak())

# ---------- 10. AI
story += section_header("10", "Mockupy AI — jak do tego podejść + prompty")
story.append(P("Brief wymaga mockupów generowanych AI. Kluczowa praktyka: <b>AI generuje scenę/nośnik, "
               "a typografię i logo nakładasz ręcznie w Figmie/Photoshopie</b> — generatory wciąż przekręcają "
               "litery (zwłaszcza polskie diakrytyki) i nie odtworzą poprawnie logo. Generuj więc czyste "
               "obiekty (pusty kubek, pusta ścianka), potem mockup-uj nadruk warstwą z realnym wektorem."))
story.append(P("Przykładowe prompty (EN działa najlepiej)", S_H2))
prompts = [
    ("Ścianka + event", "Wide photo of a modern office rooftop event at dusk, employees mingling, large white "
     "backdrop wall with abstract turquoise ink-in-water fluid graphic and bold purple headline space, warm "
     "string lights, candid documentary style, photorealistic, 16:9"),
    ("Uczestnik przy ściance", "Candid photo of a smiling employee standing in front of a white event backdrop "
     "with turquoise fluid smoke graphics and purple typography, natural warm light, eye-level shot, "
     "photorealistic, space on the wall left of the person for text"),
    ("Fantom z fluidu", "Abstract human silhouette formed from flowing turquoise ink in water, dissolving "
     "particles, white background, elegant energy flow, brand colors #00ACC8 and #5A2A82, minimal, high key"),
    ("Kubek termiczny", "Studio product mockup of a plain white reusable thermal coffee tumbler, blank surface "
     "for branding, soft shadows, clean light gray background, photorealistic, front view"),
    ("Bluza", "Flat lay mockup of a plain white hoodie on neutral background, no logos, soft natural light, "
     "photorealistic, front view, space for chest print"),
    ("Kubek ceramiczny", "Classic white ceramic mug, blank, studio lighting, white background with soft "
     "reflection, photorealistic, handle on the right"),
    ("Baton", "Flow-pack energy bar wrapper mockup, plain deep purple foil, blank front panel, studio product "
     "photography, photorealistic, slight top-down angle"),
]
rows = [[Paragraph("<b>Format</b>", S_TH), Paragraph("<b>Prompt</b>", S_TH)]]
for (n, p) in prompts:
    rows.append([Paragraph(f"<b>{n}</b>", S_TDB), Paragraph(p, st("pr", fontSize=8, leading=11, spaceAfter=0))])
t = Table(rows, colWidths=[36*mm, 142*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 3*mm))
story.append(P("Do promptów wizualizacyjnych dodawaj negatywy: „no readable text, no logos, no watermarks” — "
               "mniej czyszczenia później. Spójność serii uzyskasz podając te same HEX-y i „white background, "
               "high-key lighting” w każdym prompcie."))

# ---------- 11. checklista
story += section_header("11", "Checklista przed oddaniem (adaptacja z brandbooka)")
for x in [
    "☐  Oryginalne pliki logo (wektor), właściwa wersja do tła (primary/keyline/mono) i widoczność",
    "☐  Pole ochronne „F” zachowane wszędzie; logo ≥ 8 mm; strapline czytelny",
    "☐  Fonty brandowe: Avant Garde tylko nagłówki, Lexia w copy; polskie diakrytyki sprawdzone",
    "☐  Ograniczona paleta: Purple + Turquoise + biel, akcenty secondary świadome",
    "☐  Zdjęcia: naturalne, candid, bez obcych brandów; brak przekolorowań",
    "☐  Layout na siatce, dużo bieli, hierarchia: heading → sub → copy",
    "☐  Ścianka: strefa na uczestnika, czytelność hasła z dystansu, druk matowy, CMYK",
    "☐  LinkedIn cover: 1584×396, safe-zones (awatar!), waga < 8 MB",
    "☐  Gadżety: liczba kolorów nadruku potwierdzona z produkcją; keyline na tłach kolorowych",
    "☐  Finalna prostota — „as simple and focused as possible” (kryterium z brandbooka)",
]:
    story.append(P(x, st("chk", fontSize=9.5, leading=16, spaceAfter=2)))

story.append(PageBreak())

# ---------- 12. ryzyka
story += section_header("12", "Ryzyka, pytania otwarte i statusy")
rows = [[Paragraph("<b>Temat</b>", S_TH), Paragraph("<b>Ryzyko / pytanie</b>", S_TH), Paragraph("<b>Rekomendacja</b>", S_TH)]]
risks = [
    ("Reversed logo", "Białe logo wymaga zgody marketingu Flogas — dotyczy ciemnych gadżetów.",
     "Na przetarg: keyline na kolorze lub jasne tła; wariant dark oznaczyć „do akceptacji”."),
    ("Pliki logo", "Paczka z brifu jest RGB — brak wektorów CMYK do druku.",
     "Poprosić o master artworks (eoflynn@flogas.ie) lub konwersja wg wartości CMYK z tej rozpiski."),
    ("Wymiary ścianki", "Brief nie podaje finalnego wymiaru (placeholder „600×1200 px”).",
     "Potwierdzić z PM/produkcją; projektować w proporcji 3:2,4 ze skalowalnym layoutem."),
    ("Diakrytyki w haśle", "„którą/tworzą/Tworzę” — ogonki muszą wyglądać dobrze w Avant Garde Pro.",
     "Test renderu na Adobe Fonts przed finałem; ewentualnie ręczna korekta kerningu przy ą/ę."),
    ("Prezentacja przetargowa", "Slajdy 76–78 (Flogas – Rebranding x They Digital) to dodatkowy kontekst.",
     "Screeny z brifu pokrywają najważniejsze (backdrop, roll-upy, event) — ale zajrzyj do pliku, jeśli masz dostęp."),
    ("Strapline po polsku", "Pokusa tłumaczenia „Energy for everyone”.",
     "Nie tłumaczyć — strapline jest częścią logo. Polskie hasła żyją jako osobne headline’y."),
]
for r in risks:
    rows.append([Paragraph(f"<b>{r[0]}</b>", S_TDB), Paragraph(r[1], S_TD), Paragraph(r[2], S_TD)])
t = Table(rows, colWidths=[32*mm, 68*mm, 78*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 4*mm))
story.append(P("Źródła", S_H2))
for x in [
    "Flogas Brand Identity Guidelines — Update 1.1 (59 stron; sekcje: Visual Identity, Stationery, "
    "Printed Communications, Vehicle Livery, Appendix). Kontakt ws. wytycznych: Eoin O’Flynn, eoflynn@flogas.ie.",
    "Brief taska „Przygotowanie kreacji BTL na potrzeby przetargu Flogas” (17.07) + slajdy referencyjne.",
    "Fonty: fonts.adobe.com/fonts/itc-avant-garde-gothic  •  fonts.adobe.com/fonts/lexia.",
]:
    story.append(LI(x))
story.append(PageBreak())

# ---------- 13. aneks: mockupy AI
story += section_header("13", "Aneks — wygenerowane mockupy AI (Magnific × Nano Banana Pro)")
story.append(P("Do wszystkich 8 formatów z brifu wygenerowałem startowe mockupy modelem <b>Google Nano Banana "
               "Pro</b> (via Magnific), w brandowych kolorach #5A2A82 / #00ACC8, z polskimi hasłami i opisowo "
               "odtworzonym logo. Pliki (2K PNG) czekają w Twojej bibliotece Magnific — poniżej klikalne linki. "
               "Pamiętaj: przed użyciem w przetargu <b>podmień AI-owe logo i typografię na realne wektory</b> "
               "(zasada z sekcji 10)."))
story.append(Spacer(1, 2*mm))
mock_rows = [[Paragraph("<b>#</b>", S_TH), Paragraph("<b>Mockup</b>", S_TH), Paragraph("<b>Format</b>", S_TH), Paragraph("<b>Link (Magnific)</b>", S_TH)]]
mocks = [
    ("1", "Ścianka fotograficzna — projekt frontalny (hasło + puste miejsce + fluid-fantom)", "16:9",
     "https://www.magnific.com/app/creation/43OiT8t9Aa"),
    ("2", "Wizualizacja ścianki na evencie (rooftop, wieczór, gadżety na stole)", "16:9",
     "https://www.magnific.com/app/creation/3GNAeFbREY"),
    ("3", "Mockup zdjęcia uczestnika „dopełniającego” hasło", "3:2",
     "https://www.magnific.com/app/creation/ONw9WFAynm"),
    ("4", "Mockup cover photo na LinkedIn (w kontekście UI profilu)", "16:9",
     "https://www.magnific.com/app/creation/iA92pgr3uK"),
    ("5", "Kubek termiczny „Tworzę Flogas”", "4:5",
     "https://www.magnific.com/app/creation/tfoarbjmZJ"),
    ("6", "Bluza (hoodie) „Tworzę Flogas” + akcent fluid na rękawie", "4:5",
     "https://www.magnific.com/app/creation/VdceEESMMU"),
    ("7", "Kubek ceramiczny „Tworzę Flogas” + fluid przy dnie", "1:1",
     "https://www.magnific.com/app/creation/YVGThuOWeC"),
    ("8", "Baton energetyczny — purpurowy flow-pack, logo keyline", "4:3",
     "https://www.magnific.com/app/creation/gJL7AehSXO"),
]
for m in mocks:
    mock_rows.append([Paragraph(m[0], S_TD), Paragraph(m[1], S_TD), Paragraph(m[2], S_TD),
                      Paragraph(f"<link href='{m[3]}'><font color='#00ACC8'><u>{m[3].rsplit('/',1)[-1]}</u></font></link>", S_TD)])
t = Table(mock_rows, colWidths=[8*mm, 92*mm, 20*mm, 58*mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PURPLE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHTBG]),
    ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#E3DED6")),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
]))
story.append(t)
story.append(Spacer(1, 3*mm))
story.append(info_box("Jak korzystać z tych mockupów", [
    "1. Otwórz link → pobierz PNG 2K z Magnific. 2. Zweryfikuj polskie diakrytyki w wygenerowanym tekście "
    "(AI potrafi przekręcić „ą/ę”). 3. Nałóż prawdziwe logo (wektor) i hasło w ITC Avant Garde Gothic Pro "
    "w Figmie. 4. Wariant batonu ma logo keyline — zgodne z brandbookiem na kolorowym tle bez zgody marketingu. "
    "Iteracje: te same prompty z sekcji 10 + referencja obrazkowa w Magnific (reference-guided edit)."]))

story.append(Spacer(1, 6*mm))
story.append(P("Powodzenia! Koncept z „brakującym słowem” jest mocny — trzymaj go blisko wzorców ze str. 46–47 "
               "brandbooka, a całość będzie wyglądać, jakby zaprojektował ją zespół Flogas.",
               st("outro", fontSize=10, leading=15, textColor=PURPLE)))

# ---------------------------------------------------------------- build
OUT = os.environ.get("OUT", "Flogas_BTL_research.pdf")
doc = BaseDocTemplate(OUT, pagesize=A4,
                      leftMargin=M, rightMargin=M, topMargin=20*mm, bottomMargin=14*mm,
                      title="Flogas BTL — research i wytyczne (przetarg)",
                      author="They Digital — research")
frame = Frame(M, 14*mm, PAGE_W - 2*M, PAGE_H - 36*mm, id="main")
cover_frame = Frame(M, 14*mm, PAGE_W - 2*M, PAGE_H - 28*mm, id="cover")
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[cover_frame], onPage=cover),
    PageTemplate(id="Body", frames=[frame], onPage=later_pages),
])
from reportlab.platypus import NextPageTemplate
story.insert(0, NextPageTemplate("Body"))
doc.build(story)
print("OK ->", OUT)
