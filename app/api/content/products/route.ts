import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, updateContent } from '@/lib/content-service';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  image: string;
  color: string;
  active: boolean;
}

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const content = await getAllContent() as { products?: Product[] };
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
    const content = await getAllContent() as { products?: Product[] };
    const products = content.products || [];
    
    // Générer un ID unique
    const maxId = products.reduce((max: number, p: Product) => {
      const id = parseInt(p.id);
      return id > max ? id : max;
    }, 0);
    
    const newProduct: Product = {
      ...product,
      id: String(maxId + 1),
      active: product.active ?? true
    };
    
    products.push(newProduct);
    await updateContent('products', products as unknown as Record<string, unknown>);
    
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
    const content = await getAllContent() as { products?: Product[] };
    const products = content.products || [];
    
    const index = products.findIndex((p: Product) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    products[index] = { ...products[index], ...updates };
    await updateContent('products', products as unknown as Record<string, unknown>);
    
    return NextResponse.json({ success: true, product: products[index] });
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
    
    const content = await getAllContent() as { 
      products?: Product[];
      bestsellers?: { products: string[] };
    };
    const products = content.products || [];
    
    const index = products.findIndex((p: Product) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    products.splice(index, 1);
    
    // Retirer aussi des bestsellers si présent
    if (content.bestsellers?.products) {
      content.bestsellers.products = content.bestsellers.products.filter((pid: string) => pid !== id);
      await updateContent('bestsellers', content.bestsellers as unknown as Record<string, unknown>);
    }
    
    await updateContent('products', products as unknown as Record<string, unknown>);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Erreur suppression produit' }, { status: 500 });
  }
}
