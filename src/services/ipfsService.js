import { IPFS_CONFIG } from '../config/contract'

class IPFSService {
  constructor() {
    this.defaultGateway = IPFS_CONFIG.gateways[0]
  }

  // Upload file to IPFS (mock implementation for demo)
  async uploadFile(file, onProgress = null) {
    try {
      console.log('Uploading file to IPFS:', file.name)
      
      // Simulate upload progress
      if (onProgress) {
        for (let progress = 0; progress <= 100; progress += 10) {
          onProgress(progress)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      // Generate mock IPFS hash based on file content
      const fileBuffer = await file.arrayBuffer()
      const hashInput = new Uint8Array(fileBuffer)
      
      // Simple hash generation for demo (in production use real IPFS upload)
      let hash = 'Qm'
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      for (let i = 0; i < 44; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      // Add some deterministic elements based on file
      const fileHash = await this.generateFileHash(file)
      hash = `Qm${fileHash}${Math.random().toString(36).substr(2, 20)}`
      
      console.log('File uploaded to IPFS:', hash)
      
      return {
        success: true,
        hash,
        size: file.size,
        name: file.name,
        type: file.type
      }
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw new Error(`IPFS upload failed: ${error.message}`)
    }
  }

  // Upload file to IPFS using Pinata (real implementation)
  async uploadToPinata(file, apiKey, apiSecret) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const pinataMetadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          uploadedBy: 'SecureX',
          timestamp: Date.now().toString()
        }
      })
      formData.append('pinataMetadata', pinataMetadata)
      
      const response = await fetch(IPFS_CONFIG.uploadEndpoints.pinata.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      return {
        success: true,
        hash: result.IpfsHash,
        size: result.PinSize,
        timestamp: result.Timestamp
      }
    } catch (error) {
      console.error('Pinata upload failed:', error)
      throw new Error(`Pinata upload failed: ${error.message}`)
    }
  }

  // Generate deterministic hash for file content
  async generateFileHash(file) {
    try {
      const buffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      return hashHex.slice(0, 20) // Use first 20 characters
    } catch (error) {
      console.error('Error generating file hash:', error)
      return Math.random().toString(36).substr(2, 20)
    }
  }

  // Get IPFS URL for a hash
  getIPFSUrl(hash, gatewayIndex = 0) {
    const gateway = IPFS_CONFIG.gateways[gatewayIndex] || this.defaultGateway
    return `${gateway}/${hash}`
  }

  // Get multiple gateway URLs for redundancy
  getIPFSUrls(hash) {
    return IPFS_CONFIG.gateways.map(gateway => `${gateway}/${hash}`)
  }

  // Download file from IPFS with gateway fallback
  async downloadFile(hash, fileName = 'download') {
    console.log('Attempting to download from IPFS:', hash)
    
    // Try multiple gateways in order
    for (let i = 0; i < IPFS_CONFIG.gateways.length; i++) {
      try {
        const gateway = IPFS_CONFIG.gateways[i]
        const url = `${gateway}/${hash}`
        console.log(`Trying gateway ${i + 1}/${IPFS_CONFIG.gateways.length}:`, url)
        
        const response = await fetch(url)
        if (response.ok) {
          const blob = await response.blob()
          
          // Create download link
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(downloadUrl)
          
          console.log('Successfully downloaded from:', gateway)
          return {
            success: true,
            size: blob.size,
            type: blob.type,
            gateway: gateway
          }
        } else {
          console.warn(`Gateway ${gateway} failed with status:`, response.status)
        }
      } catch (error) {
        console.warn(`Gateway ${IPFS_CONFIG.gateways[i]} failed:`, error.message)
        // Continue to next gateway
      }
    }
    
    // If all gateways fail, throw error
    console.error('All IPFS gateways failed for hash:', hash)
    throw new Error(`Download failed: All IPFS gateways unavailable. Try again later or use a different gateway manually.`)
  }

  // Check if IPFS hash is accessible with gateway fallback
  async checkIPFSAccess(hash) {
    console.log('Checking IPFS access for hash:', hash)
    
    // Try multiple gateways in order
    for (let i = 0; i < IPFS_CONFIG.gateways.length; i++) {
      try {
        const gateway = IPFS_CONFIG.gateways[i]
        const url = `${gateway}/${hash}`
        console.log(`Checking gateway ${i + 1}/${IPFS_CONFIG.gateways.length}:`, url)
        
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
          console.log('Successfully accessed via gateway:', gateway)
          return { accessible: true, gateway: gateway }
        } else {
          console.warn(`Gateway ${gateway} inaccessible with status:`, response.status)
        }
      } catch (error) {
        console.warn(`Gateway ${IPFS_CONFIG.gateways[i]} check failed:`, error.message)
        // Continue to next gateway
      }
    }
    
    // If all gateways fail
    console.log('All IPFS gateways inaccessible for hash:', hash)
    return { accessible: false, error: 'All gateways unavailable' }
  }

  // Get file metadata from IPFS with gateway fallback
  async getFileMetadata(hash) {
    console.log('Getting file metadata from IPFS:', hash)
    
    // Try multiple gateways in order
    for (let i = 0; i < IPFS_CONFIG.gateways.length; i++) {
      try {
        const gateway = IPFS_CONFIG.gateways[i]
        const url = `${gateway}/${hash}`
        console.log(`Getting metadata from gateway ${i + 1}/${IPFS_CONFIG.gateways.length}:`, url)
        
        const response = await fetch(url, { method: 'HEAD' })
        
        if (response.ok) {
          console.log('Successfully got metadata from:', gateway)
          return {
            size: parseInt(response.headers.get('content-length') || '0'),
            type: response.headers.get('content-type') || 'application/octet-stream',
            lastModified: response.headers.get('last-modified'),
            accessible: true,
            gateway: gateway
          }
        } else {
          console.warn(`Gateway ${gateway} failed to provide metadata with status:`, response.status)
        }
      } catch (error) {
        console.warn(`Gateway ${IPFS_CONFIG.gateways[i]} metadata request failed:`, error.message)
        // Continue to next gateway
      }
    }
    
    // If all gateways fail
    console.log('All IPFS gateways failed to provide metadata for hash:', hash)
    return {
      size: 0,
      type: 'unknown',
      lastModified: null,
      accessible: false,
      error: 'All gateways unavailable'
    }
  }
}

// Create singleton instance
export const ipfsService = new IPFSService()
export default ipfsService
