// Document Processor Service
// Handles the offline ingestion pipeline for processing documents and preparing them for RAG

import ragService from './ragService.js';
import universalFileReader from './universalFileReader.js';
import pdfParserService from './pdfParserService.js';

class DocumentProcessor {
  constructor() {
    this.supportedProcessors = {
      'pdf': pdfParserService,
      'doc': this.processWordDocument.bind(this),
      'docx': this.processWordDocument.bind(this),
      'txt': this.processTextDocument.bind(this),
      'md': this.processTextDocument.bind(this),
      'csv': this.processCsvDocument.bind(this),
      'json': this.processJsonDocument.bind(this)
    };
  }

  /**
   * Process a document through the ingestion pipeline
   */
  async processDocument(file, documentId) {
    try {
      console.log(`[DocumentProcessor] Processing document: ${file.name}`);
      
      // 1. Detect file type
      const fileType = universalFileReader.detectFileType(file.name);
      console.log(`[DocumentProcessor] Detected file type: ${fileType.category}.${fileType.extension}`);
      
      // 2. Extract content based on file type
      const content = await this.extractContent(file, fileType);
      
      // 3. Process through RAG service
      const result = await ragService.processDocument(
        documentId, 
        file.name, 
        content
      );
      
      return result;
    } catch (error) {
      console.error('[DocumentProcessor] Error processing document:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  /**
   * Extract content based on file type
   */
  async extractContent(file, fileType) {
    const { category, extension } = fileType;
    
    // Use specialized processor if available
    if (this.supportedProcessors[extension]) {
      console.log(`[DocumentProcessor] Using specialized processor for ${extension}`);
      return await this.supportedProcessors[extension](file);
    }
    
    // Fall back to universal file reader
    console.log(`[DocumentProcessor] Using universal file reader for ${extension}`);
    const result = await universalFileReader.readFile(file);
    
    if (result.success) {
      return result.readableText || result.content || '';
    } else {
      throw new Error(`Failed to read file: ${result.error}`);
    }
  }

  /**
   * Process PDF documents using specialized parser
   */
  async processPdfDocument(file) {
    try {
      const result = await pdfParserService.parsePDF(file);
      
      if (result.success) {
        return result.extractedText;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('[DocumentProcessor] PDF processing error:', error);
      throw error;
    }
  }

  /**
   * Process Word documents (placeholder)
   */
  async processWordDocument(file) {
    // In production, use mammoth.js or similar library
    console.log('[DocumentProcessor] Processing Word document (placeholder)');
    return `Word document content from ${file.name}`;
  }

  /**
   * Process text documents
   */
  async processTextDocument(file) {
    // Handle both browser and Node.js environments
    if (typeof FileReader !== 'undefined') {
      // Browser environment
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      });
    } else {
      // Node.js environment
      if (file.text) {
        return file.text();
      } else if (file.arrayBuffer) {
        const buffer = await file.arrayBuffer();
        return Buffer.from(buffer).toString('utf-8');
      } else {
        throw new Error('Cannot read text file in Node.js environment');
      }
    }
  }

  /**
   * Process CSV documents (placeholder)
   */
  async processCsvDocument(file) {
    // In production, use csv-parser or similar library
    console.log('[DocumentProcessor] Processing CSV document (placeholder)');
    return `CSV content from ${file.name}`;
  }

  /**
   * Process JSON documents
   */
  async processJsonDocument(file) {
    const text = await this.processTextDocument(file);
    try {
      const json = JSON.parse(await text);
      return JSON.stringify(json, null, 2);
    } catch (error) {
      console.warn('[DocumentProcessor] Invalid JSON, returning raw text');
      return await text;
    }
  }

  /**
   * Get processing statistics
   */
  getStats() {
    return ragService.getStats();
  }

  /**
   * Clear all processed data (for testing)
   */
  clearData() {
    ragService.clearData();
  }
}

// Export singleton instance
export default new DocumentProcessor();