import { SEAccountTM } from '@src/se/seAccount.model'

export interface SEGlobalState {
  account: Partial<SEAccountTM> | null
}

export interface SEBackendResponseTM {
  state?: Partial<SEGlobalState>
}
