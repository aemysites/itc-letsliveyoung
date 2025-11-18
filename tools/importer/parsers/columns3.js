/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row - always one column for block name
  const headerRow = ['Columns (columns3)'];

  // Defensive selectors for left (media) and right (details) columns
  const children = element.querySelectorAll(':scope > div');
  let mediaDiv = null;
  let detailsDiv = null;
  if (children.length === 2) {
    mediaDiv = children[0];
    detailsDiv = children[1];
  } else {
    mediaDiv = element.querySelector('.product-details-card__media');
    detailsDiv = element.querySelector('.product-details-card__details');
  }

  // Left column: media (all visual elements, including images and possible icons)
  let mediaContent = [];
  if (mediaDiv) {
    // Include all images and any direct children (to catch icons, etc)
    mediaContent = Array.from(mediaDiv.querySelectorAll('img, svg, [class*="icon"], [class*="Icon"]'));
    // If no images/icons, fallback to all children
    if (!mediaContent.length) {
      mediaContent = Array.from(mediaDiv.children);
    }
    // If still empty, fallback to the whole div
    if (!mediaContent.length) {
      mediaContent = [mediaDiv];
    }
  }

  // Right column: details (title + description)
  let detailsContent = [];
  if (detailsDiv) {
    const title = detailsDiv.querySelector('.product-details-card__details--title');
    const desc = detailsDiv.querySelector('.product-details-card__details--description');
    if (title) detailsContent.push(title);
    if (desc) detailsContent.push(desc);
    if (!detailsContent.length) detailsContent = [detailsDiv];
  }

  // Build the table rows
  const rows = [
    headerRow,
    [mediaContent, detailsContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
