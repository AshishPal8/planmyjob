import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export interface ColumnConfig {
  accessorKey: string;
  header: string;
  className?: string;
  render?: (row: Record<string, any>) => React.ReactNode;
}

export interface DataTableProps {
  columns: ColumnConfig[];
  data: Record<string, any>[];
  className?: string;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  className,
  emptyMessage = "No records found",
}: DataTableProps) {
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.accessorKey} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground font-medium"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={row.id ?? idx}>
                {columns.map((col) => (
                  <TableCell key={col.accessorKey} className={col.className}>
                    {col.render
                      ? col.render(row)
                      : (row[col.accessorKey] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
