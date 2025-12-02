const BASE_URL = import.meta.env.VITE_API_URL;

/* ============================
   TYPES
============================= */

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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/* ============================
   TOKEN HEADER
============================= */

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ============================
   MAIN API CLIENT
============================= */

export const api = {
  /* ============================
     AUTH
  ============================= */

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Registrasi gagal');
    }

    return json;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Email atau password salah');
    }

    return json;
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },

  async checkAuth(): Promise<User | null> {
    try {
      const response = await fetch(`${BASE_URL}/auth/check`, {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) return null;
      const json = await response.json();
      if (!json.success) return null;
      return json.data;
    } catch {
      return null;
    }
  },

  /* ============================
      STOCKS
  ============================= */

  async getStocks(): Promise<Stock[]> {
    const response = await fetch(`${BASE_URL}/stocks`, {
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();

    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async getStock(id: string): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async createStock(data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async updateStock(id: string, data: StockInput): Promise<Stock> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async deleteStock(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/stocks/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);
  },

  /* ============================
     MOVEMENTS
  ============================= */

  async getMovements(): Promise<StockMovement[]> {
    const response = await fetch(`${BASE_URL}/stocks/movement`, {
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async createMovement(data: StockMovementInput): Promise<StockMovement> {
    const response = await fetch(`${BASE_URL}/stocks/movement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async updateMovement(
    id: string,
    data: Omit<StockMovementInput, 'stock_id'>
  ): Promise<StockMovement> {
    const response = await fetch(`${BASE_URL}/stocks/movement/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async deleteMovement(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/stocks/movement/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);
  },

  /* ============================
      USERS
  ============================= */

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async updateUserProfile(
    id: string,
    data: { name?: string; email?: string }
  ): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/profile/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);

    return json.data;
  },

  async changePassword(
    id: string,
    data: { oldPassword: string; newPassword: string }
  ): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/change-password/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);
  },

  async changeRole(id: string, role: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/change-role/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ role }),
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });

    const json = await response.json();
    if (!json.success) throw new Error(json.message);
  },
};
