# Xpot

Offline-Tool zum Testen und Entwickeln von XPath-Ausdruecken.

## Ziel

Xpot ist fuer lokale XPath-Tests gedacht. Das Tool soll im Unternehmenskontext nutzbar sein, ohne dass XML-Daten, Testdaten oder Eingaben nach draussen gehen.

## Aktueller Stand

Der aktuelle Prototyp besteht aus einer einzelnen Datei:

- [xpot.html](./xpot.html)

Die Datei kann direkt lokal im Browser geoeffnet werden und enthaelt:

- einen XML-Editor
- ein XPath-Eingabefeld
- einfache XPath-Vorschlaege auf Basis des geladenen XML
- eine Ergebnisanzeige
- ein eingebautes XML-Beispiel mit Fahrzeugdaten

## Features im aktuellen Prototyp

- Vollstaendig lokal nutzbar
- Keine externen Abhaengigkeiten
- XML wird direkt im Browser per `DOMParser` geparst
- XPath wird direkt im Browser per `document.evaluate(...)` ausgefuehrt
- Vorschlaege fuer:
  - Elementpfade
  - Attributpfade
  - einfache Filter-Ausdruecke
  - `text()`-Zugriffe
- Sofortiges Testen von XPath-Ausdruecken per Button

## Verwendung

1. Repository klonen oder herunterladen
2. `xpot.html` lokal im Browser oeffnen
3. XML im oberen Bereich anpassen oder ersetzen
4. XPath eingeben
5. `Testen` klicken

## Beispiel-XPath

```xpath
//marke/@name
//marke[@name='BMW']/modell/name/text()
//modell[kraftstoff='Elektro']/name/text()
//modell[leistung_ps > 500]/name/text()
//marke[@name='Audi']/modell[name='RS6 Avant']/preis_eur/text()
//marke[@name='Mercedes-Benz']/@land
```

## Technischer Aufbau

Aktuell ist alles in einer Datei umgesetzt:

- HTML fuer Struktur
- eingebettetes CSS fuer das UI
- eingebettetes JavaScript fuer Parsing, Vorschlaege und XPath-Auswertung

Wichtige Funktionen in `xpot.html`:

- `parseXml()`
- `buildSuggestions()`
- `showSuggestions()`
- `runXPath()`

## Sicherheitsziel

Xpot soll ausschliesslich lokal laufen.

Wichtige Leitplanken:

- keine Datenuebertragung nach aussen
- keine externen Skripte oder Libraries
- geeignet fuer sensible XML-Daten im Unternehmensumfeld
- Fokus auf kontrollierbares, nachvollziehbares Offline-Verhalten

## Bekannte Grenzen des aktuellen Prototyps

- noch kein Datei-Import fuer XML
- noch kein Datei-Export
- noch keine visuelle Hervorhebung gefundener Knoten
- Vorschlaege sind einfach und nicht voll kontextsensitiv
- gesamter Code liegt noch in einer einzigen HTML-Datei
- Security-Haertung fuer problematische Testinhalte ist noch nicht abgeschlossen

## Naechste sinnvolle Schritte

- XML-Dateiimport
- bessere XPath-Autovervollstaendigung
- Aufteilung in HTML, CSS und JavaScript
- weitere Security-Haertung fuer Unternehmensnutzung
- bessere UX fuer Fehler, Treffer und grosse XML-Daten
