const sampleSets = window.XpotSamples;
const suggestionsApi = window.XpotSuggestions;
const xpathEngine = window.XpotXPathEngine;

const STORAGE_KEYS = {
    sessions: "xpot.sessions",
    activeSessionId: "xpot.activeSessionId",
    history: "xpot.xpathHistory"
};

const DEFAULT_HISTORY_LIMIT = 18;

const elements = {
    xmlEditor: document.getElementById("xml-editor"),
    xpathInput: document.getElementById("xpath-input"),
    sessionName: document.getElementById("session-name"),
    sessionTabs: document.getElementById("session-tabs"),
    sessionSampleSelect: document.getElementById("session-sample-select"),
    fileInput: document.getElementById("file-input"),
    importSessionFileButton: document.getElementById("import-session-file"),
    formatXmlButton: document.getElementById("format-xml"),
    newEmptySessionButton: document.getElementById("new-empty-session"),
    newSessionButton: document.getElementById("new-session"),
    runButton: document.getElementById("run-xpath"),
    clearXPathButton: document.getElementById("clear-xpath"),
    clearHistoryButton: document.getElementById("clear-history"),
    suggestions: document.getElementById("suggestions"),
    historyList: document.getElementById("history-list"),
    quickExamples: document.getElementById("quick-examples"),
    xmlStatus: document.getElementById("xml-status"),
    xpathStatus: document.getElementById("xpath-status"),
    resultSummary: document.getElementById("result-summary"),
    resultOutput: document.getElementById("result-output"),
    resultDetails: document.getElementById("result-details"),
    resultCount: document.getElementById("result-count"),
    xmlTree: document.getElementById("xml-tree"),
    xmlTreeMenu: document.getElementById("xml-tree-menu")
};

const appState = {
    sessions: [],
    activeSessionId: null,
    xpathHistory: [],
    lastSuggestions: [],
    currentXmlDoc: null,
    currentResultItems: [],
    currentExampleSetId: sampleSets[0]?.id ?? null,
    treeMenuVisible: false
};

function quoteXPathLiteral(value) {
    if (!value.includes("'")) {
        return `'${value}'`;
    }

    if (!value.includes('"')) {
        return `"${value}"`;
    }

    return `'${value.replace(/'/g, "")}'`;
}

function getElementRelativePath(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    const parent = node.parentElement;
    if (!parent) {
        return `//${node.nodeName}`;
    }

    return `//${parent.nodeName}/${node.nodeName}`;
}

function buildElementMenuOptions(node) {
    const options = new Set([
        xpathEngine.getNodePath(node),
        `//${node.nodeName}`,
        getElementRelativePath(node)
    ]);

    if (node.attributes.length > 0) {
        for (const attribute of Array.from(node.attributes).slice(0, 3)) {
            options.add(`//${node.nodeName}[@${attribute.name}=${quoteXPathLiteral(attribute.value)}]`);
            options.add(`//${node.nodeName}/@${attribute.name}`);
        }
    }

    const leafChildren = Array.from(node.children).filter((child) => child.children.length === 0 && child.textContent.trim());
    for (const child of leafChildren.slice(0, 3)) {
        const textValue = child.textContent.trim();
        options.add(`//${node.nodeName}/${child.nodeName}/text()`);
        options.add(`//${node.nodeName}[${child.nodeName}=${quoteXPathLiteral(textValue)}]`);
    }

    if (node.children.length === 0) {
        options.add(`${xpathEngine.getNodePath(node)}/text()`);
        options.add(`//${node.nodeName}/text()`);
        const textValue = node.textContent.trim();
        if (textValue) {
            options.add(`//${node.nodeName}[text()=${quoteXPathLiteral(textValue)}]`);
        }
    }

    return Array.from(options).filter(Boolean).slice(0, 10);
}

function buildAttributeMenuOptions(attribute) {
    const owner = attribute.ownerElement;
    if (!owner) {
        return [];
    }

    return [
        xpathEngine.getNodePath(attribute),
        `//${owner.nodeName}/@${attribute.name}`,
        `//${owner.nodeName}[@${attribute.name}]`,
        `//${owner.nodeName}[@${attribute.name}=${quoteXPathLiteral(attribute.value)}]`
    ];
}

