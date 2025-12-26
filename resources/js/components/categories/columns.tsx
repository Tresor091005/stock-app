import { type Category } from "@/types";
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
    edit as categoriesEdit,
} from '@/routes/categories';
import { useState } from "react";
import { DeleteDialog } from "@/components/delete-dialog";
import { CellContext } from "@tanstack/react-table";

type ColumnsConfig = {
    deleteCategory: (category: Category) => void;
};

const ActionsCell = ({ row, deleteCategory }: CellContext<Category, unknown> & ColumnsConfig) => {
    const category = row.original;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteCategory(category);
        setIsDeleteDialogOpen(false);
    };

    return (
        <div className="text-right">
            <DeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Are you sure?"
                description={`This action cannot be undone. This will permanently delete the "${category.name}" category.`}
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
                        <Link href={categoriesEdit({ category: category.id }).url}>
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


export const getColumns = ({ deleteCategory }: ColumnsConfig): ColumnDef<Category>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        id: "actions",
        cell: (props) => <ActionsCell {...props} deleteCategory={deleteCategory} />,
    },
]