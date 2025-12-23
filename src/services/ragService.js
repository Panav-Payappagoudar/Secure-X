// Retrieval-Augmented Generation (RAG) Service
// Implements both offline ingestion and online inference pipelines

class RAGService {
  constructor() {
    // Simulated vector database
    this.vectorStore = new Map();
    this.documents = new Map();
    this.documentChunks = [];
    
    // Configuration
    this.chunkSize = 800; // Tokens
    this.chunkOverlap = 100; // Tokens
    this.topK = 5; // Number of chunks to retrieve
    
    // Initialize with sample data if empty
    this.initializeSampleData();
  }

  // Initialize with some sample data for demonstration
  initializeSampleData() {
    // This would be populated through the ingestion pipeline in a real implementation
    if (this.vectorStore.size === 0) {
      console.log("Initializing RAG service with sample data");
    }
  }

  /**
   * OFFLINE INGESTION PIPELINE
   * Process documents and store them in vector database
   */

  // Process a document through the ingestion pipeline
  async processDocument(documentId, fileName, content) {
    try {
      console.log(`[RAG] Processing document: ${fileName}`);
      
      // 1. Document Processing - Extract text from various formats
      const processedContent = await this.extractTextContent(content, fileName);
      
      // 2. Intelligent Chunking - Split document into semantic chunks
      const chunks = this.semanticChunking(processedContent, fileName);
      
      // 3. Embedding Generation - Convert chunks to vectors
      const embeddedChunks = await this.generateEmbeddings(chunks, documentId);
      
      // 4. Vector Storage - Store in vector database
      this.storeVectors(embeddedChunks, documentId, fileName);
      
      console.log(`[RAG] Successfully processed document with ${chunks.length} chunks`);
      
      return {
        success: true,
        documentId,
        chunks: chunks.length,
        fileName
      };
    } catch (error) {
      console.error("[RAG] Document processing error:", error);
      return {
        success: false,
        error: error.message,
        documentId,
        fileName
      };
    }
  }

  // Extract text content from various file formats
  async extractTextContent(content, fileName) {
    // In a real implementation, this would use libraries like:
    // - pdf-parse for PDFs
    // - mammoth for DOCX
    // - csv-parser for CSV
    // - Custom parsers for other formats
    
    // For now, we'll assume content is already extracted
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle different content types
    if (content && typeof content === 'object') {
      if (content.extractedText) {
        return content.extractedText;
      }
      if (content.readableText) {
        return content.readableText;
      }
      return JSON.stringify(content);
    }
    
    return String(content || '');
  }

  // Intelligent semantic chunking based on document structure
  semanticChunking(text, fileName) {
    console.log("[RAG] Performing semantic chunking");
    
    // Simple sentence-based chunking for demonstration
    // In production, use libraries like:
    // - LangChain's RecursiveCharacterTextSplitter
    // - Semantic Text Splitter
    
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = "";
    let currentTokens = 0;
    
    for (const sentence of sentences) {
      const sentenceTokens = sentence.split(/\s+/).length;
      
      // If adding this sentence would exceed chunk size, save current chunk
      if (currentTokens + sentenceTokens > this.chunkSize && currentChunk.length > 0) {
        chunks.push({
          text: currentChunk.trim(),
          fileName,
          tokens: currentTokens,
          chunkIndex: chunks.length
        });
        
        // Start new chunk with overlap
        const overlapWords = currentChunk.split(/\s+/).slice(-this.chunkOverlap).join(' ');
        currentChunk = overlapWords + ' ' + sentence;
        currentTokens = overlapWords.split(/\s+/).length + sentenceTokens;
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + sentence;
        currentTokens += sentenceTokens;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.trim().length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        fileName,
        tokens: currentTokens,
        chunkIndex: chunks.length
      });
    }
    
