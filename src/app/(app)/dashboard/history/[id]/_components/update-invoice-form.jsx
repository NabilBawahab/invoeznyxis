"use client";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import React, { useActionState } from "react";
import { startTransition } from "react";
import { format } from "date-fns";
import { parseDate } from "@internationalized/date";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { updateInvoiceAction } from "../_actions/update-invoice-action";

const RupiahIcon = () => {
  return <div>Rp</div>;
};

export default function UpdateInvoiceForm({ session, invoice, items }) {
  const [_, formAction, pending] = useActionState(updateInvoiceAction, null);

  const { control, register, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: invoice.name,
      dueDate: new Date(invoice.dueDate),
      recipient: invoice.recipient,
      recipientEmail: invoice.recipientEmail,
      recipientPhone: invoice.recipientPhone,
      recipientAddress: invoice.recipientAddress,
      authorId: session.user.id,
      invoiceItems: items,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems",
    rules: {
      required: "Please add at least one item",
    },
  });

  const calculateTotal = (payload) => {
    let total = 0;

    payload.forEach((item) => {
      total += item.price * item.quantity;
    });

    return total;
  };

  const SubTotal = () => {
    const payload = useWatch({
      control,
      name: "invoiceItems",
    });
    const total = calculateTotal(payload);
    return (
      <div className="col-start-4">
        <Input
          startContent={<RupiahIcon />}
          label="Sub Total"
          labelPlacement="outside-left"
          isReadOnly
          value={total}
        />
      </div>
    );
  };

  const submitFormAction = (data) => {
    startTransition(() => {
      formAction(data);
    });
  };

  return (
    <form onSubmit={handleSubmit(submitFormAction)} className="w-5/6 mx-auto">
      <Card className="grid grid-rows-1 grid-cols-12 w-full space-y-2 shadow-md p-4">
        <div className="col-span-12 ">
          <div className="space-y-2">
            <input hidden defaultValue={invoice.id} {...register("id")}></input>
            <Input
              variant="flat"
              radius="sm"
              size="lg"
              label="What is this?"
              defaultValue="Invoice"
              isRequired
              {...register("name")}
            />

            <div className="flex justify-end mb-5">
              <p>{format(new Date(), "PPP")}</p>
            </div>
          </div>
        </div>
        <div className="col-span-8 grid grid-cols-8 grid-rows-1">
          <div className="col-span-4">
            <Input
              type="text"
              variant="flat"
              radius="sm"
              size="lg"
              label="Bill to?"
              isRequired
              {...register("recipient")}
            />
          </div>
        </div>
        <div className="grid col-span-4 grid-cols-4">
          <div className="col-span-4">
            <Input
              type="text"
              variant="flat"
              radius="sm"
              size="lg"
              label="Who is this bill from?"
              isDisabled
              defaultValue={session.user.username}
            />
          </div>
        </div>
        <div className="grid col-span-8 grid-cols-8">
          <div className="col-span-4">
            <Input
              type="email"
              variant="flat"
              radius="sm"
              size="sm"
              label="receiver@contact.com"
              isRequired
              {...register("recipientEmail")}
            />
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-4 grid-rows-1">
          <div className="col-span-4">
            <Input
              type="email"
              variant="flat"
              radius="sm"
              size="sm"
              label="sender@contact.com"
              isDisabled
              defaultValue={session.user.email}
            />
          </div>
        </div>
        <div className="col-span-12 flex justify-between">
          <div>
            <div className="flex flex-row gap-x-2">
              <Input
                type="text"
                variant="flat"
                radius="sm"
                size="sm"
                label="Recipient address"
                {...register("recipientAddress")}
                isRequired
              />
              <Input
                type="text"
                variant="flat"
                radius="sm"
                size="sm"
                label="Recipient phone"
                {...register("recipientPhone")}
                isRequired
              />
            </div>
          </div>
          <DatePicker
            isRequired
            onChange={(date) =>
              setValue("dueDate", new Date(date.year, date.month - 1, date.day))
            }
            className="max-w-[300px]"
            label="Invoice due date"
            defaultValue={parseDate(
              invoice.dueDate.toISOString().split("T")[0]
            )}
          />
        </div>

        <Table
          isVirtualized
          maxTableHeight={250}
          aria-label="Invoice Item"
          radius="none"
          topContentPlacement="outside"
          shadow="none"
          classNames={{
            td: "gap-x-10",
            wrapper: "bg-inherit",
          }}
          className="col-span-12 border"
        >
          <TableHeader>
            <TableColumn className="w-1/4">Item</TableColumn>
            <TableColumn className="w-1/4">Description</TableColumn>
            <TableColumn className="w-1/6">Price</TableColumn>
            <TableColumn className="w-1/6">Quantity</TableColumn>
            <TableColumn className="w-1/12">Action</TableColumn>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              return (
                <TableRow key={field.id}>
                  <TableCell className="ps-0">
                    <Input
                      isRequired
                      variant="flat"
                      radius="sm"
                      placeholder="item name"
                      {...register(`invoiceItems.${index}.name`)}
                    />
                  </TableCell>
                  <TableCell className="ps-0">
                    <Input
                      isRequired
                      variant="flat"
                      radius="sm"
                      placeholder="item description"
                      {...register(`invoiceItems.${index}.description`)}
                    />
                  </TableCell>
                  <TableCell className="ps-0">
                    <Input
                      min={1}
                      type="number"
                      variant="flat"
                      radius="sm"
                      startContent={<RupiahIcon />}
                      {...register(`invoiceItems.${index}.price`)}
                    />
                  </TableCell>
                  <TableCell className="ps-0">
                    <Input
                      min={1}
                      type="number"
                      variant="flat"
                      radius="sm"
                      placeholder="item quantity"
                      {...register(`invoiceItems.${index}.quantity`)}
                    />
                  </TableCell>
                  <TableCell className="px-0">
                    <Button onPress={() => remove(index)} color="danger">
                      {" "}
                      <FaTrash />{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button
          onPress={() =>
            append({
              name: "",
              description: "",
              price: 1000,
              quantity: 1,
            })
          }
          startContent={<FaPlus />}
          color="secondary"
          variant="light"
        >
          Add Item
        </Button>

        <div className="col-span-12 grid grid-cols-4">
          <SubTotal />
        </div>
      </Card>
      <div>
        <p className="text-danger-500 text-sm">
          {formState.errors?.invoiceItems?.root?.message}
        </p>
      </div>
      <Button
        type="submit"
        fullWidth
        className="mt-3 rounded-lg bg-blue-500 text-white"
      >
        Update Invoice
      </Button>
    </form>
  );
}
