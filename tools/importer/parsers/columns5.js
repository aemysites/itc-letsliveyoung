/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns5)'];

  // Defensive: Find the section containing the content
  const section = element.querySelector('section.available-now');
  if (!section) return;

  // Left column: Titles
  const titles = section.querySelector('.available-now__titles');

  // Right column: Store links and note
  const stores = section.querySelector('.available-now__stores');

  // Defensive: If either column is missing, fallback to entire section in one cell
  if (!titles || !stores) {
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      [section.cloneNode(true)]
    ], document);
    element.replaceWith(block);
    return;
  }

  // --- Left Column: Heading and Subheading ---
  // We'll use the entire titles div for resilience
  
  // --- Right Column: Store links and note ---
  // We'll use the entire stores div for resilience

  // Second row: two columns
  const row = [titles, stores];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
