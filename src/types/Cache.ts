export interface Cache {
  sessionID: string
  seatNo: number
}

export type TokenType =
  | {
      otp: string
      type: 'registration' | 'login' | 'general'
    }
  | undefined
