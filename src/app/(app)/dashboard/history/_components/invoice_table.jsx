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
import { useActionState } from "react";

export function InvoiceTable({ invoices: invoices }) {
  const [state, formAction, pending] = useActionState(deleteInvoice, null);

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
                  <Form action={formAction}>
                    <input name="id" defaultValue={invoice.id} hidden />
                    <Button
                      className="bg-red-500 text-white"
                      size="sm"
                      type="submit"
                      isLoading={pending}
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
