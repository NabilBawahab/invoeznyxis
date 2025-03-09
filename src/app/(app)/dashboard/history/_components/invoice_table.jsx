"use client";

import {
  Button,
  Form,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { deleteInvoice } from "../action";
import Link from "next/link";

export function InvoiceTable({ invoices: invoices }) {
  return (
    <Table removeWrapper>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Recipient</TableColumn>
        <TableColumn>Address</TableColumn>
        <TableColumn className="w-0">Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No invoices"}>
        {invoices.map((invoice) => {
          return (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.name}</TableCell>
              <TableCell>{invoice.recipient}</TableCell>
              <TableCell>{invoice.recipientAddress}</TableCell>
              <TableCell>
                <div className="flex justify-between space-x-2">
                  <Link href={`/dashboard/history/${invoice.id}/edit`}>
                    <Button size="sm">Edit</Button>
                  </Link>
                  <Form action={deleteInvoice}>
                    <input name="id" defaultValue={invoice.id} hidden />
                    <Button
                      className="bg-red-500 text-white"
                      size="sm"
                      type="submit"
                    >
                      Delete
                    </Button>
                  </Form>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
