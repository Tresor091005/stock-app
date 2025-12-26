"use client"

import { type Product } from "@/types";
import { type ColumnDef } from "@tanstack/react-table"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@inertiajs/react";
import { 
    edit as productsEdit,
    show as productsShow,
} from '@/routes/products';
import { useState } from "react";
import { DeleteDialog } from "@/components/delete-dialog";
import { CellContext } from "@tanstack/react-table";

type ColumnsConfig = {
    deleteProduct: (product: Product) => void;
};

const ActionsCell = ({ row, deleteProduct }: CellContext<Product, unknown> & ColumnsConfig) => {
    const product = row.original;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteProduct(product);
        setIsDeleteDialogOpen(false);
    };

    return (
        <div className="text-right">
            <DeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Are you sure?"
                description={`This action cannot be undone. This will permanently delete the "${product.name}" product.`}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={productsShow({ product: product.id }).url}>
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={productsEdit({ product: product.id }).url}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};


export const getColumns = ({ deleteProduct }: ColumnsConfig): ColumnDef<Product>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
 
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: "stock_quantity",
        header: "Stock Quantity",
    },
    {
        id: "actions",
        cell: (props) => <ActionsCell {...props} deleteProduct={deleteProduct} />,
    },
]