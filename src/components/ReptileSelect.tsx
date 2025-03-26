"use client"

import type { Reptile } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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

interface ReptileSelectProps {
  reptiles: Reptile[]
  selectedReptileId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ReptileSelect({ reptiles, selectedReptileId, onSelect, onDelete }: ReptileSelectProps) {
  if (reptiles.length === 0) {
    return <div className="text-muted-foreground">У вас пока нет добавленных рептилий</div>
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedReptileId || undefined} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите рептилию" />
        </SelectTrigger>
        <SelectContent>
          {reptiles.map((reptile) => (
            <SelectItem key={reptile.id} value={reptile.id}>
              {reptile.name} ({reptile.species})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedReptileId && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие удалит рептилию и все связанные с ней записи. Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(selectedReptileId)}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

