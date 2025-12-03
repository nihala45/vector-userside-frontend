"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Download, Trash2, Columns, CalendarIcon, FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DateRange } from "react-day-picker"

interface FilterConfig {
  type: "select" | "date"
  column: string
  placeholder: string
}

interface CustomDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  exportFileName?: string
  onDeleteSelected?: (rows: TData[]) => void
  onRowClick?: (row: TData) => void
  filters?: FilterConfig[]
}

// FIXED: CSV Export — 100% TypeScript safe
const exportToCSV = (data: any[], columns: ColumnDef<any, any>[], filename: string) => {
  const headers = columns
    .map(col => {
      if (typeof col.header === "function") return col.id ?? ""
      if (typeof col.header === "string") return col.header
      return col.id ?? ""
    })
    .join(",")

  const rows = data.map(row =>
    columns
      .map(col => {
        const key = (col as any).accessorKey
        const value = key ? row[key] : ""
        return `"${String(value ?? "").replace(/"/g, '""')}"`
      })
      .join(",")
  )

  const csvContent = [headers, ...rows].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exactMatchFilter = (row: Row<any>, columnId: string, filterValue: string) => {
  if (!filterValue) return true
  const value = row.getValue(columnId)
  return String(value).toLowerCase() === filterValue.toLowerCase()
}

export function CustomDataTable<TData, TValue>({
  columns,
  data,
  exportFileName = "data.csv",
  onDeleteSelected,
  onRowClick,
  filters = [],
}: CustomDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [dateFilters, setDateFilters] = React.useState<Record<string, DateRange | undefined>>({})

  const enhancedColumns = React.useMemo(() => {
    return columns.map(col => {
      const filter = filters.find(f => f.type === "select" && f.column === (col as any).accessorKey)
      return filter ? { ...col, filterFn: exactMatchFilter } : col
    })
  }, [columns, filters])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    enableRowSelection: true,
    filterFns: { exact: exactMatchFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    globalFilterFn: "includesString",
  })

  const filteredRows = React.useMemo(() => {
    return table.getSortedRowModel().rows.filter(row => {
      return filters.every(f => {
        if (f.type !== "date") return true
        const value = row.getValue(f.column)
        const range = dateFilters[f.column]
        if (!value || !range?.from) return true
        const date = new Date(value as string | number | Date)
        if (range.from && date < range.from) return false
        if (range.to && date > range.to) return false
        return true
      })
    })
  }, [table.getSortedRowModel().rows, dateFilters, filters])

  const { pageIndex, pageSize } = table.getState().pagination
  const paginatedRows = filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex flex-wrap gap-2 ml-auto">
          {onDeleteSelected && table.getSelectedRowModel().rows.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => onDeleteSelected(table.getSelectedRowModel().rows.map(r => r.original))}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns className="h-4 w-4 mr-2" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={v => column.toggleVisibility(!!v)}
                >
                  {String(column.columnDef.header ?? column.id)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {filters.some(f => f.type === "date") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" /> Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                {filters.filter(f => f.type === "date").map(f => (
                  <div key={f.column} className="space-y-3 mb-6 last:mb-0">
                    <p className="text-sm font-medium">{f.placeholder}</p>
                    <Calendar
                      mode="range"
                      selected={dateFilters[f.column]}
                      onSelect={(range: DateRange | undefined) =>
                        setDateFilters(prev => ({ ...prev, [f.column]: range }))
                      }
                      numberOfMonths={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setDateFilters(prev => ({ ...prev, [f.column]: undefined }))}
                    >
                      Clear
                    </Button>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {filters.some(f => f.type === "select") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="h-4 w-4 mr-2" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filters.filter(f => f.type === "select").map(f => {
                  const options = Array.from(new Set(data.map((d: any) => d[f.column])))
                  const column = table.getColumn(f.column)
                  const value = column?.getFilterValue() as string | undefined

                  return (
                    <div key={f.column} className="p-2">
                      <Select value={value ?? ""} onValueChange={v => column?.setFilterValue(v || undefined)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder={f.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          {options.map(opt => (
                            <SelectItem key={opt} value={String(opt)}>{String(opt)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" size="sm" onClick={() => exportToCSV(data, columns, exportFileName)}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paginatedRows.length ? (
              paginatedRows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
        <div className="text-muted-foreground">
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, filteredRows.length)} of {filteredRows.length}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Select value={String(pageSize)} onValueChange={v => table.setPageSize(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map(s => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}