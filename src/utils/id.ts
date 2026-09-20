export const generateTicketNumber = (prefix = 'FIX'): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export const generateQRCode = (data: string): string => {
  const encoded = encodeURIComponent(data)
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encoded}`
}
