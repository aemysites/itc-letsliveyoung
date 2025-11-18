/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row (single cell, but should span two columns)
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Defensive: Find the accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) {
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title: find the button and its title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    } else {
      const h3 = item.querySelector('h3');
      title = h3 ? h3.textContent.trim() : '';
    }
    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        contentCell = textBlock;
      } else {
        const panelChildren = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        if (panelChildren.length > 0) {
          contentCell = panelChildren;
        } else {
          contentCell = panel.textContent.trim();
        }
      }
    }
    rows.push([title, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix the header row to span two columns
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1) {
    headerTr.children[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
