"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Track } from "@/lib/types"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Trash, Edit, Star } from "lucide-react"
import { updateTrackStatus, deleteTrack } from "../actions"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const StatusToggle = ({ trackId, field, value, toast }: { trackId: string, field: 'published' | 'featured', value: boolean, toast: any }) => {
  const handleToggle = async () => {
    try {
      await updateTrackStatus(trackId, field, !value)
      toast({ title: "Success", description: `Track ${field} status updated.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to update track. ${error instanceof Error ? error.message : ''}` })
    }
  }

  return <Switch checked={value} onCheckedChange={handleToggle} aria-label={`Toggle ${field}`} />
}

export const columns: ColumnDef<Track>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const track = row.original;
        return (
            <div className="font-medium flex items-center gap-2">
                {track.title}
                {track.featured && <Badge variant="secondary"><Star className="mr-1 h-3 w-3"/>Featured</Badge>}
            </div>
        )
    }
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    cell: ({ row }) => {
      const date = row.original.releaseDate.toDate()
      return format(date, "PPP")
    },
  },
  {
    accessorKey: "published",
    header: "Published",
    cell: ({ row }) => {
      const { toast } = useToast()
      return <StatusToggle trackId={row.original.id} field="published" value={row.original.published} toast={toast} />
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const { toast } = useToast()
      return <StatusToggle trackId={row.original.id} field="featured" value={row.original.featured} toast={toast} />
    },
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const track = row.original
      const { toast } = useToast()

      return (
        <AlertDialog>
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
                <Link href={`/admin/tracks/${track.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the track
                "{track.title}" and its associated files from the servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    await deleteTrack(track.id);
                    toast({ title: "Success", description: "Track deleted successfully." });
                  } catch (error) {
                    toast({ variant: "destructive", title: "Error", description: `Failed to delete track. ${error instanceof Error ? error.message : ''}` });
                  }
                }}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
