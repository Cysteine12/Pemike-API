export interface Cache {
  sessionToken: string
  seatNo: number
}

export type TokenType =
  | {
      otp: string
      type: 'registration' | 'login' | 'general'
    }
  | undefined