    console.log(`[RAG] Created ${chunks.length} semantic chunks`);
    return chunks;
  }

  // Generate embeddings for text chunks (simulated)
  async generateEmbeddings(chunks, documentId) {
    console.log("[RAG] Generating embeddings for chunks");
    
    // In production, use:
    // - OpenAI embeddings API
    // - Hugging Face sentence-transformers
    // - Local models like BGE-M3
    
    // Simulate embedding generation
    return chunks.map((chunk, index) => ({
      ...chunk,
      documentId,
      chunkId: `${documentId}_chunk_${index}`,
      // Simulated vector (in reality would be 1536+ dimensional)
      vector: this.simulateEmbedding(chunk.text),
      timestamp: Date.now()
    }));
  }

  // Simulate embedding generation
  simulateEmbedding(text) {
    // Simple hash-based simulation for demonstration
    // In reality, this would be a high-dimensional vector from an embedding model
    const hash = this.simpleHash(text);
    const vector = [];
    
    // Generate a pseudo-random vector based on hash
    for (let i = 0; i < 128; i++) {
      const charCode = text.charCodeAt(i % text.length) || 0;
      vector.push(((hash + i * charCode) % 1000) / 1000 - 0.5);
    }
    
    return vector;
  }

  // Simple hash function for simulation
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Store vectors in simulated vector database
  storeVectors(embeddedChunks, documentId, fileName) {
    console.log("[RAG] Storing vectors in database");
    
    // Store document metadata
    this.documents.set(documentId, {
      id: documentId,
      fileName,
      chunkCount: embeddedChunks.length,
      createdAt: Date.now()
    });
    
    // Store chunks with vectors
    for (const chunk of embeddedChunks) {
      this.vectorStore.set(chunk.chunkId, chunk);
      this.documentChunks.push(chunk);
    }
    
    console.log(`[RAG] Stored ${embeddedChunks.length} chunks for document ${documentId}`);
  }

  /**
   * ONLINE INFERENCE PIPELINE
   * Handle user queries with retrieval capabilities
   */

  // Process user query through RAG pipeline
  async processQuery(query, contextDocuments = []) {
    try {
      console.log(`[RAG] Processing query: ${query}`);
      
      // 1. Query Encoding - Convert query to vector
      const queryVector = this.simulateEmbedding(query);
      
      // 2. Retrieval - Find relevant document chunks
      const relevantChunks = await this.retrieveRelevantChunks(query, queryVector, contextDocuments);
      
      // 3. Reranking (optional) - Re-order chunks by relevance
      const rerankedChunks = this.rerankChunks(relevantChunks, query);
      
      // 4. Prompt Augmentation - Combine query with retrieved context
      const augmentedPrompt = this.augmentPrompt(query, rerankedChunks);
      
      return {
        success: true,
        query,
        retrievedChunks: rerankedChunks.slice(0, this.topK),
        augmentedPrompt,
        contextDocuments
      };
    } catch (error) {
      console.error("[RAG] Query processing error:", error);
      return {
        success: false,
        error: error.message,
        query
      };
    }
  }

  // Retrieve relevant chunks using hybrid search
  async retrieveRelevantChunks(query, queryVector, contextDocuments) {
    console.log("[RAG] Retrieving relevant chunks");
    
    // Hybrid search: combine semantic and keyword search
    const semanticResults = this.semanticSearch(queryVector, contextDocuments);
    const keywordResults = this.keywordSearch(query, contextDocuments);
    
    // Combine results (weighted toward semantic search)
    const combinedResults = this.combineSearchResults(semanticResults, keywordResults);
    
    console.log(`[RAG] Found ${combinedResults.length} relevant chunks`);
    return combinedResults;
  }

  // Semantic search using vector similarity
  semanticSearch(queryVector, contextDocuments) {
    console.log("[RAG] Performing semantic search");
    
    // Filter chunks by context documents if specified
    let chunksToSearch = this.documentChunks;
    if (contextDocuments.length > 0) {
      const contextIds = contextDocuments.map(doc => doc.id);
      chunksToSearch = this.documentChunks.filter(chunk => 
        contextIds.includes(chunk.documentId)
      );
    }
    
    // Calculate cosine similarity for each chunk
    const similarities = chunksToSearch.map(chunk => ({
      chunk,
      similarity: this.cosineSimilarity(queryVector, chunk.vector)
    }));
    
    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities.slice(0, this.topK * 2); // Return more for reranking
  }

  // Keyword search for exact term matching
  keywordSearch(query, contextDocuments) {
    console.log("[RAG] Performing keyword search");
    
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    // Filter chunks by context documents if specified
    let chunksToSearch = this.documentChunks;
    if (contextDocuments.length > 0) {
      const contextIds = contextDocuments.map(doc => doc.id);
      chunksToSearch = this.documentChunks.filter(chunk => 
        contextIds.includes(chunk.documentId)
      );
    }
    
    // Score chunks based on keyword matches
    const keywordScores = chunksToSearch.map(chunk => {
      const text = chunk.text.toLowerCase();
      let score = 0;
      
      for (const term of queryTerms) {
        if (term.length > 2) { // Ignore very short terms
          const matches = (text.match(new RegExp(term, 'g')) || []).length;
          score += matches;
        }
      }
      
      return {
        chunk,
        score: score / queryTerms.length // Normalize by query length
      };
    });
    
    // Sort by score (descending)
    keywordScores.sort((a, b) => b.score - a.score);
    
    return keywordScores.slice(0, this.topK * 2); // Return more for reranking
  }

  // Combine semantic and keyword search results
  combineSearchResults(semanticResults, keywordResults) {
    console.log("[RAG] Combining search results");
    
    // Create maps for easy lookup
    const semanticMap = new Map(semanticResults.map(r => [r.chunk.chunkId, r.similarity]));
    const keywordMap = new Map(keywordResults.map(r => [r.chunk.chunkId, r.score]));
    
    // Get all unique chunk IDs
    const allChunkIds = new Set([
      ...semanticResults.map(r => r.chunk.chunkId),
      ...keywordResults.map(r => r.chunk.chunkId)
    ]);
    
    // Combine scores (70% semantic, 30% keyword)
    const combinedScores = Array.from(allChunkIds).map(chunkId => {
      const semanticScore = semanticMap.get(chunkId) || 0;
      const keywordScore = keywordMap.get(chunkId) || 0;
      const combinedScore = (semanticScore * 0.7) + (keywordScore * 0.3);
      
      return {
        chunk: this.vectorStore.get(chunkId),
        score: combinedScore,
        semanticScore,
        keywordScore
      };
    });
    
    // Sort by combined score (descending)
    combinedScores.sort((a, b) => b.score - a.score);
    
    return combinedScores;
  }

  // Rerank chunks based on multiple factors
  rerankChunks(chunks, query) {
    console.log("[RAG] Reranking chunks");
    
    // Simple reranking based on combined scores
    // In production, use a small model for reranking
    
    return chunks.map(chunk => ({
      ...chunk,
      relevance: chunk.score,
      rank: chunks.indexOf(chunk) + 1
    }));
  }

  // Augment prompt with retrieved context
  augmentPrompt(query, chunks) {
    console.log("[RAG] Augmenting prompt with context");
    
    // Take top K chunks
    const topChunks = chunks.slice(0, this.topK);
    
    // Format context
    const context = topChunks.map((chunk, index) => 
      `[Document: ${chunk.chunk.fileName} | Chunk: ${index + 1}]\n${chunk.chunk.text}`
    ).join('\n\n---\n\n');
    
    // Create augmented prompt
    const augmentedPrompt = `
Answer the question based on the context provided below. 
If the context doesn't contain relevant information, say so.

Question: ${query}

Context:
${context}

Answer:
`.trim();
    
    return augmentedPrompt;
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] * vecA[i];
      magnitudeB += vecB[i] * vecB[i];
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * UTILITY METHODS
   */

  // Get document information
  getDocumentInfo(documentId) {
    return this.documents.get(documentId);
  }

  // Get all documents
  getAllDocuments() {
    return Array.from(this.documents.values());
  }

  // Clear all data (for testing)
  clearData() {
    this.vectorStore.clear();
    this.documents.clear();
    this.documentChunks = [];
  }

  // Get statistics
  getStats() {
    return {
      documents: this.documents.size,
      chunks: this.documentChunks.length,
      vectors: this.vectorStore.size
    };
  }
}

// Export singleton instance
export default new RAGService();