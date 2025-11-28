export interface Regulation {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  tipo: string; // ✅ AGREGAR ESTA PROPIEDAD
  fecha: string;
  numero: string;
}