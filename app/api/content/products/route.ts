import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'public', 'data', 'content.json');

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    return NextResponse.json(content.products || []);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json({ error: 'Erreur lecture produits' }, { status: 500 });
  }
}

// POST - Ajouter un produit
export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    
    // Générer un ID unique
    const maxId = content.products.reduce((max: number, p: { id: string }) => {
      const id = parseInt(p.id);
      return id > max ? id : max;
    }, 0);
    
    const newProduct = {
      ...product,
      id: String(maxId + 1),
      active: product.active ?? true
    };
    
    content.products.push(newProduct);
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Erreur ajout produit' }, { status: 500 });
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    
    const index = content.products.findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    content.products[index] = { ...content.products[index], ...updates };
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, product: content.products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Erreur mise à jour produit' }, { status: 500 });
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
    const index = content.products.findIndex((p: { id: string }) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    content.products.splice(index, 1);
    
    // Retirer aussi des bestsellers si présent
    if (content.bestsellers?.products) {
      content.bestsellers.products = content.bestsellers.products.filter((pid: string) => pid !== id);
    }
    
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Erreur suppression produit' }, { status: 500 });
  }
}

