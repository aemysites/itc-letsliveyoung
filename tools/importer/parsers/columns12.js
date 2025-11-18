/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper wrapper containing the video cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all slides (columns)
  const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
  if (!slides.length) return;

  // Extract each video card as a column cell
  const columns = slides.map((slide) => {
    const card = slide.querySelector('.video-card');
    if (!card) return document.createElement('div');

    // Compose cell content: include all visible content from card
    const cellContent = [];

    // Include all visible children of .video-card__content
    const content = card.querySelector('.video-card__content');
    if (content) {
      // Clone all children (video, overlays, etc.)
      Array.from(content.children).forEach(child => {
        cellContent.push(child.cloneNode(true));
      });
    }

    // If there is a title, include it (even if empty)
    const title = card.querySelector('.video-card__title');
    if (title) {
      // If title has text, use <p>, else include as is
      if (title.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = title.textContent.trim();
        cellContent.push(p);
      } else {
        cellContent.push(title.cloneNode(true));
      }
    }

    // Compose cell
    const wrapper = document.createElement('div');
    cellContent.forEach((el) => wrapper.appendChild(el));
    return wrapper;
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns12)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
