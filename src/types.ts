export type CategoriaMueble =
  | 'Sala'
  | 'Comedor'
  | 'Dormitorio'
  | 'Iluminación'
  | 'Estudio';

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  categoria: CategoriaMueble;
  material: string;
  acabados: string[];
  precio: number;
  stock: number;
  dimensiones: string;
  peso: string;
  origen: string;
  destacado: boolean;
  imagen: string;
  descripcion: string;
}

export interface CartItem {
  productId: string;
  acabado: string;
  cantidad: number;
}

export interface PedidoConfirmado {
  numero: string;
  fecha: string;
  cliente: string;
  email: string;
  direccion: string;
  items: Array<{
    nombre: string;
    sku: string;
    acabado: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
}

export type AppRoute =
  | { name: 'inicio' }
  | { name: 'catalogo'; categoriaInicial?: string }
  | { name: 'producto'; id: string }
  | { name: 'carrito'; tab: 'carrito' | 'favoritos' }
  | { name: 'contacto' }
  | { name: 'admin' }
  | { name: '404' };
