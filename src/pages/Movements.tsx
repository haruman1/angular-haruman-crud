import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, StockMovement, StockMovementInput, Stock } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Movements() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(null);
  const [formData, setFormData] = useState<StockMovementInput>({
    stock_id: "",
    jumlah_masuk: 0,
    jumlah_keluar: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["movements"],
    queryFn: api.getMovements,
  });

  const { data: stocks = [] } = useQuery({
    queryKey: ["stocks"],
    queryFn: api.getStocks,
  });

  const createMutation = useMutation({
    mutationFn: api.createMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Pergerakan ditambahkan" });
      closeDialog();
    },
    onError: () => toast({ title: "Error", description: "Gagal menambahkan", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<StockMovementInput, "stock_id"> }) =>
      api.updateMovement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Pergerakan diupdate" });
      closeDialog();
    },
    onError: () => toast({ title: "Error", description: "Gagal mengupdate", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Pergerakan dihapus" });
    },
    onError: () => toast({ title: "Error", description: "Gagal menghapus", variant: "destructive" }),
  });

  const openDialog = (movement?: StockMovement) => {
    if (movement) {
      setEditingMovement(movement);
      setFormData({
        stock_id: movement.stock_id,
        jumlah_masuk: movement.jumlah_masuk,
        jumlah_keluar: movement.jumlah_keluar,
      });
    } else {
      setEditingMovement(null);
      setFormData({ stock_id: "", jumlah_masuk: 0, jumlah_keluar: 0 });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingMovement(null);
    setFormData({ stock_id: "", jumlah_masuk: 0, jumlah_keluar: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovement) {
      updateMutation.mutate({
        id: editingMovement.id,
        data: { jumlah_masuk: formData.jumlah_masuk, jumlah_keluar: formData.jumlah_keluar },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus pergerakan ini?")) deleteMutation.mutate(id);
  };

  const getStockName = (stockId: string) => {
    const stock = stocks.find((s) => s.id === stockId);
    return stock?.nama_produk || stockId;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pergerakan Stok</h1>
            <p className="text-muted-foreground">Kelola data masuk dan keluar stok</p>
          </div>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pergerakan
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-muted-foreground">Memuat...</p>
            ) : movements.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">Belum ada data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Masuk</TableHead>
                    <TableHead className="text-right">Keluar</TableHead>
                    <TableHead className="text-center w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{getStockName(movement.stock_id)}</TableCell>
                      <TableCell className="text-right text-green-600">+{movement.jumlah_masuk}</TableCell>
                      <TableCell className="text-right text-red-600">-{movement.jumlah_keluar}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(movement)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(movement.id)}>
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
              <DialogTitle>{editingMovement ? "Edit Pergerakan" : "Tambah Pergerakan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingMovement && (
                <div className="space-y-2">
                  <Label>Produk</Label>
                  <Select
                    value={formData.stock_id}
                    onValueChange={(value) => setFormData({ ...formData, stock_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {stocks.map((stock) => (
                        <SelectItem key={stock.id} value={stock.id}>
                          {stock.nama_produk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Jumlah Masuk</Label>
                <Input
                  type="number"
                  value={formData.jumlah_masuk}
                  onChange={(e) => setFormData({ ...formData, jumlah_masuk: Number(e.target.value) })}
                  required
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Keluar</Label>
                <Input
                  type="number"
                  value={formData.jumlah_keluar}
                  onChange={(e) => setFormData({ ...formData, jumlah_keluar: Number(e.target.value) })}
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
