function createParserError(message) {
    return {
        ok: false,
        error: message
    };
}

function getElementIndex(node) {
    let index = 1;
    let previous = node.previousElementSibling;

    while (previous) {
        if (previous.nodeName === node.nodeName) {
            index += 1;
        }
        previous = previous.previousElementSibling;
    }

    return index;
}

function getNodePath(node) {
    if (!node) {
        return "";
    }

    if (node.nodeType === Node.DOCUMENT_NODE) {
        return "/";
    }

    if (node.nodeType === Node.ATTRIBUTE_NODE) {
        return `${getNodePath(node.ownerElement)}/@${node.name}`;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        return `${getNodePath(node.parentNode)}/text()`;
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return `${getNodePath(node.parentNode)}/text()`;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return node.nodeName;
    }

    const parentPath = node.parentNode && node.parentNode.nodeType !== Node.DOCUMENT_NODE
        ? getNodePath(node.parentNode)
        : "";

    return `${parentPath}/${node.nodeName}[${getElementIndex(node)}]`;
}

function normalizeXmlError(xmlDoc) {
    const parserError = xmlDoc.querySelector("parsererror");
    if (!parserError) {
        return null;
    }

    return parserError.textContent
        .replace(/\s+/g, " ")
        .trim();
}

function parseXml(xmlText) {
    const trimmed = xmlText.trim();
    if (!trimmed) {
        return createParserError("XML is empty.");
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(trimmed, "text/xml");
    const parserMessage = normalizeXmlError(xmlDoc);

    if (parserMessage) {
        return createParserError(parserMessage);
    }

    return {
        ok: true,
        xmlDoc
    };
}

function nodeValueForDisplay(node) {
    if (node.nodeType === Node.ATTRIBUTE_NODE) {
        return node.value;
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return node.textContent.trim();
    }

    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
    }

    return node.textContent.trim();
}

function nodeKind(node) {
    if (node.nodeType === Node.ATTRIBUTE_NODE) {
        return "Attribute";
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return "CDATA";
    }

    if (node.nodeType === Node.TEXT_NODE) {
        return "Text";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        return "Element";
    }

    return node.nodeName;
}

function collectIterator(result) {
    const nodes = [];
    let nextNode = result.iterateNext();

    while (nextNode) {
        nodes.push(nextNode);
        nextNode = result.iterateNext();
    }

    return nodes;
}

function describeScalar(result) {
    switch (result.resultType) {
    case XPathResult.STRING_TYPE:
        return {
            type: "string",
            value: result.stringValue
        };
    case XPathResult.NUMBER_TYPE:
        return {
            type: "number",
            value: String(result.numberValue)
        };
    case XPathResult.BOOLEAN_TYPE:
        return {
            type: "boolean",
            value: String(result.booleanValue)
        };
    default:
        return null;
    }
}

