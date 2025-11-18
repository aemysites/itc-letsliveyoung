/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main section containing hero content
  const section = element.querySelector('section.fmm-banner');
  if (!section) return;

  // Extract image (prefer <picture>, fallback to <img>)
  let heroImage = section.querySelector('picture');
  if (!heroImage) heroImage = section.querySelector('img');

  // Extract all text content from the section (including alt text, visible headings, and any overlay text)
  let headingText = '';
  const mainImg = section.querySelector('img');
  if (mainImg && mainImg.alt && mainImg.alt.trim()) {
    headingText = mainImg.alt.trim();
  }

  // Extract breadcrumbs from anywhere in the document (less specific selector)
  let breadcrumbsText = '';
  const allLinks = document.querySelectorAll('a');
  if (allLinks.length > 1) {
    // Find the first sequence of links that look like breadcrumbs (top of page)
    const breadcrumbCandidates = Array.from(allLinks).filter(a => {
      const txt = a.textContent.trim();
      return txt && txt.length < 50;
    });
    if (breadcrumbCandidates.length > 1) {
      breadcrumbsText = breadcrumbCandidates.slice(0, 3).map(a => a.textContent.trim()).join(' > ');
    }
  }

  // Extract bottom left label (BISCUITS Crisply Visualisation)
  let bottomLabelText = '';
  const labelCandidates = Array.from(document.querySelectorAll('div, span, p')).filter(el => {
    return /biscuits/i.test(el.textContent) && /crisply/i.test(el.textContent);
  });
  if (labelCandidates.length) {
    bottomLabelText = labelCandidates[0].textContent.trim();
  }

  // Extract any visible product highlights (e.g. 'No Maida & Source of Fibre')
  let highlightText = '';
  const highlightCandidates = Array.from(document.querySelectorAll('div, span, p')).filter(el => {
    return /maida|fibre/i.test(el.textContent);
  });
  if (highlightCandidates.length) {
    highlightText = highlightCandidates[0].textContent.trim();
  }

  // Compose the text cell (include all found text)
  const textCellContent = [];
  if (breadcrumbsText) {
    const breadcrumbs = document.createElement('p');
    breadcrumbs.textContent = breadcrumbsText;
    textCellContent.push(breadcrumbs);
  }
  if (headingText) {
    const h1 = document.createElement('h1');
    h1.textContent = headingText;
    textCellContent.push(h1);
  }
  if (highlightText) {
    const highlight = document.createElement('p');
    highlight.textContent = highlightText;
    textCellContent.push(highlight);
  }
  if (bottomLabelText) {
    const label = document.createElement('p');
    label.textContent = bottomLabelText;
    textCellContent.push(label);
  }
  // If no text found, add empty string to cell
  if (textCellContent.length === 0) {
    textCellContent.push('');
  }

  // Build table rows
  const headerRow = ['Hero (hero1)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [textCellContent];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
