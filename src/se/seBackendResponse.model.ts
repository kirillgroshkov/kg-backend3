import { StringMap } from '@naturalcycles/js-lib'
import { SEAccountTM } from '@src/se/seAccount.model'
import { SEServiceTM } from '@src/se/seService.model'

export interface SEGlobalState {
  account: Partial<SEAccountTM> | null
  services: SEServiceTM[]
}

export interface SEBackendResponseTM {
  state?: Partial<SEGlobalState>

  changedServices?: StringMap<SEServiceTM | null>

  createdObjectId?: string
}
