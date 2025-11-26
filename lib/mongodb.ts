import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En développement, utiliser une variable globale pour préserver la connexion
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production, créer une nouvelle connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('urbanstyle');
}

// Fonction pour récupérer le contenu du site
export async function getSiteContent() {
  const db = await getDatabase();
  const content = await db.collection('content').findOne({ _id: 'site_content' as any });
  return content?.data || null;
}

// Fonction pour mettre à jour le contenu du site
export async function updateSiteContent(data: any) {
  const db = await getDatabase();
  await db.collection('content').updateOne(
    { _id: 'site_content' as any },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
  return data;
}

// Fonction pour mettre à jour une section spécifique
export async function updateSection(section: string, sectionData: any) {
  const db = await getDatabase();
  const updatePath = `data.${section}`;
  await db.collection('content').updateOne(
    { _id: 'site_content' as any },
    { 
      $set: { 
        [updatePath]: sectionData, 
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  );
  
  // Retourner le contenu mis à jour
  return getSiteContent();
}
