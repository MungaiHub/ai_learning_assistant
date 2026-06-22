/**
 * Split textvinto chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number }>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    //clean text while preserving paragraphs strucuture
    const cleanedText = text
        .replace(/\r\n/g, '\n') 
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

        //try to splitnby paragraphs  (single or double new lines)
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;
   
    for (const paragraph of paragraphs) {
        const paragraphsWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphsWords;

        //if a single paragraph exceeds chunk size, split it by words
        if (paragraphWordCount.length > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // split the large paragraph into word-based chunks
            for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                if (i + chunkSize >= paragraphWords.length) break; // stop if we've reached the end of the paragraph
            }
            continue; // move to the next paragraph
        }

        //if adding this paragraph exceeds chunk size, save the current chunk
        if (currentWordCount + paragraphWordCount.length > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
           
            //create overlap from previous chunk
            const prevChunkText = currentChunk.join(' ');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount.length;
        }
        else {
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount.length;
        }
    }

    // Add the last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex,
            pageNumber: 0
        });
    }
    //Fallback if no chunks created, split by words
    if (chunks.length === 0 && cleanedText.length > 0 ) {
       const allWords = cleanedText.split(/\s+/);
       for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
           const chunkWords = allWords.slice(i, i + chunkSize);
           chunks.push({
               content: chunkWords.join(' '),
               chunkIndex: chunkIndex++,
               pageNumber: 0
           });
           if (i + chunkSize >= allWords.length) break; // stop if we've reached the end of the text
       }
    }
    return chunks;

};
