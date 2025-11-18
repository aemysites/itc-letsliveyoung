/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns8)
  const headerRow = ['Columns (columns8)'];

  // Defensive: Get the main wrapper for the block content
  const section = element.querySelector('section.flavour-brand');
  if (!section) return;

  // Find the two main columns: image and text
  const wrapper = section.querySelector('.flavour-brand-wrapper');
  if (!wrapper) return;
  const columns = wrapper.children;
  if (columns.length < 2) return;

  // Left column: logo image (reference the actual element, not clone)
  const logoDiv = columns[0];
  const logoImg = logoDiv.querySelector('img');

  // Right column: title and description
  const textDiv = columns[1];
  const title = textDiv.querySelector('.flavour-brand__title-description--title');
  const desc = textDiv.querySelector('.flavour-brand__title-description--description');

  // Compose the right cell: title + description (as elements, preserving semantic structure)
  const rightCellContent = [];
  if (title) rightCellContent.push(title);
  if (desc) {
    // If description is a div with a <p>, use the <p> directly for better semantics
    const p = desc.querySelector('p');
    rightCellContent.push(p ? p : desc);
  }

  // Build the table rows
  const cells = [
    headerRow,
    [logoImg, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