function buildTextMenuOptions(textNode) {
    const parent = textNode.parentElement;
    const textValue = textNode.textContent.trim();
    if (!parent || !textValue) {
        return [];
    }

    return [
        xpathEngine.getNodePath(textNode),
        `//${parent.nodeName}/text()`,
        `//${parent.nodeName}[text()=${quoteXPathLiteral(textValue)}]`,
        `//${parent.nodeName}[contains(text(), ${quoteXPathLiteral(textValue.slice(0, 40))})]`
    ];
}

function buildCdataMenuOptions(cdataNode) {
    const parent = cdataNode.parentElement;
    const textValue = cdataNode.textContent.trim();
    if (!parent || !textValue) {
        return [];
    }

    const shortened = textValue.replace(/\s+/g, " ").trim().slice(0, 40);

    return [
        xpathEngine.getNodePath(cdataNode),
        `//${parent.nodeName}/text()`,
        `//${parent.nodeName}[contains(text(), ${quoteXPathLiteral(shortened)})]`,
        `//${parent.nodeName}[../@language]`
    ];
}

function buildMenuOptionsForNode(node, kind) {
    if (!node) {
        return [];
    }

    if (kind === "attribute" || node.nodeType === Node.ATTRIBUTE_NODE) {
        return buildAttributeMenuOptions(node);
    }

    if (kind === "text" || node.nodeType === Node.TEXT_NODE) {
        return buildTextMenuOptions(node);
    }

    if (kind === "cdata" || node.nodeType === Node.CDATA_SECTION_NODE) {
        return buildCdataMenuOptions(node);
    }

    return buildElementMenuOptions(node);
}

function hideXmlTreeMenu() {
    elements.xmlTreeMenu.hidden = true;
    elements.xmlTreeMenu.textContent = "";
    appState.treeMenuVisible = false;
}

function resolveTreeContextTarget(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];

    for (const entry of path) {
        if (entry?.xpotNode) {
            return entry;
        }
    }

    let current = event.target;

    if (current?.nodeType === Node.TEXT_NODE) {
        current = current.parentElement;
    }

    while (current && current !== elements.xmlTree) {
        if (current.xpotNode) {
            return current;
        }

        current = current.parentElement;
    }

    return null;
}

function showXmlTreeMenu(x, y, options) {
    elements.xmlTreeMenu.textContent = "";

    const title = document.createElement("div");
    title.className = "context-menu-title";
    title.textContent = "XPath actions";
    elements.xmlTreeMenu.appendChild(title);

    for (const option of options) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "context-menu-item";
        button.textContent = option;
        button.addEventListener("click", () => {
            elements.xpathInput.value = option;
            updateSession({ xpath: option });
            hideXmlTreeMenu();
            runXPath();
        });
        elements.xmlTreeMenu.appendChild(button);
    }

    elements.xmlTreeMenu.hidden = false;
    appState.treeMenuVisible = true;

    const { innerWidth, innerHeight } = window;
    const menuRect = elements.xmlTreeMenu.getBoundingClientRect();
    const clampedLeft = Math.min(x, innerWidth - menuRect.width - 12);
    const clampedTop = Math.min(y, innerHeight - menuRect.height - 12);

    elements.xmlTreeMenu.style.left = `${Math.max(8, clampedLeft)}px`;
    elements.xmlTreeMenu.style.top = `${Math.max(8, clampedTop)}px`;
}

function disableNetworkPrimitives() {
    const blocked = () => {
        throw new Error("Network access is disabled in Xpot.");
    };

    const BlockedConstructor = function () {
        blocked();
    };

    window.fetch = blocked;
    window.WebSocket = BlockedConstructor;
    window.EventSource = BlockedConstructor;
    window.XMLHttpRequest = BlockedConstructor;

    if (navigator.sendBeacon) {
        navigator.sendBeacon = () => false;
    }
}

