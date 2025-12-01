import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stock, StockInput } from "@/lib/api";

interface StockFormProps {
  stock?: Stock | null;
  onSubmit: (data: StockInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StockForm({ stock, onSubmit, onCancel, isLoading }: StockFormProps) {
  const [formData, setFormData] = useState<StockInput>({
    nama_produk: "",
    jumlah_produk: 0,
    harga_produk: 0,
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        nama_produk: stock.nama_produk,
        jumlah_produk: stock.jumlah_produk,
        harga_produk: stock.harga_produk,
      });
    }
  }, [stock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{stock ? "Edit Produk" : "Tambah Produk"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_produk">Nama Produk</Label>
            <Input
              id="nama_produk"
              value={formData.nama_produk}
              onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
              placeholder="Masukkan nama produk"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jumlah_produk">Jumlah Produk</Label>
            <Input
              id="jumlah_produk"
              type="number"
              value={formData.jumlah_produk}
              onChange={(e) => setFormData({ ...formData, jumlah_produk: Number(e.target.value) })}
              placeholder="Masukkan jumlah"
              required
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="harga_produk">Harga Produk</Label>
            <Input
              id="harga_produk"
              type="number"
              value={formData.harga_produk}
              onChange={(e) => setFormData({ ...formData, harga_produk: Number(e.target.value) })}
              placeholder="Masukkan harga"
              required
              min={0}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Menyimpan..." : stock ? "Update" : "Simpan"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
