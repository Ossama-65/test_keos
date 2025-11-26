import mongoose, { Schema, Document } from 'mongoose';

// Interface pour le contenu du site
export interface IContent extends Document {
  key: string;
  data: Record<string, unknown>;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  data: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Éviter la recompilation du modèle en développement
export const Content = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;

