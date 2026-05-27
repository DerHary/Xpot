# Xpot

Xpot is a local offline tool for testing and developing XPath expressions.

## Why Xpot?

The focus is enterprise use:

- inspect XML locally without sending data outside
- develop and test XPath quickly
- keep behavior controlled and dependency-free
- deliberately avoid cloud services, CDNs, and external JavaScript

## Current State

The app currently runs fully locally via:

- [xpot.html](./xpot.html)
- [dependencies/app.js](./dependencies/app.js)
- [dependencies/xpath-engine.js](./dependencies/xpath-engine.js)
- [dependencies/suggestions.js](./dependencies/suggestions.js)
- [dependencies/samples.js](./dependencies/samples.js)
- [dependencies/styles.css](./dependencies/styles.css)

Nothing is loaded from external sources.

## Features

- local XML editing directly in the browser
- local file imports for XML and similar text files
- XPath evaluation with support for:
  - node matches
  - string results
  - number results
  - boolean results
- context-aware XPath suggestions
- clickable sample queries
- local XPath history via `localStorage`
- multiple sessions/tabs in the same browser
- XML formatting
- visual highlighting of matches in the XML tree
- modern offline-only UI with no external assets

## Security Direction

Xpot is designed for local use.

Current guardrails:

- no external scripts or libraries
- `Content-Security-Policy` against external loading paths
- `connect-src 'none'`
- network APIs such as `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, and `sendBeacon` are blocked in the app
- XML is processed as data, not as an executable page

Important:

- Xpot is a local browser tool, not a fully isolated sandbox container
- for stricter security requirements, a dedicated desktop wrapper with tighter permissions would make sense later

## Usage

1. Clone or download the repository
2. Open [xpot.html](./xpot.html) locally in the browser
3. Insert XML or import it via `Load File`
4. Enter an XPath expression
5. Click `Run` or press `Enter`

## Sample Queries

```xpath
//marke/@name
//marke[@name='BMW']/modell/name/text()
//modell[kraftstoff='Elektro']/name/text()
//modell[leistung_ps > 500]/name/text()
//marke[@name='Audi']/modell[name='RS6 Avant']/preis_eur/text()
count(//modell)
```

## Project Structure

```text
Xpot/
|- xpot.html
|- README.md
|- .gitignore
\- dependencies/
   |- app.js
   |- samples.js
   |- styles.css
   |- suggestions.js
   \- xpath-engine.js
```

## Next Useful Steps

- even stricter isolation for high-security environments
- performance testing with larger XML files
- optional search/filter functions in the XML tree
- export of sessions or XPath collections
