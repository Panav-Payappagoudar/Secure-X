import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';

// Set the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

class PDFParserService {
  constructor() {
    this.maxPages = 20; // Limit pages for performance
    this.maxTextLength = 10000; // Limit text length for API calls
  }

  async parsePDF(file) {
    try {
      console.log('Starting PDF parsing for file:', file.name);
      
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = Math.min(pdf.numPages, this.maxPages);
      
      console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}, Processing: ${numPages}`);
      
      let fullText = '';
      const pageTexts = [];
      
      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Extract text items and join them
          const pageText = textContent.items
            .map(item => item.str || '')
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (pageText.length > 0) {
            pageTexts.push({
              pageNumber: i,
              text: pageText
            });
            
            fullText += pageText + '\n\n';
            
            console.log(`Page ${i}: Extracted ${pageText.length} characters`);
          }
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError.message);
        }
      }
      
      // Clean up the text
      const cleanedText = this.cleanExtractedText(fullText);
      
      console.log('PDF parsing completed:', {
        totalCharacters: cleanedText.length,
        pagesProcessed: pageTexts.length,
        textPreview: cleanedText.substring(0, 200)
      });
      
      return {
        success: true,
        fileName: file.name,
        totalPages: pdf.numPages,
        pagesProcessed: pageTexts.length,
        extractedText: cleanedText,
        pageTexts: pageTexts,
        metadata: await this.extractMetadata(pdf)
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      return {
        success: false,
        error: error.message,
        fileName: file.name
      };
    }
  }

  cleanExtractedText(text) {
    // Remove excessive whitespace and clean up text
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/
\s*
/g, '

') // Replace multiple newlines with double newline
      .trim();
  }

  async extractMetadata(pdf) {
    try {
      const metadata = await pdf.getMetadata();
      const info = metadata.info || {};
      
      return {
        title: info.Title || '',
        author: info.Author || '',
        subject: info.Subject || '',
        keywords: info.Keywords || '',
        creator: info.Creator || '',
        producer: info.Producer || '',
        creationDate: info.CreationDate ? new Date(info.CreationDate) : null,
        modificationDate: info.ModDate ? new Date(info.ModDate) : null
      };
    } catch (error) {
      console.warn('Metadata extraction failed:', error.message);
      return {};
    }
  }

  // Method to prepare file for Google Gemini's native file processing
  async prepareForGeminiNative(file) {
    try {
      console.log('Preparing file for Google Gemini native processing');
      
      // For native Gemini processing, we need to upload the file first
      // This would involve using Google's File API to upload the file
      // and then reference it in the generateContent API call
      
      // Return the file object for direct upload
      return {
        success: true,
        file: file,
        fileName: file.name,
        mimeType: file.type || 'application/pdf'
      };
    } catch (error) {
      console.error('Gemini native preparation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Method to extract text using Google Gemini's file processing capabilities
  async prepareForGemini(file) {
    try {
      console.log('Preparing file for Google Gemini processing');
      
      // For now, we'll use our PDF parser but in the future we could send the file directly
      const parseResult = await this.parsePDF(file);
      
      if (parseResult.success) {
        // Return the extracted text formatted for Gemini
        return {
          success: true,
          content: parseResult.extractedText.substring(0, this.maxTextLength),
          fileName: parseResult.fileName,
          metadata: parseResult.metadata,
          pagesProcessed: parseResult.pagesProcessed
        };
      } else {
        return parseResult; // Return the error
      }
    } catch (error) {
      console.error('Gemini preparation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PDFParserService();