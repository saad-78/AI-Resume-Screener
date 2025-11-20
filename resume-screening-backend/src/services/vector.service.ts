import { getCollection } from "../config/chroma.config.js";
import { Chunk } from '../types/index.js';

/**
 * Store chunks in ChromaDB (embeddings generated automatically)
 */
export async function storeChunks(chunks: Chunk[], collectionName: string) {
  const collection = await getCollection(collectionName);
  
  const ids = chunks.map(c => c.id);
  const texts = chunks.map(c => c.text);
  const metadatas = chunks.map(c => ({
    documentId: c.documentId,
    documentType: c.documentType,
    section: c.section,
    wordCount: c.metadata.wordCount,
    position: c.metadata.position,
  }));
  
  // ChromaDB auto-generates embeddings
  await collection.add({
    ids,
    documents: texts,
    metadatas,
  });
  
  console.log(`✅ Stored ${chunks.length} chunks in ${collectionName}`);
}

/**
 * Search for relevant chunks using vector similarity
 */
export async function searchChunks(
  query: string,
  documentId: string,
  collectionName: string,
  topK: number = 3
): Promise<{ texts: string[]; sections: string[] }> {
  const collection = await getCollection(collectionName);
  
  // ChromaDB auto-generates query embedding
  const results = await collection.query({
    queryTexts: [query],
    nResults: topK,
    where: { documentId },
  });
  
  const texts = results.documents[0] || [];
  const sections = results.metadatas[0]?.map((m: any) => m.section) || [];
  
  console.log(`✅ Retrieved ${texts.length} relevant chunks`);
  //@ts-ignore
  return { texts, sections };
}

/**
 * Delete all chunks for a document
 */
export async function deleteDocument(documentId: string, collectionName: string) {
  const collection = await getCollection(collectionName);
  await collection.delete({ where: { documentId } });
  console.log(`✅ Deleted chunks for document ${documentId}`);
}
