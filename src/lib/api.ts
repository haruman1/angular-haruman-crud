const BASE_URL = "https://v3.haruman.me";

export interface Stock {
  id: string;
  nama_produk: string;
  jumlah_produk: number;
  harga_produk: number;
}

export interface StockInput {
  nama_produk: string;
  jumlah_produk: number;
  harga_produk: number;
}

export const api = {
  async getStocks(): Promise<Stock[]> {
    const response = await fetch(`${BASE_URL}/stocks/`);
    if (!response.ok) throw new Error("Failed to fetch stocks");
    return response.json();
  },

  async getStock(id: string): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`);
    if (!response.ok) throw new Error("Failed to fetch stock");
    return response.json();
  },

  async createStock(data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/tambah`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create stock");
    return response.json();
  },

  async updateStock(id: string, data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update stock");
    return response.json();
  },

  async deleteStock(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/stocks/preview/${id}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to delete stock");
  },
};
