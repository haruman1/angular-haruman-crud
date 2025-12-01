import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { api, type Stock, type StockInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
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
      toast({ title: "Berhasil", description: "Produk berhasil ditambahkan" });
      setShowForm(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan produk", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StockInput }) => api.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Produk berhasil diupdate" });
      setEditingStock(null);
      setShowForm(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal mengupdate produk", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Berhasil", description: "Produk berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus produk", variant: "destructive" });
    },
  });

  const handleSubmit = (data: StockInput) => {
    if (editingStock) {
      updateMutation.mutate({ id: editingStock.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStock(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manajemen Stok</h1>
          <p className="text-muted-foreground mt-1">Kelola data produk dan stok Anda</p>
        </div>

        {showForm ? (
          <StockForm
            stock={editingStock}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </div>
            <StockTable
              stocks={stocks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
