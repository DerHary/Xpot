![Xpot Logo](dependencies/xpot-logo.png)

# Xpot

Xpot is a local offline tool for testing and developing XPath expressions.

## What It Is

Xpot is built for local XML/XPath work without sending data outside your machine.

- local-only usage
- no cloud backend
- no external libraries or CDNs
- intended for enterprise-safe XPath testing workflows

## Current App Structure

- [xpot.html](./xpot.html)
- [dependencies/app.js](./dependencies/app.js)
- [dependencies/xpath-engine.js](./dependencies/xpath-engine.js)
- [dependencies/suggestions.js](./dependencies/suggestions.js)
- [dependencies/samples.js](./dependencies/samples.js)
- [dependencies/styles.css](./dependencies/styles.css)
- [dependencies/xpot-logo.png](./dependencies/xpot-logo.png)

## Current Features

- local XML editing in the browser
- multiple sessions
- create a new empty session
- create a new session from a sample set
- import a file as a new session
- XML formatting
- XPath evaluation for:
  - node matches
  - string results
  - number results
  - boolean results
- auto-generated sample queries based on XML structure
- result-based follow-up sample queries
- local XPath history via `localStorage`
- XML structure tree with match highlighting
- right-click XPath context menu inside `XML Structure`
- basic CDATA-aware handling in tree rendering and query generation

## Security Direction

Xpot is designed to stay local.

Important:

- Xpot is still a browser-based local tool, not a hardened sandbox runtime
- very large XML files and namespace-heavy XML are still areas that need more hardening

## Usage

1. Open [xpot.html](./xpot.html) locally in the browser.
2. Create a session:
   - `New Empty Session`
   - `Import File as Session`
   - `New From Sample`
3. Edit XML or load a file into its own session.
4. Enter an XPath expression and run it.
5. Use `XML Structure` for right-click XPath actions.

## Example Queries

```xpath
//CD[ARTIST[contains(text(), 'Bob Dylan')]]/TITLE/text()
//ARTIST[contains(text(), 'Bob Dylan')]/../TITLE/text()
//component[dependencies/dependency[@type='environment-variable']]/name/text()
//snippet[@language='javascript']/code/text()
count(//PLANT[LIGHT='Mostly Shady'])
```

## AI Note

This app is vibe-coded and was developed with AI assistance.
