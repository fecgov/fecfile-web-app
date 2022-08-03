

export type WebPrint = {
  status: undefined | "in-progress" | "success" | "failure",
  result: undefined | string
  submitted: Date | undefined
}