function createSession({ name, xml, xpath }) {
    return {
        id: `session-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name,
        xml,
        xpath,
        sampleId: null,
        quickExamples: []
    };
}

function getSampleById(sampleId) {
    return sampleSets.find((sample) => sample.id === sampleId) ?? sampleSets[0];
}

function createSessionFromSample(sampleId) {
    const sample = getSampleById(sampleId);

    const session = createSession({
        name: sample.label,
        xml: sample.xml,
        xpath: sample.defaultXPath
    });

    session.sampleId = sample.id;
    session.quickExamples = [...sample.examples];
    return session;
}

function safeJsonParse(rawValue, fallback) {
    try {
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch {
        return fallback;
    }
}

function normalizeSession(session) {
    return {
        ...session,
        sampleId: session.sampleId ?? null,
        quickExamples: Array.isArray(session.quickExamples) ? session.quickExamples : []
    };
}

function loadState() {
    const storedSessions = safeJsonParse(localStorage.getItem(STORAGE_KEYS.sessions), []);
    const storedHistory = safeJsonParse(localStorage.getItem(STORAGE_KEYS.history), []);
    const storedActiveSessionId = localStorage.getItem(STORAGE_KEYS.activeSessionId);

    appState.sessions = Array.isArray(storedSessions) && storedSessions.length > 0
        ? storedSessions.map(normalizeSession)
        : [createSessionFromSample(appState.currentExampleSetId)];

    appState.xpathHistory = Array.isArray(storedHistory) ? storedHistory.slice(0, DEFAULT_HISTORY_LIMIT) : [];
    appState.activeSessionId = appState.sessions.some((session) => session.id === storedActiveSessionId)
        ? storedActiveSessionId
        : appState.sessions[0].id;
}

function persistState() {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(appState.sessions));
    localStorage.setItem(STORAGE_KEYS.activeSessionId, appState.activeSessionId);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(appState.xpathHistory));
}

function getActiveSession() {
    return appState.sessions.find((session) => session.id === appState.activeSessionId) ?? appState.sessions[0];
}

function updateSession(patch) {
    appState.sessions = appState.sessions.map((session) => {
        if (session.id !== appState.activeSessionId) {
            return session;
        }

        return {
            ...session,
            ...patch
        };
    });

    persistState();
    renderSessionTabs();
}

function setStatus(card, tone, title, message) {
    card.className = `status-card ${tone}`;
    card.innerHTML = "";

    const strong = document.createElement("strong");
    strong.textContent = title;

    const span = document.createElement("span");
    span.textContent = message;

    card.appendChild(strong);
    card.appendChild(span);
}

function renderSessionTabs() {
    elements.sessionTabs.textContent = "";

    for (const session of appState.sessions) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = session.id === appState.activeSessionId ? "session-tab active" : "session-tab";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", session.id === appState.activeSessionId ? "true" : "false");

        const label = document.createElement("span");
        label.textContent = session.name;
        button.appendChild(label);

        if (appState.sessions.length > 1) {
            const closeButton = document.createElement("span");
            closeButton.className = "session-tab-close";
            closeButton.textContent = "x";
            closeButton.title = "Close session";
            closeButton.addEventListener("click", (event) => {
                event.stopPropagation();
                removeSession(session.id);
            });
            button.appendChild(closeButton);
        }

        button.addEventListener("click", () => {
            appState.activeSessionId = session.id;
            persistState();
            syncUiFromSession();
            runXPath();
        });

        elements.sessionTabs.appendChild(button);
    }
}

function removeSession(sessionId) {
    if (appState.sessions.length === 1) {
        return;
    }

    appState.sessions = appState.sessions.filter((session) => session.id !== sessionId);

    if (!appState.sessions.some((session) => session.id === appState.activeSessionId)) {
        appState.activeSessionId = appState.sessions[0].id;
    }

    persistState();
    syncUiFromSession();
    runXPath();
}

function renderSessionSampleSelect() {
    for (const sample of sampleSets) {
        const option = document.createElement("option");
        option.value = sample.id;
        option.textContent = sample.label;
        elements.sessionSampleSelect.appendChild(option);
    }
}

function renderQuickExamples(sampleId) {
    const activeSession = getActiveSession();
    const sample = sampleId ? getSampleById(sampleId) : null;
    const baseExamples = activeSession.quickExamples.length > 0
        ? activeSession.quickExamples
        : sample?.examples ?? [];
    const contextualExamples = generateResultContextExamples(appState.currentResultItems);
    const examples = [...new Set([...contextualExamples, ...baseExamples])].slice(0, 16);

    elements.quickExamples.textContent = "";

    if (examples.length === 0) {
        const empty = document.createElement("span");
        empty.className = "muted";
        empty.textContent = "No sample queries available.";
        elements.quickExamples.appendChild(empty);
        return;
    }

    for (const example of examples) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.textContent = example;
        button.addEventListener("click", () => {
            elements.xpathInput.value = example;
            updateSession({ xpath: example });
            runXPath();
        });
        elements.quickExamples.appendChild(button);
    }
}

function generateResultContextExamples(resultItems) {
    if (!Array.isArray(resultItems) || resultItems.length === 0) {
        return [];
    }

    const contextual = new Set();
    const seenKeys = new Set();

    for (const item of resultItems.slice(0, 3)) {
        const node = item.node;
        const kind = item.kind;
        const key = `${kind}:${item.path}`;

        if (seenKeys.has(key)) {
            continue;
        }
        seenKeys.add(key);

        contextual.add(item.path);

        if (node.nodeType === Node.ELEMENT_NODE) {
            contextual.add(`//${node.nodeName}`);

            if (node.parentElement) {
                contextual.add(`//${node.parentElement.nodeName}/${node.nodeName}`);
            }

            for (const attribute of Array.from(node.attributes).slice(0, 2)) {
                contextual.add(`//${node.nodeName}/@${attribute.name}`);
                contextual.add(`//${node.nodeName}[@${attribute.name}=${quoteXPathLiteral(attribute.value)}]`);
            }

            const leafChildren = Array.from(node.children)
                .filter((child) => child.children.length === 0 && child.textContent.trim())
                .slice(0, 2);

            for (const child of leafChildren) {
                contextual.add(`//${node.nodeName}/${child.nodeName}/text()`);
                contextual.add(`//${child.nodeName}[text()=${quoteXPathLiteral(child.textContent.trim())}]/../${node.nodeName}`);
            }
        } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
            const owner = node.ownerElement;
            if (owner) {
                contextual.add(`//${owner.nodeName}/@${node.name}`);
                contextual.add(`//${owner.nodeName}[@${node.name}]`);
                contextual.add(`//${owner.nodeName}[@${node.name}=${quoteXPathLiteral(node.value)}]`);
            }
        } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
            const parent = node.parentElement;
            const textValue = node.textContent.trim();
            if (parent && textValue) {
                contextual.add(`//${parent.nodeName}/text()`);
                contextual.add(`//${parent.nodeName}[text()=${quoteXPathLiteral(textValue)}]`);

                if (parent.parentElement) {
                    contextual.add(`//${parent.nodeName}[contains(text(), ${quoteXPathLiteral(textValue.slice(0, 24))})]/../${parent.parentElement.nodeName}`);
                }
            }
        }
    }

    return Array.from(contextual).filter(Boolean).slice(0, 8);
}

