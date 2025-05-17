export function calculateTextYOffset(text, containerHeight = 500, lineHeight = 20) {
  const wordCount = text.split(" ").length;
  const wordsPerLine = 7; 
  const maxWordsLastLine = 10; 

  let yOffset = 20; 

  if (wordCount > 10) {
    const linesNeeded = Math.ceil(wordCount / wordsPerLine);  

    if (wordCount % wordsPerLine !== 0 || wordCount % maxWordsLastLine !== 0) {
      yOffset = (linesNeeded + 1) * lineHeight;
    } else {
      yOffset = linesNeeded * lineHeight;
    }

    if (yOffset > containerHeight) {
      yOffset = containerHeight;
    }
  }

  return yOffset;
}
