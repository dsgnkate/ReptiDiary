"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from "uuid"
import type { Entry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  date: z.date(),
  type: z.string().min(1, "Тип записи обязателен"),
  weight: z.string().optional(),
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  feeding: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddEntryFormProps {
  reptileId: string
  onAddEntry: (entry: Entry) => void
}

export function AddEntryForm({ reptileId, onAddEntry }: AddEntryFormProps) {
  const [showWeightField, setShowWeightField] = useState(false)
  const [showEnvironmentFields, setShowEnvironmentFields] = useState(false)
  const [showFeedingField, setShowFeedingField] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: "",
      notes: "",
    },
  })

  const entryType = form.watch("type")

  // Обновляем видимость полей при изменении типа записи
  useState(() => {
    setShowWeightField(entryType === "weight" || entryType === "checkup")
    setShowEnvironmentFields(entryType === "environment" || entryType === "checkup")
    setShowFeedingField(entryType === "feeding" || entryType === "checkup")
  })

  function onSubmit(values: FormValues) {
    const newEntry: Entry = {
      id: uuidv4(),
      reptileId,
      date: values.date.toISOString(),
      type: values.type,
      weight: values.weight,
      temperature: values.temperature,
      humidity: values.humidity,
      feeding: values.feeding,
      notes: values.notes,
      createdAt: new Date().toISOString(),
    }

    onAddEntry(newEntry)
    form.reset({
      date: new Date(),
      type: "",
      notes: "",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип записи</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setShowWeightField(value === "weight" || value === "checkup")
                  setShowEnvironmentFields(value === "environment" || value === "checkup")
                  setShowFeedingField(value === "feeding" || value === "checkup")
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип записи" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="checkup">Осмотр</SelectItem>
                  <SelectItem value="weight">Взвешивание</SelectItem>
                  <SelectItem value="feeding">Кормление</SelectItem>
                  <SelectItem value="shedding">Линька</SelectItem>
                  <SelectItem value="environment">Параметры среды</SelectItem>
                  <SelectItem value="medication">Лечение</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showWeightField && (
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Вес (г)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Введите вес в граммах" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showEnvironmentFields && (
          <>
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Температура (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Введите температуру" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="humidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Влажность (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Введите влажность" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {showFeedingField && (
          <FormField
            control={form.control}
            name="feeding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Кормление</FormLabel>
                <FormControl>
                  <Input placeholder="Что и сколько съел" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заметки</FormLabel>
              <FormControl>
                <Textarea placeholder="Дополнительная информация" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Добавить запись
        </Button>
      </form>
    </Form>
  )
}

