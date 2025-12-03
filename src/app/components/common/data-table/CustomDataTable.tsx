"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

// CSV Export Helper
const exportToCSV = (rows: any[], columns: ColumnDef<any, any>[], filename: string) => {
  const headers = columns.map((c) => (c.header as any)?.toString?.() ?? c.id)
  const csvRows = [headers.join(",")]

  rows.forEach((row) => {
    const values = columns.map((col) => {
      const key = (col as any).accessorKey
      return key ? row[key] : ""
    })
    csvRows.push(values.join(","))
  })

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// ✅ Exact match filter (fixes Active/Inactive issue)
const exactMatchFilter = (row: any, columnId: string, filterValue: string) => {
  if (!filterValue) return true
  const value = row.getValue(columnId)
  return String(value).toLowerCase() === String(filterValue).toLowerCase()
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

  const [dateFilters, setDateFilters] = React.useState<Record<string, { from?: Date; to?: Date }>>({})

  // ✅ Enhance columns: attach exact filterFn automatically for select filters
  const enhancedColumns = React.useMemo(() => {
    return columns.map((col) => {
      const filter = filters.find((f) => f.type === "select" && f.column === (col as any).accessorKey)
      if (filter) {
        return {
          ...col,
          filterFn: "exact" as const,
        }
      }
      return col
    })
  }, [columns, filters])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    enableRowSelection: true,
    filterFns: {
      exact: exactMatchFilter, // ✅ register exact filter
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
    },
  })

  const filteredRows = table.getSortedRowModel().rows.filter((row) => {
    return filters.every((f) => {
      if (f.type !== "date") return true
      const colValue = row.getValue(f.column)
      const { from, to } = dateFilters[f.column] || {}
      if (!colValue) return true
      const dateValue = new Date(colValue)
      if (from && dateValue < from) return false
      if (to && dateValue > to) return false
      return true
    })
  })

  // ✅ Apply pagination after filtering and sorting
  const { pageIndex, pageSize } = table.getState().pagination
  const paginatedRows = filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <div className="w-full bg-white p-1 px-4 rounded-md">
      {/* Toolbar */}
      <div className="flex items-center gap-2 py-4">
        {/* Global Search */}
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm h-12"
        />

        {/* Multi Delete */}
        {onDeleteSelected && table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            variant="destructive"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onDeleteSelected(table.getFilteredSelectedRowModel().rows.map((r) => r.original))}
          >
            <Trash2 className="h-4 w-4" /> Delete Selected
          </Button>
        )}

        <div className="ml-auto flex gap-2 items-center">
          {/* Columns Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-12 bg-transparent">
                <Columns className="h-4 w-4" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const id = column.id.toLowerCase()
                  let label = column.id

                  if (id.includes("address")) {
                    label = "Location"
                  } else if (id.includes("manager")) {
                    label = "Manager"
                  }

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Button */}
          {filters.some((f) => f.type === "date") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-12 bg-transparent">
                  <CalendarIcon className="h-4 w-4" /> Select Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {filters
                  .filter((f) => f.type === "date")
                  .map((f) => {
                    return (
                      <div key={f.column} className="p-2">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateFilters[f.column]?.from}
                          selected={dateFilters[f.column]}
                          onSelect={(range) =>
                            setDateFilters((prev) => ({
                              ...prev,
                              [f.column]: range || {},
                            }))
                          }
                          numberOfMonths={2}
                        />
                        {/* Reset Button */}
                        <div className="p-2 flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDateFilters((prev) => ({
                                ...prev,
                                [f.column]: {},
                              }))
                            }
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </PopoverContent>
            </Popover>
          )}

          {/* Status Filter Button */}
          {filters.some((f) => f.type === "select") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-12 bg-transparent">
                  <FilterIcon className="h-4 w-4" /> Filter By Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filters
                  .filter((f) => f.type === "select")
                  .map((f) => {
                    const options = Array.from(new Set(data.map((d: any) => d[f.column])))
                    const column = table.getColumn(f.column)

                    const currentValue = column?.getFilterValue() as string | undefined

                    return (
                      <div key={f.column} className="p-2">
                        <Select
                          value={currentValue ?? "__all__"}
                          onValueChange={(value) => {
                            if (value === "__all__") {
                              column?.setFilterValue(undefined) // clear filter
                            } else {
                              column?.setFilterValue(value)
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px] h-10">
                            <SelectValue placeholder={f.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{f.placeholder}</SelectLabel>
                              <SelectItem value="__all__">All</SelectItem>
                              {options.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                  {String(option)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          <Button
            variant="outline"
            className="flex items-center gap-2 h-12 bg-transparent"
            onClick={() => exportToCSV(data, columns, exportFileName)}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="border bg-gray-50" key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paginatedRows.length ? (
              paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={(e) => {
                    if (!onRowClick) return
                    const target = e.target as HTMLElement
                    if (target.closest("[data-stop-propagation]")) return
                    onRowClick(row.original)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="border" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">
              Page{" "}
              <strong>
                {pageIndex + 1} of {Math.ceil(filteredRows.length / pageSize) || 1}
              </strong>
            </span>

            <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger className="w-[80px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
