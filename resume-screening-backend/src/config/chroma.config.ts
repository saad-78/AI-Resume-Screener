import { ChromaClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';
import dotenv from 'dotenv';

dotenv.config();

const CHROMA_HOST = process.env.CHROMA_HOST || 'http://localhost:8000';

export const chromaClient = new ChromaClient({ path: CHROMA_HOST });

// Initialize default embedding function
const embeddingFunction = new DefaultEmbeddingFunction();

/**
 * Initialize collections with embedding function
 */
export async function initCollections() {
  try {
    console.log(`🔄 Connecting to ChromaDB at ${CHROMA_HOST}...`);
    
    await chromaClient.heartbeat();
    console.log('✅ ChromaDB connected');
    
    const collections = ['resume_chunks', 'job_description_chunks'];
    
    for (const collectionName of collections) {
      try {
        await chromaClient.getOrCreateCollection({ 
          name: collectionName,
          embeddingFunction: embeddingFunction,
        });
        console.log(`✅ Collection "${collectionName}" ready`);
      } catch (error) {
        console.error(`❌ Failed to create collection "${collectionName}":`, error);
      }
    }
  } catch (error) {
    console.error('❌ ChromaDB connection failed:', error);
    console.log('\n⚠️  Make sure ChromaDB is running:');
    console.log('   docker run -p 8000:8000 chromadb/chroma\n');
    process.exit(1);
  }
}

/**
 * Get a collection by name
 */
export async function getCollection(name: string) {
  return await chromaClient.getOrCreateCollection({ 
    name,
    embeddingFunction: embeddingFunction,
  });
}
