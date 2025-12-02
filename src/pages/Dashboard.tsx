import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import {
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
} from 'lucide-react';

export default function Dashboard() {
  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: api.getStocks,
  });

  const { data: movements = [] } = useQuery({
    queryKey: ['movements'],
    queryFn: api.getMovements,
  });

  const totalProducts = stocks.length;
  const totalStock = stocks.reduce((sum, s) => sum + s.jumlah_produk, 0);
  const totalValue = stocks.reduce(
    (sum, s) => sum + s.jumlah_produk * s.harga_produk,
    0
  );
  const totalIn = movements.reduce((sum, m) => sum + m.jumlah_masuk, 0);
  const totalOut = movements.reduce((sum, m) => sum + m.jumlah_keluar, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan data stok dan pergerakan
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">produk terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">unit tersedia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nilai Stok</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                total nilai inventaris
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pergerakan</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    +{totalIn}
                  </div>
                  <p className="text-xs text-muted-foreground">masuk</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    -{totalOut}
                  </div>
                  <p className="text-xs text-muted-foreground">keluar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stocks */}
        <Card>
          <CardHeader>
            <CardTitle>Stok Produk Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {stocks.length === 0 ? (
              <p className="text-muted-foreground">Belum ada data stok</p>
            ) : (
              <div className="space-y-4">
                {stocks.slice(0, 5).map((stock) => (
                  <div
                    key={stock.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{stock.nama_produk}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {stock.jumlah_produk}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(stock.harga_produk)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
