import CONFIG from '../CONFIG.js';
import createCustomElement from './createCustomElement.js';
import isNonEmptyString from '../lang/isNonEmptyString.js';
import stringToClassname from '../lang/stringToClassname.js';

/**
 * Converts tables that have a single `th` element with text content inside
 * to a namespaced `div` wrapper that acts like a pseudo-component
 */
export default function convertTables() {
    const tables = document.querySelectorAll(`${CONFIG.SELECTORS.MAIN} table`);

    tables.forEach((table) => {
        // Remove all empty `th` elements.
        // Sometimes, even if the table head is authored to have a single column,
        // the resulting HTML still shows multiple columns, but only one with text
        const emptyTableHeadings = table.querySelectorAll('thead th:empty');

        emptyTableHeadings.forEach((emptyTableHeading) => {
            emptyTableHeading.remove();
        });

        // Initialize table conversion only if there is just one populated `th` element
        const tableHeading = table.querySelector('thead th:only-child');

        if (tableHeading instanceof HTMLElement) {
            // Get the `th` text; using `textContent` and not `innerText`,
            // since the latter triggers a reflow
            const sectionName = tableHeading.textContent;

            if (isNonEmptyString(sectionName)) {
                // Turn the `th` string into a valid HTML class name
                const sectionIdentifier = stringToClassname(sectionName);

                // Add a starting performance marker
                const startMarkerName = `start-tableConversion--${sectionIdentifier}`;
                window.performance.mark(startMarkerName);

                // Create a specific class name for the component
                const sectionClass = `${CONFIG.SELECTORS.NAMESPACE}--${sectionIdentifier}`;
                // Create a placeholder element
                // where all the transformed table markup will be added
                const sectionMarkup = createCustomElement('div', {
                    class: sectionClass,
                });

                // Identify all the rows of the table
                const tableRows = table.querySelectorAll('tbody tr');

                tableRows.forEach((tableRow) => {
                    // For each row, create a `div` element
                    const sectionRow = createCustomElement('div', {
                        class: `${sectionClass}-row`,
                    });

                    // Identify all the columns of the row
                    const rowColumns = tableRow.querySelectorAll('td');

                    rowColumns.forEach((rowColumn) => {
                        // Get the column's content
                        const sectionEntryContent = rowColumn.innerHTML;

                        if (isNonEmptyString(sectionEntryContent)) {
                            // For each column that has content, create a `div` element
                            const sectionEntry = createCustomElement('div', {
                                class: `${sectionClass}-entry`,
                            });

                            // Append the column content to the previously created `div` element
                            sectionEntry.innerHTML = rowColumn.innerHTML;
                            // Append the transformed column to its row
                            sectionRow.appendChild(sectionEntry);
                        }
                    });

                    // If the row has been populated with at least one element,
                    // coming from inner-columns, append the transformed row to the section `div`
                    if (sectionRow.hasChildNodes()) {
                        sectionMarkup.appendChild(sectionRow);
                    }
                });

                // If the section has been populated with at least one element,
                // replace the original table with the transformed markup
                if (sectionMarkup.hasChildNodes()) {
                    // Replace the table with the transformed markup
                    // (we can be sure the table's parent exists based on the initial selector)
                    table.parentNode.replaceChild(sectionMarkup, table);
                }

                // Measure the time, in ms, required for the table transformation
                window.performance.measure(`tableConversionTime--${sectionIdentifier}`, startMarkerName);
            }
        }
    });
}
