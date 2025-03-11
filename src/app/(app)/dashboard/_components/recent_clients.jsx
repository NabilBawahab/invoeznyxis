"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export const RecentClientsTable = ({ clients }) => {
  const sortedClients = clients.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Table removeWrapper>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Address</TableColumn>
      </TableHeader>
      <TableBody>
        {sortedClients.slice(0, 5).map((client) => {
          return (
            <TableRow key={client.id}>
              <TableCell>{client.recipient}</TableCell>
              <TableCell>{client.recipientAddress}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