function generateQuickExamples(xmlDoc) {
    if (!xmlDoc?.documentElement) {
        return [];
    }

    const rootName = xmlDoc.documentElement.nodeName;
    const childElements = Array.from(xmlDoc.documentElement.children);
    const uniqueChildNames = [...new Set(childElements.map((child) => child.nodeName))];
    const examples = new Set([
        `//${rootName}`,
        `count(//${rootName})`
    ]);

    function normalizeTextValue(value) {
        return value.replace(/\s+/g, " ").trim();
    }

    function shortenForContains(value) {
        return normalizeTextValue(value).slice(0, 24);
    }

    function isUsefulTextValue(value) {
        const normalized = normalizeTextValue(value);
        return normalized.length >= 3 && /[A-Za-z]/.test(normalized);
    }

    const cdataParents = Array.from(xmlDoc.getElementsByTagName("*")).filter((element) =>
        Array.from(element.childNodes).some((child) => child.nodeType === Node.CDATA_SECTION_NODE)
    );

    if (cdataParents.length > 0) {
        const firstCdataParent = cdataParents[0];
        examples.add(`//${firstCdataParent.nodeName}/text()`);
        examples.add(`count(//${firstCdataParent.nodeName})`);

        if (firstCdataParent.parentElement) {
            examples.add(`//${firstCdataParent.parentElement.nodeName}/${firstCdataParent.nodeName}/text()`);
        }

        for (const attribute of Array.from(firstCdataParent.attributes).slice(0, 2)) {
            examples.add(`//${firstCdataParent.nodeName}[@${attribute.name}=${quoteXPathLiteral(attribute.value)}]/text()`);
        }

        const cdataParentWithAttributes = cdataParents.find((element) => element.attributes.length > 0 && element.parentElement);
        if (cdataParentWithAttributes?.parentElement) {
            const filterAttribute = cdataParentWithAttributes.attributes[0];
            examples.add(`//${cdataParentWithAttributes.parentElement.nodeName}[${cdataParentWithAttributes.nodeName}[contains(text(), ${quoteXPathLiteral(shortenForContains(cdataParentWithAttributes.textContent))})]]/@${filterAttribute.name}`);
        }
    }

    for (const attribute of Array.from(xmlDoc.documentElement.attributes)) {
        examples.add(`//${rootName}/@${attribute.name}`);
    }

    for (const childName of uniqueChildNames.slice(0, 4)) {
        examples.add(`//${childName}`);
        examples.add(`count(//${childName})`);
        examples.add(`//${childName}/text()`);
    }

    const leafWithText = xmlDoc.evaluate(
        "//*[not(*) and normalize-space(text())][1]",
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (leafWithText) {
        examples.add(`//${leafWithText.nodeName}/text()`);
    }

    const firstAttributeOwner = xmlDoc.evaluate(
        "//*[@*][1]",
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (firstAttributeOwner?.attributes?.length) {
        const firstAttribute = firstAttributeOwner.attributes[0];
        examples.add(`//${firstAttributeOwner.nodeName}[@${firstAttribute.name}]`);
        examples.add(`//${firstAttributeOwner.nodeName}/@${firstAttribute.name}`);
    }

    const repeatedGroups = new Map();

    for (const element of Array.from(xmlDoc.getElementsByTagName("*"))) {
        const key = `${xpathEngine.getNodePath(element.parentElement ?? xmlDoc.documentElement)}>${element.nodeName}`;
        if (!repeatedGroups.has(key)) {
            repeatedGroups.set(key, []);
        }
        repeatedGroups.get(key).push(element);
    }

    const repeatedCandidates = Array.from(repeatedGroups.values())
        .filter((group) => group.length >= 2 && group[0]?.children?.length >= 2)
        .sort((left, right) => right.length - left.length);

    const bestRepeated = repeatedCandidates[0];

    if (bestRepeated?.length) {
        const repeatedNodeName = bestRepeated[0].nodeName;
        const firstItem = bestRepeated[0];
        const textChildren = Array.from(firstItem.children)
            .filter((child) => child.children.length === 0 && normalizeTextValue(child.textContent));

        for (const child of textChildren.slice(0, 4)) {
            examples.add(`//${repeatedNodeName}/${child.nodeName}/text()`);
        }

        const descriptiveChildren = textChildren.filter((child) => isUsefulTextValue(child.textContent));

        if (descriptiveChildren.length >= 2) {
            const filterChild = descriptiveChildren[0];
            const targetChild = descriptiveChildren.find((child) => child.nodeName !== filterChild.nodeName) ?? descriptiveChildren[1];
            const filterValue = shortenForContains(filterChild.textContent);
            const exactValue = normalizeTextValue(filterChild.textContent);

            examples.add(`//${repeatedNodeName}[${filterChild.nodeName}[contains(text(), ${quoteXPathLiteral(filterValue)})]]/${targetChild.nodeName}/text()`);
            examples.add(`//${filterChild.nodeName}[contains(text(), ${quoteXPathLiteral(filterValue)})]/../${targetChild.nodeName}/text()`);
            examples.add(`//${filterChild.nodeName}[text()=${quoteXPathLiteral(exactValue)}]/../${targetChild.nodeName}/text()`);
        }
    }

    return Array.from(examples).slice(0, 12);
}

function renderHistory() {
    elements.historyList.textContent = "";

    if (appState.xpathHistory.length === 0) {
        const empty = document.createElement("span");
        empty.className = "muted";
        empty.textContent = "No history yet.";
        elements.historyList.appendChild(empty);
        return;
    }

    for (const entry of appState.xpathHistory) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.textContent = entry;
        button.addEventListener("click", () => {
            elements.xpathInput.value = entry;
            updateSession({ xpath: entry });
            runXPath();
        });
        elements.historyList.appendChild(button);
    }
}

function pushHistory(xpath) {
    const trimmed = xpath.trim();
    if (!trimmed) {
        return;
    }

    appState.xpathHistory = [
        trimmed,
        ...appState.xpathHistory.filter((entry) => entry !== trimmed)
    ].slice(0, DEFAULT_HISTORY_LIMIT);

    persistState();
    renderHistory();
}

function renderSuggestions() {
    const matches = suggestionsApi.filterSuggestions(appState.lastSuggestions, elements.xpathInput.value);
    elements.suggestions.textContent = "";

    if (matches.length === 0) {
        return;
    }

    for (const match of matches) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggestion";
        button.textContent = match;
        button.addEventListener("click", () => {
            elements.xpathInput.value = match;
            updateSession({ xpath: match });
            elements.suggestions.textContent = "";
            runXPath();
        });
        elements.suggestions.appendChild(button);
    }
}

