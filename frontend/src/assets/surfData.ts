export interface SurfSpotMock {
  id: string
  name: string
  region: string
  score: number
  waveHeight: string
  period: string
  wind: string
  tide: string
  condition: string
  imageUrl: string
}

export const FEATURED_SPOTS: SurfSpotMock[] = [
  {
    id: 'mundaka',
    name: 'Mundaka',
    region: 'Basque Country, ES',
    score: 9.4,
    waveHeight: '2.2m',
    period: '14s',
    wind: '7kt Off-shore',
    tide: 'Mid Rising',
    condition: 'Epic Barrels',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'salinas',
    name: 'Salinas',
    region: 'Asturias, ES',
    score: 8.7,
    waveHeight: '1.6m',
    period: '12s',
    wind: '5kt Light Cross',
    tide: 'Low Turning',
    condition: 'Clean & Peaking',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rodriles',
    name: 'Rodiles',
    region: 'Asturias, ES',
    score: 9.1,
    waveHeight: '1.9m',
    period: '13s',
    wind: '4kt Off-shore',
    tide: 'Low Incoming',
    condition: 'Hollow Lefts',
    imageUrl: 'https://images.unsplash.com/photo-1471922694855-fa59ac7f79ad?auto=format&fit=crop&w=800&q=80'
  }
]

export const QUIVER_MOCKS = [
  {
    id: 'hypto',
    name: 'Haydenshapes Hypto Krypto',
    dims: "5'8 x 19 7/8 x 2 3/8",
    volume: '31.0L',
    finSetup: 'Thruster / Quad',
    matchScore: '98% match today',
    imageUrl: 'https://images.unsplash.com/photo-1531722564234-525048d070b4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'midlength',
    name: 'Channel Islands CI Mid',
    dims: "6'10 x 20 7/8 x 2 11/16",
    volume: '44.9L',
    finSetup: '2 + 1 Fin',
    matchScore: '92% match tomorrow',
    imageUrl: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=600&q=80'
  }
]
