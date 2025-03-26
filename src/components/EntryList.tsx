"use client"

import type { Entry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
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

interface EntryListProps {
  entries: Entry[]
  onDeleteEntry: (id: string) => void
}

export function EntryList({ entries, onDeleteEntry }: EntryListProps) {
  // Сортировка записей по дате (новые сверху)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sortedEntries.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Записей пока нет. Добавьте первую запись.</div>
  }

  // Функция для получения названия типа записи на русском
  const getEntryTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      checkup: "Осмотр",
      weight: "Взвешивание",
      feeding: "Кормление",
      shedding: "Линька",
      environment: "Параметры среды",
      medication: "Лечение",
      other: "Другое",
    }
    return types[type] || type
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">{format(parseISO(entry.date), "d MMMM yyyy", { locale: ru })}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {getEntryTypeLabel(entry.type)}
              </Badge>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие удалит запись. Это действие нельзя отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteEntry(entry.id)}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {entry.weight && (
                <div>
                  <span className="font-medium">Вес: </span>
                  {entry.weight} г
                </div>
              )}
              {entry.temperature && (
                <div>
                  <span className="font-medium">Температура: </span>
                  {entry.temperature}°C
                </div>
              )}
              {entry.humidity && (
                <div>
                  <span className="font-medium">Влажность: </span>
                  {entry.humidity}%
                </div>
              )}
              {entry.feeding && (
                <div>
                  <span className="font-medium">Кормление: </span>
                  {entry.feeding}
                </div>
              )}
              {entry.notes && (
                <div>
                  <span className="font-medium">Заметки: </span>
                  {entry.notes}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

