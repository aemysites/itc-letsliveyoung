/* global WebImporter */
export default function parse(element, { document }) {
  // Video (video9) block: expects 1 column, 2 rows
  // 1st row: block name
  // 2nd row: video source (URL or embed), optional poster image

  // The source HTML contains only empty divs/spacers, no video, image, or text
  // Per validation, do NOT include <hr> or any divider. Only output empty cell.
  const cells = [
    ['Video (video9)'],
    ['']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