function renderSummaryCards(items, scalar) {
    elements.resultSummary.textContent = "";

    const summaryItems = scalar
        ? [
            { label: "Result Type", value: scalar.type },
            { label: "Value", value: scalar.value }
        ]
        : [
            { label: "Matches", value: String(items.length) },
            { label: "Node Types", value: items.length === 0 ? "-" : Array.from(new Set(items.map((item) => item.kind))).join(", ") }
        ];

    for (const summary of summaryItems) {
        const card = document.createElement("div");
        card.className = "summary-card";

        const label = document.createElement("span");
        label.className = "summary-label";
        label.textContent = summary.label;

        const value = document.createElement("strong");
        value.textContent = summary.value;

        card.appendChild(label);
        card.appendChild(value);
        elements.resultSummary.appendChild(card);
    }
}

function renderResultDetails(items, scalar) {
    elements.resultDetails.textContent = "";
    elements.resultCount.textContent = scalar ? "1 result" : `${items.length} matches`;

    if (scalar) {
        const card = document.createElement("article");
        card.className = "result-card scalar";

        const type = document.createElement("strong");
        type.textContent = scalar.type;

        const value = document.createElement("p");
        value.textContent = scalar.value;

        card.appendChild(type);
        card.appendChild(value);
        elements.resultDetails.appendChild(card);
        return;
    }

    if (items.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "No matches for the current expression.";
        elements.resultDetails.appendChild(empty);
        return;
    }

    for (const item of items) {
        const card = document.createElement("article");
        card.className = "result-card";

        const header = document.createElement("div");
        header.className = "result-card-header";

        const kind = document.createElement("strong");
        kind.textContent = item.kind;

        const path = document.createElement("code");
        path.textContent = item.path;

        header.appendChild(kind);
        header.appendChild(path);

        const value = document.createElement("p");
        value.textContent = item.value || "(leer)";

        card.appendChild(header);
        card.appendChild(value);
        elements.resultDetails.appendChild(card);
    }
}

