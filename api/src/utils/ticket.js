import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

export const generateTicketNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = nanoid(6).toUpperCase()
  return `FIX-${timestamp}-${random}`
}

export const generateTrackingToken = () => {
  return nanoid(24)
}

export const generateQRCode = async (ticketNumber, trackingToken) => {
  const trackingUrl = `${process.env.PUBLIC_TRACKING_URL || 'http://localhost:5173'}/track/${trackingToken}`
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#12151C', light: '#FFFFFF' }
    })
    return qrCodeDataUrl
  } catch (err) {
    console.error('QR Code generation failed:', err)
    throw err
  }
}
