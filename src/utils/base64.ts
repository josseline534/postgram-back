export const decodedData = (data: string) => {
  const base64Data = data.slice('Basic '.length).trim()
  const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8')
  return decodedData.split(':', 2)
}