function clearResults(message = "No evaluation yet.") {
    appState.currentResultItems = [];
    elements.resultOutput.textContent = message;
    elements.resultSummary.textContent = "";
    elements.resultDetails.textContent = "";
    elements.resultCount.textContent = "0 matches";
    renderQuickExamples(getActiveSession().sampleId);

    if (appState.currentXmlDoc) {
        xpathEngine.renderXmlTree(elements.xmlTree, appState.currentXmlDoc, []);
    } else {
        elements.xmlTree.textContent = "No valid XML structure available.";
    }
}

function syncUiFromSession() {
    const activeSession = getActiveSession();
    elements.sessionName.value = activeSession.name;
    elements.xmlEditor.value = activeSession.xml;
    elements.xpathInput.value = activeSession.xpath;
    elements.sessionSampleSelect.value = appState.currentExampleSetId ?? "";
    renderSessionTabs();
    renderQuickExamples(activeSession.sampleId);
    refreshXmlState(false);
}

function refreshXmlState(resetResults = true) {
    const parsed = xpathEngine.parseXml(elements.xmlEditor.value);
    const activeSession = getActiveSession();

    if (!parsed.ok) {
        appState.currentXmlDoc = null;
        appState.lastSuggestions = [];
        if (!activeSession.sampleId) {
            updateSession({ quickExamples: [] });
            renderQuickExamples(null);
        }
        setStatus(elements.xmlStatus, "error", "XML Status", parsed.error);
        clearResults("XML error");
        elements.suggestions.textContent = "";
        elements.xmlTree.textContent = "No valid XML structure available.";
        return null;
    }

    appState.currentXmlDoc = parsed.xmlDoc;
    appState.lastSuggestions = suggestionsApi.buildSuggestions(parsed.xmlDoc);
    if (!activeSession.sampleId) {
        const generatedExamples = generateQuickExamples(parsed.xmlDoc);
        updateSession({ quickExamples: generatedExamples });
        renderQuickExamples(null);
    }
    setStatus(
        elements.xmlStatus,
        "success",
        "XML Status",
        `${appState.lastSuggestions.length} suggestions, root: <${parsed.xmlDoc.documentElement.nodeName}>`
    );

    if (resetResults) {
        clearResults("Ready for XPath evaluation.");
    } else {
        xpathEngine.renderXmlTree(elements.xmlTree, parsed.xmlDoc, appState.currentResultItems);
    }

    renderSuggestions();
    return parsed.xmlDoc;
}

