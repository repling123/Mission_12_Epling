export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  image?: string; // Optional: If you want to display product images
}
