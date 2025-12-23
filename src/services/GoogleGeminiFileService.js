class GoogleGeminiFileService {
  constructor() {
    // Use the existing API key from the environment or config
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyApFcLMVnjNMd62GfL1AWfDdT8-7HqKwI8'; // This should come from config
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Upload a file to Google Gemini for native processing
   * @param {File} file - The file to upload
   * @returns {Promise<Object>} - The upload response with file URI
   */
  async uploadFileForGemini(file) {
    try {
      console.log('Uploading file to Google Gemini for native processing:', file.name);
      
      // Step 1: Create an upload URL
      const uploadResponse = await fetch(`${this.baseUrl}/files?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: {
            displayName: file.name,
            mimeType: file.type || 'application/pdf'
          }
        })
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`File upload initiation failed: ${uploadResponse.status} - ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const uploadUrl = uploadData.uploadUrl;
      const fileUri = uploadData.file.uri;

      console.log('File upload initiated:', { uploadUrl, fileUri });

      // Step 2: Upload the actual file content
      const fileUploadResponse = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': file.type || 'application/pdf',
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'upload'
        },
        body: file
      });

      if (!fileUploadResponse.ok) {
        const errorText = await fileUploadResponse.text();
        throw new Error(`File content upload failed: ${fileUploadResponse.status} - ${errorText}`);
      }

      console.log('File content uploaded successfully');

      // Step 3: Wait for file processing to complete
      const processedFile = await this.waitForFileProcessing(fileUri);
      
      return {
        success: true,
        fileUri: processedFile.uri,
        mimeType: processedFile.mimeType,
        displayName: processedFile.displayName,
        state: processedFile.state
      };
    } catch (error) {
      console.error('Google Gemini file upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Wait for file processing to complete
   * @param {string} fileUri - The URI of the uploaded file
   * @returns {Promise<Object>} - The processed file information
   */
  async waitForFileProcessing(fileUri) {
    const maxRetries = 30; // Wait up to 5 minutes (30 * 10 seconds)
    const retryDelay = 10000; // 10 seconds between retries

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${this.baseUrl}/${fileUri}?key=${this.apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`File status check failed: ${response.status} - ${errorText}`);
        }

        const fileData = await response.json();
        
        console.log(`File processing status: ${fileData.state}`);
        
        if (fileData.state === 'ACTIVE') {
          console.log('File processing completed successfully');
          return fileData;
        }
        
        if (fileData.state === 'FAILED') {
          throw new Error(`File processing failed: ${fileData.error?.message || 'Unknown error'}`);
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } catch (error) {
        console.error('Error checking file processing status:', error);
        throw error;
      }
    }
    
    throw new Error('File processing timed out');
  }

  /**
   * Generate content using a file that has been uploaded to Google Gemini
   * @param {string} fileUri - The URI of the uploaded file
   * @param {string} prompt - The prompt to send to Gemini
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - The AI response
   */
  async generateContentWithFile(fileUri, prompt, options = {}) {
    try {
      const model = options.model || 'gemini-flash-latest';
      
      console.log('Generating content with file:', { fileUri, prompt, model });
      
      const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { file_uri: fileUri }
            ]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Content generation failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Google API returned incomplete response');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      if (!responseText || responseText.trim() === '') {
        throw new Error('Google API returned empty response');
      }

      return {
        success: true,
        text: responseText,
        provider: 'Google Gemini',
        model: model,
        tokens: data.usageMetadata?.totalTokenCount || 0
      };
    } catch (error) {
      console.error('Google Gemini content generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process a file with Google Gemini native file handling
   * @param {File} file - The file to process
   * @param {string} prompt - The prompt to send to Gemini
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - The AI response
   */
  async processFileWithGemini(file, prompt, options = {}) {
    try {
      console.log('Processing file with Google Gemini native file handling:', file.name);
      
      // Step 1: Upload the file
      const uploadResult = await this.uploadFileForGemini(file);
      
      if (!uploadResult.success) {
        throw new Error(`File upload failed: ${uploadResult.error}`);
      }
      
      console.log('File uploaded successfully:', uploadResult.fileUri);
      
      // Step 2: Generate content using the uploaded file
      const contentResult = await this.generateContentWithFile(
        uploadResult.fileUri, 
        prompt, 
        options
      );
      
      return contentResult;
    } catch (error) {
      console.error('Google Gemini file processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new GoogleGeminiFileService();