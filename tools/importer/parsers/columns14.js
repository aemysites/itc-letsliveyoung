/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns14)'];

  // Defensive: get immediate children divs for left/right columns
  const columns = element.querySelectorAll(':scope > div');
  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    // Fallback: try to find by class names
    leftCol = element.querySelector('.product-details-card__media');
    rightCol = element.querySelector('.product-details-card__details');
  }

  // Left column: image/media
  let leftContent = null;
  if (leftCol) {
    // Find the main image (do not create new img, use existing)
    const img = leftCol.querySelector('img');
    if (img) {
      leftContent = img;
    } else {
      // If no image, use the whole leftCol
      leftContent = leftCol;
    }
  }

  // Right column: title + description
  let rightContent = [];
  if (rightCol) {
    // Title
    const title = rightCol.querySelector('.product-details-card__details--title');
    if (title) rightContent.push(title);
    // Description (may be a div or p)
    const desc = rightCol.querySelector('.product-details-card__details--description');
    if (desc) {
      // If description contains a <p>, use the <p>
      const p = desc.querySelector('p');
      rightContent.push(p ? p : desc);
    }
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
