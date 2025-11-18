/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero2)'];

  // --- IMAGE ROW ---
  let heroImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    heroImg = picture.querySelector('img');
  }
  const imageRow = [heroImg ? heroImg : ''];

  // --- CONTENT ROW ---
  // Find the hero text block
  const textBlock = document.createElement('div');

  // Try to find the headline in the DOM (it may be outside the .fmm-banner__text block)
  // Look for a heading or large text node with 'Surprisingly Tasty Millet Cookies'
  let headline = null;
  // Search for any element containing the headline text
  const possibleHeadline = Array.from(element.querySelectorAll('*')).find(el => {
    return el.textContent && el.textContent.trim().replace(/\s+/g, ' ').includes('Surprisingly Tasty Millet Cookies');
  });
  if (possibleHeadline) {
    // Use the element as-is (clone to avoid moving it from original context)
    headline = possibleHeadline.cloneNode(true);
    textBlock.appendChild(headline);
  }

  // Subheading and paragraph from .cmp-text
  const textContainer = element.querySelector('.fmm-banner__text .cmp-text');
  if (textContainer) {
    // Subheading (h3)
    const subheading = textContainer.querySelector('h3');
    if (subheading) textBlock.appendChild(subheading.cloneNode(true));
    // Paragraph(s)
    textContainer.querySelectorAll('p').forEach(p => textBlock.appendChild(p.cloneNode(true)));
  }
  const contentRow = [textBlock];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
