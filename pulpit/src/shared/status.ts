import type { BrandSource, TaskStatus } from './types'

// Statusy zadań w kolejności, w jakiej idzie zlecenie. Kolory to farby procesowe:
// cyjan pracuje, magenta woła o ruch Kamila, żółty czeka na klienta, czerń jest zamknięta.
export const TASK_FLOW: { id: TaskStatus; label: string; ink: 'c' | 'm' | 'y' | 'k' | 'paper' }[] = [
  { id: 'w_trakcie', label: 'W trakcie', ink: 'c' },
  { id: 'do_sprawdzenia', label: 'Do sprawdzenia', ink: 'c' },
  { id: 'do_akceptacji', label: 'Do akceptacji', ink: 'm' },
  { id: 'do_wyslania', label: 'Do wysłania', ink: 'm' },
  { id: 'wyslane', label: 'Wysłane', ink: 'y' },
  { id: 'czeka_na_klienta', label: 'Czeka na klienta', ink: 'y' },
  { id: 'rekrutacja', label: 'Rekrutacja', ink: 'y' },
  { id: 'do_rozliczenia', label: 'Do rozliczenia', ink: 'paper' },
  { id: 'zamkniete', label: 'Zamknięte', ink: 'k' }
]

export function taskStatusLabel(s: string): string {
  return TASK_FLOW.find((f) => f.id === s)?.label ?? s.replace(/_/g, ' ')
}

export function taskInk(s: string): string {
  return TASK_FLOW.find((f) => f.id === s)?.ink ?? 'k'
}

export const BRAND_STATUS_LABEL: Record<string, string> = {
  aktywna: 'Aktywna',
  czeka: 'Czeka',
  zamknieta: 'Zamknięta',
  rekrutacja: 'Rekrutacja'
}

export const SOURCE_LABEL: Record<BrandSource, string> = {
  useme: 'Useme',
  agencja: 'Agencja',
  bezposrednio: 'Bezpośrednio',
  etat: 'Etat',
  inne: 'Inne'
}

/** Po ilu dniach ciszy klient trafia na listę „przypomnij się” */
export const SILENCE_DAYS = 5