function evaluateXPath(xmlDoc, xpath) {
    const trimmedXPath = xpath.trim();
    if (!trimmedXPath) {
        return {
            ok: false,
            error: "XPath is empty."
        };
    }

    try {
        const result = xmlDoc.evaluate(trimmedXPath, xmlDoc, null, XPathResult.ANY_TYPE, null);
        const scalar = describeScalar(result);

        if (scalar) {
            return {
                ok: true,
                kind: "scalar",
                scalar,
                items: [],
                rawText: scalar.value
            };
        }

        const nodes = collectIterator(result);
        const items = nodes.map((node) => ({
            node,
            kind: nodeKind(node),
            path: getNodePath(node),
            value: nodeValueForDisplay(node)
        }));

        return {
            ok: true,
            kind: "nodes",
            items,
            rawText: items.length === 0
                ? "No matches"
                : items.map((item) => item.value || item.path).join("\n")
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

function formatNode(node, depth) {
    const indent = "  ".repeat(depth);

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        const text = node.textContent.trim();
        return text ? `${indent}<![CDATA[\n${text}\n${indent}]]>\n` : "";
    }

    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        return text ? `${indent}${text}\n` : "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    const attributes = Array.from(node.attributes)
        .map((attribute) => `${attribute.name}="${attribute.value}"`)
        .join(" ");

    const opening = attributes
        ? `${indent}<${node.nodeName} ${attributes}>`
        : `${indent}<${node.nodeName}>`;

    const meaningfulChildren = Array.from(node.childNodes).filter((child) => {
        return child.nodeType === Node.ELEMENT_NODE || child.textContent.trim();
    });

    if (meaningfulChildren.length === 0) {
        return `${opening}</${node.nodeName}>\n`;
    }

    if (meaningfulChildren.length === 1 && meaningfulChildren[0].nodeType === Node.TEXT_NODE) {
        return `${opening}${meaningfulChildren[0].textContent.trim()}</${node.nodeName}>\n`;
    }

    const childrenText = meaningfulChildren
        .map((child) => formatNode(child, depth + 1))
        .join("");

    return `${opening}\n${childrenText}${indent}</${node.nodeName}>\n`;
}

function formatXml(xmlText) {
    const parsed = parseXml(xmlText);
    if (!parsed.ok) {
        return parsed;
    }

    const formatted = formatNode(parsed.xmlDoc.documentElement, 0).trim();

    return {
        ok: true,
        formatted
    };
}

function buildHighlightState(resultItems) {
    const exactNodes = new WeakSet();
    const exactAttributes = new WeakSet();
    const exactTexts = new WeakSet();
    const contextElements = new WeakSet();

    for (const item of resultItems) {
        const { node } = item;

        if (node.nodeType === Node.ATTRIBUTE_NODE) {
            exactAttributes.add(node);
            if (node.ownerElement) {
                contextElements.add(node.ownerElement);
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            exactTexts.add(node);
            if (node.parentElement) {
                contextElements.add(node.parentElement);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            exactNodes.add(node);
            contextElements.add(node);
        }

        let current = node.parentElement ?? node.ownerElement ?? null;
        while (current) {
            contextElements.add(current);
            current = current.parentElement;
        }
    }

    return {
        exactNodes,
        exactAttributes,
        exactTexts,
        contextElements
    };
}

function appendTextNode(container, className, text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    container.appendChild(span);
}

function renderElementLine(node, state) {
    const line = document.createElement("div");
    line.className = "tree-line";
    line.xpotNode = node;
    line.xpotNodeKind = "element";

    if (state.exactNodes.has(node)) {
        line.classList.add("exact");
    } else if (state.contextElements.has(node)) {
        line.classList.add("context");
    }

    appendTextNode(line, "tree-punct", `<${node.nodeName}`);

    for (const attribute of Array.from(node.attributes)) {
        appendTextNode(line, "tree-space", " ");

        const attributeClass = state.exactAttributes.has(attribute)
            ? "tree-attr exact-inline"
            : "tree-attr";

        const attributeSpan = document.createElement("span");
        attributeSpan.className = attributeClass;
        attributeSpan.textContent = `${attribute.name}="${attribute.value}"`;
        attributeSpan.xpotNode = attribute;
        attributeSpan.xpotNodeKind = "attribute";
        line.appendChild(attributeSpan);
    }

    appendTextNode(line, "tree-punct", ">");
    return line;
}

function renderTextLine(node, state) {
    const text = node.textContent.trim();
    if (!text) {
        return null;
    }

    const line = document.createElement("div");
    line.className = node.nodeType === Node.CDATA_SECTION_NODE
        ? "tree-line tree-text tree-cdata"
        : "tree-line tree-text";
    line.xpotNode = node;
    line.xpotNodeKind = node.nodeType === Node.CDATA_SECTION_NODE ? "cdata" : "text";

    if (state.exactTexts.has(node)) {
        line.classList.add("exact");
    } else if (state.contextElements.has(node.parentElement)) {
        line.classList.add("context");
    }

    line.textContent = node.nodeType === Node.CDATA_SECTION_NODE
        ? `<![CDATA[ ${text.slice(0, 220)}${text.length > 220 ? " ..." : ""} ]]>`
        : text;
    return line;
}

function renderTreeNode(node, state) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "tree-node";

    wrapper.appendChild(renderElementLine(node, state));

    const children = Array.from(node.childNodes).filter((child) => {
        return child.nodeType === Node.ELEMENT_NODE
            || child.nodeType === Node.TEXT_NODE
            || child.nodeType === Node.CDATA_SECTION_NODE
            ? child.textContent.trim()
            : false;
    });

    if (children.length > 0) {
        const childrenContainer = document.createElement("div");
        childrenContainer.className = "tree-children";

        for (const child of children) {
            if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
                const renderedText = renderTextLine(child, state);
                if (renderedText) {
                    childrenContainer.appendChild(renderedText);
                }
                continue;
            }

            const renderedChild = renderTreeNode(child, state);
            if (renderedChild) {
                childrenContainer.appendChild(renderedChild);
            }
        }

        wrapper.appendChild(childrenContainer);
    }

    const closing = document.createElement("div");
    closing.className = "tree-line tree-closing";
    closing.textContent = `</${node.nodeName}>`;
    closing.xpotNode = node;
    closing.xpotNodeKind = "element";

    if (state.exactNodes.has(node)) {
        closing.classList.add("exact");
    } else if (state.contextElements.has(node)) {
        closing.classList.add("context");
    }

    wrapper.appendChild(closing);
    return wrapper;
}

function renderXmlTree(container, xmlDoc, resultItems = []) {
    container.textContent = "";

    if (!xmlDoc?.documentElement) {
        container.textContent = "No valid XML structure available.";
        return;
    }

    const highlightState = buildHighlightState(resultItems);
    const renderedTree = renderTreeNode(xmlDoc.documentElement, highlightState);

    if (renderedTree) {
        container.appendChild(renderedTree);
    }
}

window.XpotXPathEngine = {
    getNodePath,
    parseXml,
    evaluateXPath,
    formatXml,
    renderXmlTree
};