function runXPath() {
    const xmlDoc = refreshXmlState(false);
    if (!xmlDoc) {
        setStatus(elements.xpathStatus, "error", "XPath Status", "Cannot run because of XML error.");
        return;
    }

    const xpath = elements.xpathInput.value;
    const evaluation = xpathEngine.evaluateXPath(xmlDoc, xpath);

    if (!evaluation.ok) {
        setStatus(elements.xpathStatus, "error", "XPath Status", evaluation.error);
        clearResults(`XPath error:\n${evaluation.error}`);
        xpathEngine.renderXmlTree(elements.xmlTree, xmlDoc, []);
        return;
    }

    pushHistory(xpath);
    updateSession({
        xml: elements.xmlEditor.value,
        xpath,
        name: elements.sessionName.value.trim() || getActiveSession().name
    });

    appState.currentResultItems = evaluation.items;
    renderQuickExamples(getActiveSession().sampleId);

    if (evaluation.kind === "scalar") {
        setStatus(elements.xpathStatus, "success", "XPath Status", `Scalar result: ${evaluation.scalar.type}`);
        elements.resultOutput.textContent = evaluation.rawText;
        renderSummaryCards([], evaluation.scalar);
        renderResultDetails([], evaluation.scalar);
        xpathEngine.renderXmlTree(elements.xmlTree, xmlDoc, []);
        return;
    }

    setStatus(elements.xpathStatus, "success", "XPath Status", `${evaluation.items.length} matches.`);
    elements.resultOutput.textContent = evaluation.rawText;
    renderSummaryCards(evaluation.items, null);
    renderResultDetails(evaluation.items, null);
    xpathEngine.renderXmlTree(elements.xmlTree, xmlDoc, evaluation.items);
}

function createSessionFromSelectedSample(sampleId) {
    const sample = getSampleById(sampleId);
    appState.currentExampleSetId = sample.id;
    elements.sessionSampleSelect.value = sample.id;
    const freshSession = createSessionFromSample(sample.id);
    appState.sessions.push(freshSession);
    appState.activeSessionId = freshSession.id;
    persistState();
    syncUiFromSession();
    runXPath();
}

function createEmptySession() {
    const freshSession = createSession({
        name: `Session ${appState.sessions.length + 1}`,
        xml: "",
        xpath: ""
    });

    freshSession.sampleId = null;
    freshSession.quickExamples = [];
    appState.sessions.push(freshSession);
    appState.activeSessionId = freshSession.id;
    persistState();
    syncUiFromSession();
    runXPath();
}

