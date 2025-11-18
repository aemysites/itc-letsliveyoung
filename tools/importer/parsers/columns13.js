/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children of a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(selector)).filter(el => el.parentElement === parent);
  }

  // Find the main section
  const section = element.querySelector('section.available-now');
  if (!section) return;

  // Left column: Titles
  const titles = section.querySelector('.available-now__titles');
  const leftColumn = document.createElement('div');
  if (titles) {
    const title = titles.querySelector('.available-now__titles--title');
    const subtitle = titles.querySelector('.available-now__titles--sub-title');
    if (title) leftColumn.appendChild(title);
    if (subtitle) leftColumn.appendChild(subtitle);
  }

  // Right column: Store links and note
  const stores = section.querySelector('.available-now__stores');
  const rightColumn = document.createElement('div');
  if (stores) {
    const linksContainer = stores.querySelector('.available-now__stores--links');
    if (linksContainer) {
      // Reference each anchor (with image inside)
      getDirectChildren(linksContainer, 'a').forEach(a => {
        rightColumn.appendChild(a);
      });
    }
    const note = stores.querySelector('.available-now__stores--note');
    if (note) {
      rightColumn.appendChild(note);
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns13)'];
  const contentRow = [leftColumn, rightColumn];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
