export default interface MessageModel {
  message: string,
  dir: string,
  date: number,
  file: string | null | undefined,
  type: string | null | undefined,
}
