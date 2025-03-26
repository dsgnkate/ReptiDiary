"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { ReptileSelect } from "@/components/ReptileSelect"
import { AddEntryForm } from "@/components/AddEntryForm"
import { Stats } from "@/components/Stats"
import { EntryList } from "@/components/EntryList"
import { AddReptileForm } from "@/components/AddReptileForm"
import type { Reptile, Entry } from "@/lib/types"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"

function App() {
  const [reptiles, setReptiles] = useState<Reptile[]>([])
  const [selectedReptileId, setSelectedReptileId] = useState<string | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const savedReptiles = localStorage.getItem("reptiles")
    const savedEntries = localStorage.getItem("entries")

    if (savedReptiles) {
      const parsedReptiles = JSON.parse(savedReptiles)
      setReptiles(parsedReptiles)

      // Выбираем первую рептилию по умолчанию, если она есть
      if (parsedReptiles.length > 0 && !selectedReptileId) {
        setSelectedReptileId(parsedReptiles[0].id)
      }
    }

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("reptiles", JSON.stringify(reptiles))
  }, [reptiles])

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries))
  }, [entries])

  // Добавление новой рептилии
  const addReptile = (reptile: Reptile) => {
    const newReptiles = [...reptiles, reptile]
    setReptiles(newReptiles)
    setSelectedReptileId(reptile.id)
  }

  // Добавление новой записи
  const addEntry = (entry: Entry) => {
    setEntries([...entries, entry])
  }

  // Удаление рептилии
  const deleteReptile = (id: string) => {
    const newReptiles = reptiles.filter((reptile) => reptile.id !== id)
    setReptiles(newReptiles)

    // Удаляем все записи, связанные с этой рептилией
    const newEntries = entries.filter((entry) => entry.reptileId !== id)
    setEntries(newEntries)

    // Выбираем первую рептилию из оставшихся или null, если их нет
    if (newReptiles.length > 0) {
      setSelectedReptileId(newReptiles[0].id)
    } else {
      setSelectedReptileId(null)
    }
  }

  // Удаление записи
  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  // Фильтрация записей для выбранной рептилии
  const filteredEntries = entries.filter((entry) => entry.reptileId === selectedReptileId)

  // Получение выбранной рептилии
  const selectedReptile = reptiles.find((reptile) => reptile.id === selectedReptileId)

  return (
    <ThemeProvider defaultTheme="light" storageKey="repticare-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ReptiCare</h1>
          <ModeToggle />
        </header>

        <Separator />

        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Мои рептилии</h2>
                <div className="flex flex-col space-y-4">
                  <ReptileSelect
                    reptiles={reptiles}
                    selectedReptileId={selectedReptileId}
                    onSelect={setSelectedReptileId}
                    onDelete={deleteReptile}
                  />
                  <AddReptileForm onAddReptile={addReptile} />
                </div>
              </div>

              {selectedReptile && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Добавить запись</h2>
                  <AddEntryForm reptileId={selectedReptileId!} onAddEntry={addEntry} />
                </div>
              )}
            </div>

            <div>
              {selectedReptile && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Дневник: {selectedReptile.name}</h2>

                  <Tabs defaultValue="entries">
                    <TabsList className="mb-4">
                      <TabsTrigger value="entries">Записи</TabsTrigger>
                      <TabsTrigger value="stats">Статистика</TabsTrigger>
                    </TabsList>

                    <TabsContent value="entries">
                      <EntryList entries={filteredEntries} onDeleteEntry={deleteEntry} />
                    </TabsContent>

                    <TabsContent value="stats">
                      <Stats reptile={selectedReptile} entries={filteredEntries} />
                    </TabsContent>
                  </Tabs>
                </>
              )}

              {!selectedReptile && reptiles.length > 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Выберите рептилию из списка слева</p>
                </div>
              )}

              {reptiles.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Добавьте вашу первую рептилию, чтобы начать вести дневник</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

