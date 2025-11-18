/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children divs
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find media and details columns
  let mediaDiv = null;
  let detailsDiv = null;
  children.forEach((div) => {
    if (div.classList.contains('product-details-card__media')) mediaDiv = div;
    if (div.classList.contains('product-details-card__details')) detailsDiv = div;
  });

  // Defensive fallback: if not found, try first/second child
  if (!mediaDiv && children.length > 0) mediaDiv = children[0];
  if (!detailsDiv && children.length > 1) detailsDiv = children[1];

  // Details column: grab title and description
  let detailsContent = [];
  if (detailsDiv) {
    const title = detailsDiv.querySelector('.product-details-card__details--title');
    if (title) detailsContent.push(title);
    const desc = detailsDiv.querySelector('.product-details-card__details--description');
    if (desc) detailsContent.push(desc);
  }

  // Media column: grab image
  let mediaContent = [];
  if (mediaDiv) {
    const img = mediaDiv.querySelector('img');
    if (img) mediaContent.push(img);
  }

  // Table structure
  const headerRow = ['Columns (columns4)'];
  const columnsRow = [detailsContent, mediaContent];

  const cells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
