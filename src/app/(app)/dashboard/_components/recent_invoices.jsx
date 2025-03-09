"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export const RecentInvoicesTable = ({ invoices }) => {
  const sortedInvoices = invoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Table removeWrapper>
      <TableHeader>
        <TableColumn>Name</TableColumn>
      </TableHeader>
      <TableBody>
        {sortedInvoices.map((invoice) => {
          return (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.name}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