function wireEvents() {
    elements.xmlEditor.addEventListener("input", () => {
        updateSession({ xml: elements.xmlEditor.value });
        refreshXmlState();
    });

    elements.xpathInput.addEventListener("input", () => {
        updateSession({ xpath: elements.xpathInput.value });
        renderSuggestions();
    });

    elements.xpathInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            runXPath();
        }
    });

    elements.sessionName.addEventListener("input", () => {
        const nextName = elements.sessionName.value.trim() || "Untitled Session";
        updateSession({ name: nextName });
    });

    elements.runButton.addEventListener("click", runXPath);

    elements.clearXPathButton.addEventListener("click", () => {
        elements.xpathInput.value = "";
        updateSession({ xpath: "" });
        runXPath();
    });

    elements.importSessionFileButton.addEventListener("click", () => {
        elements.fileInput.click();
    });

    elements.fileInput.addEventListener("change", async () => {
        const [file] = Array.from(elements.fileInput.files ?? []);
        if (!file) {
            return;
        }

        const fileText = await file.text();
        const nextName = file.name.replace(/\.[^.]+$/, "") || "Import";
        const parsed = xpathEngine.parseXml(fileText);
        const importedQuickExamples = parsed.ok ? generateQuickExamples(parsed.xmlDoc) : [];
        const importedSession = createSession({
            name: nextName,
            xml: fileText,
            xpath: ""
        });
        importedSession.sampleId = null;
        importedSession.quickExamples = importedQuickExamples;

        appState.sessions.push(importedSession);
        appState.activeSessionId = importedSession.id;
        persistState();
        syncUiFromSession();
        runXPath();
        elements.fileInput.value = "";
    });

    elements.formatXmlButton.addEventListener("click", () => {
        const formatted = xpathEngine.formatXml(elements.xmlEditor.value);
        if (!formatted.ok) {
            setStatus(elements.xmlStatus, "error", "XML Status", formatted.error);
            return;
        }

        elements.xmlEditor.value = formatted.formatted;
        updateSession({ xml: formatted.formatted });
        refreshXmlState();
        runXPath();
    });

    elements.sessionSampleSelect.addEventListener("change", () => {
        if (!elements.sessionSampleSelect.value) {
            return;
        }

        appState.currentExampleSetId = elements.sessionSampleSelect.value;
    });

    elements.newSessionButton.addEventListener("click", () => {
        createSessionFromSelectedSample(appState.currentExampleSetId);
    });

    elements.newEmptySessionButton.addEventListener("click", () => {
        createEmptySession();
    });

    elements.clearHistoryButton.addEventListener("click", () => {
        appState.xpathHistory = [];
        persistState();
        renderHistory();
    });

    document.addEventListener("contextmenu", (event) => {
        if (!elements.xmlTree.contains(event.target)) {
            if (appState.treeMenuVisible) {
                hideXmlTreeMenu();
            }
            return;
        }

        const target = resolveTreeContextTarget(event);
        if (!target?.xpotNode) {
            hideXmlTreeMenu();
            return;
        }

        event.preventDefault();
        const options = buildMenuOptionsForNode(target.xpotNode, target.xpotNodeKind);
        if (options.length === 0) {
            hideXmlTreeMenu();
            return;
        }

        showXmlTreeMenu(event.clientX, event.clientY, options);
    });

    document.addEventListener("click", (event) => {
        if (!appState.treeMenuVisible) {
            return;
        }

        if (!elements.xmlTreeMenu.contains(event.target)) {
            hideXmlTreeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            hideXmlTreeMenu();
        }
    });

    window.addEventListener("scroll", hideXmlTreeMenu, true);
    window.addEventListener("resize", hideXmlTreeMenu);
}

function init() {
    disableNetworkPrimitives();
    renderSessionSampleSelect();
    loadState();
    syncUiFromSession();
    renderHistory();
    elements.sessionSampleSelect.value = appState.currentExampleSetId;
    wireEvents();
    runXPath();
}

init();
