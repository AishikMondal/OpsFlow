'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Boxes, PackageX, Search, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listProducts, type Product, type Supplier } from '@/lib/api'
import { formatCurrency } from '@/lib/mock-data'

const statusBadge = {
  'in-stock': { label: 'In stock', variant: 'secondary' as const },
  'low-stock': { label: 'Low stock', variant: 'outline' as const },
  'out-of-stock': { label: 'Out of stock', variant: 'destructive' as const },
}

export function InventoryView() {
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState('all')
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<string[]>([])
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    listProducts({ category: category !== 'all' ? category : undefined, search: query || undefined })
      .then((data) => {
        setProducts(data.items)
        setCategories(data.categories)
        setSuppliers(data.suppliers)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, query])

  const lowStock = products.filter((p) => p.status === 'low-stock').length
  const outOfStock = products.filter((p) => p.status === 'out-of-stock').length
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total SKUs', value: String(products.length), icon: Boxes },
          { label: 'Low Stock', value: String(lowStock), icon: AlertTriangle },
          { label: 'Out of Stock', value: String(outOfStock), icon: PackageX },
          { label: 'Stock Value', value: formatCurrency(totalValue), icon: Truck },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <stat.icon className="size-3.5" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-xl tabular-nums">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Products</CardTitle>
          <CardDescription>Search and filter your product catalog</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="sm:max-w-xs">
              <InputGroupInput
                placeholder="Search by name or SKU…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Select value={category} onValueChange={(v) => setCategory(v ?? 'all')}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading products…</p>
          ) : products.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>No products found</EmptyTitle>
                <EmptyDescription>
                  Try a different search term or clear the category filter.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-muted-foreground">{p.supplier}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.stock}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(p.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge[p.status]?.variant || 'secondary'}>
                        {statusBadge[p.status]?.label || p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {suppliers.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="text-sm">{s.name}</CardTitle>
                <CardDescription>{s.products} active products</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">On-time: {s.onTime}%</span>
                <span className="font-medium tabular-nums">{s.spend}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
