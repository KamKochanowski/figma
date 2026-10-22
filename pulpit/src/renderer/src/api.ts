import type { PulpitApi } from '../../shared/types'
import { demoApi } from './demo'

declare global {
  interface Window {
    pulpit?: PulpitApi
  }
}

/** W Electronie prawdziwe API z preload, w zwykłej przeglądarce dane przykładowe (podgląd interfejsu). */
export const api: PulpitApi = window.pulpit ?? demoApi
export const isDemo = !window.pulpit
