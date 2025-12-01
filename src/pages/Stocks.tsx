import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Stock, StockInput } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Stocks() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<StockInput>({
    nama_produk: "",
    jumlah_produk: 0,
    harga_produk: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: api.getStocks,
  });

  const createMutation = useMutation({
    mutationFn: api.createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Produk ditambahkan" });
      closeDialog();
    },
    onError: () => toast({ title: "Error", description: "Gagal menambahkan", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StockInput }) => api.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Produk diupdate" });
      closeDialog();
    },
    onError: () => toast({ title: "Error", description: "Gagal mengupdate", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Produk dihapus" });
    },
    onError: () => toast({ title: "Error", description: "Gagal menghapus", variant: "destructive" }),
  });

  const openDialog = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        nama_produk: stock.nama_produk,
        jumlah_produk: stock.jumlah_produk,
        harga_produk: stock.harga_produk,
      });
    } else {
      setEditingStock(null);
      setFormData({ nama_produk: "", jumlah_produk: 0, harga_produk: 0 });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingStock(null);
    setFormData({ nama_produk: "", jumlah_produk: 0, harga_produk: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStock) {
      updateMutation.mutate({ id: editingStock.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus produk ini?")) deleteMutation.mutate(id);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stok Produk</h1>
            <p className="text-muted-foreground">Kelola data produk dan stok</p>
          </div>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-muted-foreground">Memuat...</p>
            ) : stocks.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">Belum ada data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-center w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">{stock.nama_produk}</TableCell>
                      <TableCell className="text-right">{stock.jumlah_produk}</TableCell>
                      <TableCell className="text-right">{formatCurrency(stock.harga_produk)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(stock)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(stock.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStock ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Produk</Label>
                <Input
                  value={formData.nama_produk}
                  onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  value={formData.jumlah_produk}
                  onChange={(e) => setFormData({ ...formData, jumlah_produk: Number(e.target.value) })}
                  required
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Harga</Label>
                <Input
                  type="number"
                  value={formData.harga_produk}
                  onChange={(e) => setFormData({ ...formData, harga_produk: Number(e.target.value) })}
                  required
                  min={0}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
