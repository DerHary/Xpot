function quoteXPathValue(value) {
    if (!value.includes("'")) {
        return `'${value}'`;
    }

    if (!value.includes('"')) {
        return `"${value}"`;
    }

    return `'${value.replace(/'/g, "")}'`;
}

function buildSuggestions(xmlDoc) {
    const suggestions = new Set();

    function walk(node, path) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        const currentPath = `${path}/${node.nodeName}`;

        suggestions.add(`//${node.nodeName}`);
        suggestions.add(currentPath);
        suggestions.add(`${currentPath}/text()`);

        for (const attribute of Array.from(node.attributes)) {
            const quotedValue = quoteXPathValue(attribute.value);
            suggestions.add(`${currentPath}/@${attribute.name}`);
            suggestions.add(`//${node.nodeName}/@${attribute.name}`);
            suggestions.add(`//${node.nodeName}[@${attribute.name}=${quotedValue}]`);
        }

        for (const child of Array.from(node.children)) {
            suggestions.add(`${currentPath}/${child.nodeName}`);
            suggestions.add(`//${node.nodeName}/${child.nodeName}`);

            const childText = child.children.length === 0
                ? child.textContent.trim()
                : "";

            if (childText) {
                const quotedValue = quoteXPathValue(childText);
                suggestions.add(`${currentPath}/${child.nodeName}/text()`);
                suggestions.add(`//${node.nodeName}[${child.nodeName}=${quotedValue}]`);
                suggestions.add(`//${child.nodeName}[text()=${quotedValue}]`);
                suggestions.add(`//${child.nodeName}[contains(text(), ${quotedValue})]`);
            }

            walk(child, currentPath);
        }
    }

    walk(xmlDoc.documentElement, "");

    return Array.from(suggestions).sort((left, right) => {
        if (left.length !== right.length) {
            return left.length - right.length;
        }

        return left.localeCompare(right);
    });
}

function scoreSuggestion(suggestion, query) {
    const normalizedSuggestion = suggestion.toLowerCase();

    if (normalizedSuggestion === query) {
        return 0;
    }

    if (normalizedSuggestion.startsWith(query)) {
        return 1;
    }

    const lastToken = query.split("/").filter(Boolean).at(-1) ?? query;
    if (lastToken && normalizedSuggestion.includes(lastToken)) {
        return 2;
    }

    return 3;
}

function filterSuggestions(suggestions, rawQuery, limit = 12) {
    const query = rawQuery.toLowerCase().trim();

    if (!query) {
        return [];
    }

    return suggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(query))
        .sort((left, right) => {
            const scoreDiff = scoreSuggestion(left, query) - scoreSuggestion(right, query);
            if (scoreDiff !== 0) {
                return scoreDiff;
            }

            return left.localeCompare(right);
        })
        .slice(0, limit);
}

window.XpotSuggestions = {
    buildSuggestions,
    filterSuggestions
};
