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

export interface StockMovement {
  id: string;
  stock_id: string;
  jumlah_masuk: number;
  jumlah_keluar: number;
  created_at?: string;
}

export interface StockMovementInput {
  stock_id: string;
  jumlah_masuk: number;
  jumlah_keluar: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registrasi gagal");
    }
    return response.json();
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login gagal");
    }
    return response.json();
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
  },

  async checkAuth(): Promise<User | null> {
    try {
      const response = await fetch(`${BASE_URL}/auth/check`, {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  // Stocks
  async getStocks(): Promise<Stock[]> {
    const response = await fetch(`${BASE_URL}/stocks/`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to fetch stocks");
    return response.json();
  },

  async getStock(id: string): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to fetch stock");
    return response.json();
  },

  async createStock(data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/tambah`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create stock");
    return response.json();
  },

  async updateStock(id: string, data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update stock");
    return response.json();
  },

  async deleteStock(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/stocks/preview/${id}`, {
      method: "GET",
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to delete stock");
  },

  // Stock Movements
  async getMovements(): Promise<StockMovement[]> {
    const response = await fetch(`${BASE_URL}/stocks/movement/`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to fetch movements");
    return response.json();
  },

  async createMovement(data: StockMovementInput): Promise<StockMovement> {
    const response = await fetch(`${BASE_URL}/stocks/movement/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create movement");
    return response.json();
  },

  async updateMovement(id: string, data: Omit<StockMovementInput, "stock_id">): Promise<StockMovement> {
    const response = await fetch(`${BASE_URL}/stocks/movement/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update movement");
    return response.json();
  },

  async deleteMovement(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/stocks/movement/delete/${id}`, {
      method: "PATCH",
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to delete movement");
  },

  // Users
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  async updateUserProfile(id: string, data: { name?: string; email?: string }): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/profile/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  async changePassword(id: string, data: { oldPassword: string; newPassword: string }): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/change-password/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to change password");
  },

  async changeRole(id: string, role: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/change-role/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to change role");
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/delete-account/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },
};
