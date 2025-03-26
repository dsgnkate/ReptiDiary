"use client"

import { useMemo } from "react"
import type { Reptile, Entry } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays, parseISO, format } from "date-fns"
import { ru } from "date-fns/locale"

interface StatsProps {
  reptile: Reptile
  entries: Entry[]
}

export function Stats({ reptile, entries }: StatsProps) {
  // Вычисляем статистику
  const stats = useMemo(() => {
    // Сортируем записи по дате (от старых к новым)
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Последняя запись о весе
    const lastWeightEntry = [...entries]
      .filter((entry) => entry.weight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    // Предпоследняя запись о весе для расчета изменения
    const previousWeightEntry = [...entries]
      .filter((entry) => entry.weight && entry.id !== lastWeightEntry?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    // Вычисляем изменение веса
    let weightChange = null
    if (lastWeightEntry && previousWeightEntry) {
      const lastWeight = Number.parseFloat(lastWeightEntry.weight || "0")
      const prevWeight = Number.parseFloat(previousWeightEntry.weight || "0")
      weightChange = lastWeight - prevWeight
    }

    // Последнее кормление
    const lastFeedingEntry = [...entries]
      .filter((entry) => entry.feeding)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    // Последняя линька
    const lastSheddingEntry = [...entries]
      .filter((entry) => entry.type === "shedding")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    // Возраст рептилии
    let age = null
    if (reptile.birthDate) {
      const birthDate = parseISO(reptile.birthDate)
      const ageInDays = differenceInDays(new Date(), birthDate)
      age = {
        years: Math.floor(ageInDays / 365),
        months: Math.floor((ageInDays % 365) / 30),
        days: ageInDays % 30,
      }
    }

    return {
      totalEntries: entries.length,
      firstEntryDate: sortedEntries[0]?.date,
      lastEntryDate: sortedEntries[sortedEntries.length - 1]?.date,
      lastWeight: lastWeightEntry?.weight,
      weightChange,
      lastFeeding: lastFeedingEntry?.date,
      lastShedding: lastSheddingEntry?.date,
      age,
    }
  }, [reptile, entries])

  // Функция для форматирования возраста
  const formatAge = (age: { years: number; months: number; days: number } | null) => {
    if (!age) return "Неизвестно"

    const parts = []
    if (age.years > 0) {
      parts.push(`${age.years} ${pluralize(age.years, ["год", "года", "лет"])}`)
    }
    if (age.months > 0) {
      parts.push(`${age.months} ${pluralize(age.months, ["месяц", "месяца", "месяцев"])}`)
    }
    if (age.days > 0 && age.years === 0) {
      // Показываем дни только если меньше года
      parts.push(`${age.days} ${pluralize(age.days, ["день", "дня", "дней"])}`)
    }

    return parts.join(" ")
  }

  // Функция для склонения слов
  const pluralize = (count: number, words: [string, string, string]): string => {
    const cases = [2, 0, 1, 1, 1, 2]
    return words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]]
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Общая информация</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Вид:</dt>
              <dd>{reptile.species}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Пол:</dt>
              <dd>
                {reptile.gender === "male" && "Самец"}
                {reptile.gender === "female" && "Самка"}
                {reptile.gender === "unknown" && "Неизвестно"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Возраст:</dt>
              <dd>{formatAge(stats.age)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Дата добавления:</dt>
              <dd>
                {reptile.createdAt ? format(parseISO(reptile.createdAt), "d MMMM yyyy", { locale: ru }) : "Неизвестно"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика записей</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Всего записей:</dt>
              <dd>{stats.totalEntries}</dd>
            </div>
            {stats.firstEntryDate && (
              <div className="flex justify-between">
                <dt className="font-medium">Первая запись:</dt>
                <dd>{format(parseISO(stats.firstEntryDate), "d MMMM yyyy", { locale: ru })}</dd>
              </div>
            )}
            {stats.lastEntryDate && (
              <div className="flex justify-between">
                <dt className="font-medium">Последняя запись:</dt>
                <dd>{format(parseISO(stats.lastEntryDate), "d MMMM yyyy", { locale: ru })}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Здоровье и питание</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Текущий вес:</dt>
              <dd>{stats.lastWeight ? `${stats.lastWeight} г` : "Нет данных"}</dd>
            </div>
            {stats.weightChange !== null && (
              <div className="flex justify-between">
                <dt className="font-medium">Изменение веса:</dt>
                <dd
                  className={stats.weightChange > 0 ? "text-green-600" : stats.weightChange < 0 ? "text-red-600" : ""}
                >
                  {stats.weightChange > 0 ? "+" : ""}
                  {stats.weightChange} г
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="font-medium">Последнее кормление:</dt>
              <dd>
                {stats.lastFeeding ? format(parseISO(stats.lastFeeding), "d MMMM yyyy", { locale: ru }) : "Нет данных"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Последняя линька:</dt>
              <dd>
                {stats.lastShedding
                  ? format(parseISO(stats.lastShedding), "d MMMM yyyy", { locale: ru })
                  : "Нет данных"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

