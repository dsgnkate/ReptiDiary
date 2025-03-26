"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from "uuid"
import type { Reptile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  species: z.string().min(1, "Вид обязателен"),
  birthDate: z.date().optional(),
  gender: z.enum(["male", "female", "unknown"]),
})

type FormValues = z.infer<typeof formSchema>

interface AddReptileFormProps {
  onAddReptile: (reptile: Reptile) => void
}

export function AddReptileForm({ onAddReptile }: AddReptileFormProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      gender: "unknown",
    },
  })

  function onSubmit(values: FormValues) {
    const newReptile: Reptile = {
      id: uuidv4(),
      name: values.name,
      species: values.species,
      birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
      gender: values.gender,
      createdAt: new Date().toISOString(),
    }

    onAddReptile(newReptile)
    form.reset()
    setIsOpen(false)
  }

  return (
    <div>
      {!isOpen ? (
        <Button variant="outline" onClick={() => setIsOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Добавить рептилию
        </Button>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вид</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Бородатая агама" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата рождения</FormLabel>
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
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пол</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Самец</SelectItem>
                      <SelectItem value="female">Самка</SelectItem>
                      <SelectItem value="unknown">Неизвестно</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

