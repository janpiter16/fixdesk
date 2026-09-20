import React from 'react'

export const printThermalReceipt = (ticket, invoice = null) => {
  const printWindow = window.open('', '_blank', 'width=300,height=600')
  if (!printWindow) return

  const date = new Date(ticket.created_at).toLocaleDateString('id-ID')
  const qrUrl = ticket.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/track/' + ticket.tracking_token)}`

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FixDesk Receipt</title>
      <style>
        @page { margin: 0; }
        body {
          font-family: monospace;
          width: 58mm;
          margin: 0;
          padding: 8px;
          color: #000;
          font-size: 11px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        .qr-container { text-align: center; margin: 8px 0; }
        .qr-container img { width: 100px; height: 100px; }
      </style>
    </head>
    <body>
      <div class="text-center bold" style="font-size: 14px;">FIXDESK WORKSHOP</div>
      <div class="text-center" style="font-size: 9px;">Sistem Servis & Reparasi</div>
      <div class="divider"></div>

      <div>No: <span class="bold">${ticket.ticket_number}</span></div>
      <div>Tgl: ${date}</div>
      <div>Cust: ${ticket.customer_name}</div>
      <div>Unit: ${ticket.device_brand || ''} ${ticket.device_model || ''}</div>
      <div class="divider"></div>

      <div>Keluhan:</div>
      <div style="font-size: 10px;">${ticket.issue_description}</div>
      <div class="divider"></div>

      ${
        invoice
          ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Jasa:</span>
            <span>Rp ${Number(invoice.subtotal_service).toLocaleString('id-ID')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Part:</span>
            <span>Rp ${Number(invoice.subtotal_parts).toLocaleString('id-ID')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;" class="bold">
            <span>TOTAL:</span>
            <span>Rp ${Number(invoice.total_amount).toLocaleString('id-ID')}</span>
          </div>
          <div class="divider"></div>
        `
          : ''
      }

      <div class="qr-container">
        <img src="${qrUrl}" alt="QR" />
        <div style="font-size: 8px;">Scan untuk Cek Status</div>
      </div>

      <div class="text-center" style="font-size: 8px; margin-top: 6px;">
        Simpan struk ini sebagai bukti pengambilan unit & klaim garansi resmi.
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(content)
  printWindow.document.close()
}
