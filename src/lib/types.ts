export interface Reptile {
  id: string
  name: string
  species: string
  birthDate?: string
  gender: "male" | "female" | "unknown"
  createdAt: string
}

export interface Entry {
  id: string
  reptileId: string
  date: string
  type: string
  weight?: string
  temperature?: string
  humidity?: string
  feeding?: string
  notes?: string
  createdAt: string
}

