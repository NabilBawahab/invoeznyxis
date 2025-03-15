"use client";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import React, { useActionState, useEffect, useState } from "react";
import { startTransition } from "react";
import { format } from "date-fns";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { createInvoiceAction } from "@/app/(app)/dashboard/create/_actions/create-invoice-action";

const RupiahIcon = () => {
  return <div>Rp</div>;
};

export default function CreateInvoiceForm({ session }) {
  const [state, formAction, pending] = useActionState(
    createInvoiceAction,
    null
  );

  const [type, setType] = useState("");

  const { control, register, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "INVOICE",
      dueDate: null,
      recipient: "",
      recipientEmail: "",
      recipientPhone: "",
      recipientAddress: "",
      authorId: session.user.id,
      invoiceItems: [],
      invoiceType: "",
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
    useEffect(() => {
      setValue("totalPrice", total);
    }, [total, setValue]);

    return (
      <div className="col-start-4">
        <Input
          {...register("totalPrice")}
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <form
      onSubmit={handleSubmit(submitFormAction)}
      className="w-5/6 mx-auto space-y-2 py-4"
    >
      <div>
        <Card className="grid grid-rows-1 grid-cols-12 w-full space-y-2 shadow-md p-4">
          <div className="col-span-12 ">
            <div className="space-y-2">
              <Input
                variant="flat"
                radius="sm"
                size="lg"
                label="Invoice title"
                defaultValue="INVOICE"
                isRequired
                s
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
                {...register("userName")}
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
                {...register("senderEmail")}
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
                setValue(
                  "dueDate",
                  new Date(date.year, date.month - 1, date.day)
                )
              }
              className="max-w-[300px]"
              label="Invoice due date"
            />
          </div>

          <Table
            isVirtualized
            maxTableHeight={250}
            aria-label="Invoice Item"
            radius="none"
            shadow="none"
            topContentPlacement="outside"
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
      </div>
      <p className="text-sm text-gray-500">Create cover letter with AI</p>
      <Select label="Select prompt" {...register("invoiceType")}>
        <SelectItem key="Professional and Firm">
          Professional and Firm
        </SelectItem>
        <SelectItem key="Professional and Friendly">
          Professional and Friendly
        </SelectItem>
        <SelectItem key="Professional and Detailed">
          Professional and Detailed
        </SelectItem>
        <SelectItem key=" Professional, Concise and Clear">
          Professional, Concise and Clear
        </SelectItem>
      </Select>
      <input {...register("type")} value={type} hidden />
      <input
        {...register("userOrganization")}
        defaultValue={session.user.organization}
        hidden
      />
      <div className="lg:flex justify-between items-center">
        <h3 className="font-bold text-xs  text-red-500">
          AI can make mistake, please check before proceed!
        </h3>
        <div className="space-x-2">
          <Button
            color="secondary"
            variant="ghost"
            type="button"
            radius="full"
            size="sm"
            onPress={() => {
              if (!state?.letter || !state?.subject) {
                return alert("Please generate the cover letter first");
              }
              onOpen();
            }}
          >
            Preview
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <div className="p-2">
                  <ModalHeader>
                    <Input
                      label="Email Subject"
                      defaultValue={state?.subject}
                      {...register("subject")}
                    />
                  </ModalHeader>
                  <ModalBody>
                    <Textarea
                      label="Cover Letter"
                      defaultValue={state?.letter}
                      {...register("letter")}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </div>
              )}
            </ModalContent>
          </Modal>
          <Button
            type="submit"
            onPress={() => {
              setValue("type", "generate");
            }}
            isLoading={pending}
            size="sm"
            radius="full"
            className="bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-lg font-bold"
          >
            Save & Generate
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        fullWidth
        className="mt-3 rounded-lg bg-blue-500 text-white"
        onPress={() => {
          setValue("type", "submit");
        }}
        isLoading={pending}
      >
        Create & Send Invoice
      </Button>
    </form>
  );
}
