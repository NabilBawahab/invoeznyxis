"use client";

import {
  Button,
  Form,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { deleteInvoice } from "../action";
import Link from "next/link";
import { useActionState, useState } from "react";

export function InvoiceTable({ invoices: invoices }) {
  const [state, formAction, pending] = useActionState(deleteInvoice, null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemPerPage = 10;

  // example: item di database 10, lalu item per page yang kita mau adalah 10, maka pagesnya nanti cuman 1
  // math ceil ini pembulatan, misal 3/2 = 1,5. Namun di math ceil hasilnya jadi 2
  const totalPages = Math.ceil(invoices.length / itemPerPage);

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemPerPage, // index yang mau diambil mulai dari berapa
    currentPage * itemPerPage, // index akhirnya
  );

  return (
    <>
      <Table removeWrapper className="overflow-auto min-h-[400px]">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Recipient</TableColumn>
          <TableColumn>Address</TableColumn>
          <TableColumn className="w-0">Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No invoices"}>
          {paginatedInvoices.map((invoice) => {
            return (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>{invoice.recipient}</TableCell>
                <TableCell>{invoice.recipientAddress}</TableCell>
                <TableCell>
                  <div className="flex justify-between space-x-2">
                    <Link href={`/dashboard/history/${invoice.id}`}>
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
          {Array.from({ length: itemPerPage - paginatedInvoices.length }).map(
            (_, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="h-12" />
                  <TableCell className="h-12" />
                  <TableCell className="h-12" />
                  <TableCell className="h-12" />
                </TableRow>
              );
            },
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination
          initialPage={currentPage}
          total={2}
          onChange={setCurrentPage}
          isDisabled={pending}
          className="flex justify-center"
        />
      )}
    </>
  );
}
