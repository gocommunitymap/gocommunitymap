import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getBookingAPI } from 'src/configs/services/api-methods/guest'
import { defaultPageFont } from 'src/@core/utils'
import GuestBlankLayout from 'src/@core/layouts/GuestLayoutAppBar'
import SeoHead from 'src/components/SeoHead'
import themeConfig from 'src/configs/themeConfig'
import CompanyLogo from 'src/@core/components/company-logo'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Button, Stack, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = n => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = dateStr => {
  if (!dateStr) return '—'

  // Strip time component if present (e.g. "2026-04-23T00:00:00" → "2026-04-23")
  const datePart = String(dateStr).split('T')[0]
  const [y, m, d] = datePart.split('-').map(Number)
  if (!y || !m || !d) return dateStr

  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const today = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

// ─── invoice component ───────────────────────────────────────────────────────

const HotelBookingInvoice = () => {
  const router = useRouter()
  const { ref } = router.query
  const invoiceRef = useRef(null)

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [downloading, setDownloading] = useState(false)

  // Fetch booking
  useEffect(() => {
    if (!ref) return
    setLoading(true)
    getBookingAPI({ BOOKING_NO: ref })
      .then(res => {
        const record = res?.data?.[0] || null
        if (record) {
          setBooking(record)
        } else {
          setError('Booking not found')
        }
      })
      .catch(() => setError('Could not load booking'))
      .finally(() => setLoading(false))
  }, [ref])

  // Build QR data URL once booking is loaded
  useEffect(() => {
    if (!booking) return
    const bookingUrl = `${window.location.origin}/hotels/booking/scan/${booking.BOOKING_NO || ref}`
    import('qrcode').then(({ default: QRCode }) => {
      QRCode.toDataURL(bookingUrl, {
        width: 200,
        margin: 1,
        color: { dark: '#1a7d4d', light: '#ffffff' }
      }).then(url => setQrDataUrl(url))
    })
  }, [booking, ref])

  // PDF download using jsPDF + autoTable (programmatic — no page-break issues)
  const handleDownloadPDF = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const W = doc.internal.pageSize.getWidth()
      const H = doc.internal.pageSize.getHeight()
      const M = 14
      const CW = W - M * 2

      let curY = 0

      // Add a new page if `needed` mm won't fit before the footer zone
      const ensureSpace = needed => {
        if (curY + needed > H - 20) {
          doc.addPage()
          curY = 14
        }
      }

      // ── HEADER ───────────────────────────────────────────────────────────
      doc.setFillColor(26, 125, 77)
      doc.rect(0, 0, W, 42, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Go Community Map', M, 14)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Hotel Booking', M, 22)

      doc.setFontSize(8)
      doc.text('INVOICE', W - M, 10, { align: 'right' })
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(`#${booking.BOOKING_NO}`, W - M, 20, { align: 'right' })

      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(0.5)
      doc.roundedRect(W - M - 26, 26, 26, 7, 2, 2, 'S')
      doc.setFontSize(8)
      doc.text(status, W - M - 13, 31, { align: 'center' })

      curY = 46

      // ── META ROW ─────────────────────────────────────────────────────────
      doc.setFillColor(249, 253, 251)
      doc.rect(0, 40, W, 12, 'F')
      doc.setDrawColor(200, 235, 215)
      doc.setLineWidth(0.3)
      doc.line(0, 52, W, 52)

      const metaItems = [
        ['Issue Date', today()],
        ['Booking Date', fmtDate(booking.CREATED_ON) !== '\u2014' ? fmtDate(booking.CREATED_ON) : today()],
        ['Payment Method', booking.PAYMENT_METHOD || 'Credit Card']
      ]
      metaItems.forEach(([label, value], i) => {
        const x = M + i * (CW / 4)
        doc.setTextColor(136, 136, 136)
        doc.setFontSize(6.5)
        doc.setFont('helvetica', 'normal')
        doc.text(label.toUpperCase(), x, 45)
        doc.setTextColor(51, 51, 51)
        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.text(value, x, 51)
      })

      curY = 58

      // ── BILLED TO / PROPERTY / STAY PERIOD ───────────────────────────────
      const col3 = CW / 3

      // Billed To
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('BILLED TO', M, curY)
      doc.setTextColor(26, 26, 26)
      doc.setFontSize(11)
      doc.text(guestName, M, curY + 6)
      let billedY = curY + 12
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(85, 85, 85)
      if (booking.GUEST_EMAIL) {
        doc.text(booking.GUEST_EMAIL, M, billedY)
        billedY += 4.5
      }
      if (booking.GUEST_PHONE) {
        doc.text(booking.GUEST_PHONE, M, billedY)
        billedY += 4.5
      }
      if (booking.GUEST_COUNTRY) {
        doc.text(booking.GUEST_COUNTRY, M, billedY)
        billedY += 4.5
      }

      // Property
      const propX = M + col3
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('PROPERTY', propX, curY)
      doc.setTextColor(26, 26, 26)
      doc.setFontSize(11)
      const propNameLines = doc.splitTextToSize(booking.PROPERTY_NAME || 'Hotel Property', col3 - 6)
      doc.text(propNameLines, propX, curY + 6)
      let propY = curY + 6 + propNameLines.length * 5.5
      if (booking.PLACE) {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(85, 85, 85)
        const placeLines = doc.splitTextToSize(booking.PLACE, col3 - 6)
        doc.text(placeLines, propX, propY)
        propY += placeLines.length * 4.5
      }

      // Stay Period
      const stayX = M + col3 * 2
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('STAY PERIOD', stayX, curY)
      let stayY = curY + 6

      const drawStayDate = (label, dateStr, hint, hintColor) => {
        doc.setTextColor(136, 136, 136)
        doc.setFontSize(6.5)
        doc.setFont('helvetica', 'normal')
        doc.text(label, stayX, stayY)
        stayY += 4
        doc.setTextColor(26, 26, 26)
        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.text(dateStr, stayX, stayY, { maxWidth: col3 - 4 })
        stayY += 4.5
        doc.setTextColor(...hintColor)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(hint, stayX, stayY)
        stayY += 6
      }
      drawStayDate('CHECK-IN', fmtDate(booking.CHECK_IN), 'From 3:00 PM', [39, 174, 96])
      drawStayDate('CHECK-OUT', fmtDate(booking.CHECK_OUT), 'By 11:00 AM', [230, 126, 34])

      curY = Math.max(billedY, propY, stayY) + 8

      // Divider
      doc.setDrawColor(200, 235, 215)
      doc.setLineWidth(0.4)
      doc.line(M, curY, W - M, curY)
      curY += 6

      // ── STAY DETAILS ─────────────────────────────────────────────────────
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('STAY DETAILS', M, curY)
      curY += 2

      const detailH = 17
      doc.setFillColor(249, 253, 251)
      doc.setDrawColor(200, 235, 215)
      doc.roundedRect(M, curY, CW, detailH, 2, 2, 'FD')

      const detailItems = [
        ['NIGHTS', `${nights} night${nights !== 1 ? 's' : ''}`],
        ['ROOMS', `${rooms} room${rooms !== 1 ? 's' : ''}`],
        ['ADULTS', `${booking.ADULTS || 1} adult${Number(booking.ADULTS) !== 1 ? 's' : ''}`],
        ['CHILDREN', `${booking.CHILDREN || 0}`],
        ['EXPECTED ARRIVAL', booking.ARRIVAL_TIME || '\u2014']
      ]
      const detColW = CW / detailItems.length
      detailItems.forEach(([label, value], i) => {
        const cx = M + i * detColW + detColW / 2
        doc.setTextColor(136, 136, 136)
        doc.setFontSize(6)
        doc.setFont('helvetica', 'normal')
        doc.text(label, cx, curY + 6, { align: 'center', maxWidth: detColW - 2 })
        doc.setTextColor(51, 51, 51)
        doc.setFontSize(8.5)
        doc.setFont('helvetica', 'bold')
        doc.text(value, cx, curY + 13, { align: 'center', maxWidth: detColW - 2 })
      })
      curY += detailH + 8

      // ── CHARGES TABLE ─────────────────────────────────────────────────────
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('CHARGES', M, curY)
      curY += 2

      autoTable(doc, {
        startY: curY,
        head: [['Description', 'Unit Price', 'Nights \u00D7 Rooms', 'Amount ($)']],
        body: [
          [
            {
              content: `${booking.PROPERTY_NAME || 'Hotel Room'}\n${
                booking.ROOM_NAME ? `Room: ${booking.ROOM_NAME}` : 'Standard Room'
              } \u00B7 ${fmtDate(booking.CHECK_IN)} \u2192 ${fmtDate(booking.CHECK_OUT)}`,
              styles: { fontStyle: 'bold' }
            },
            ratePerNight > 0 ? `$ ${fmt(ratePerNight)}` : '\u2014',
            `${nights} \u00D7 ${rooms}`,
            `$ ${fmt(subtotal)}`
          ],
          [
            { content: 'Taxes & Service Fees\nPlatform & local taxes included', styles: { fontStyle: 'bold' } },
            '\u2014',
            '1',
            `$ ${fmt(serviceFee)}`
          ]
        ],
        foot: [
          [{ content: '', colSpan: 2 }, 'Subtotal', `$ ${fmt(subtotal)}`],
          [{ content: '', colSpan: 2 }, 'Taxes & Fees', `$ ${fmt(serviceFee)}`],
          [
            { content: '', colSpan: 2 },
            {
              content: 'Total Paid',
              styles: { fillColor: [26, 125, 77], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 12 }
            },
            {
              content: `$ ${fmt(total)}`,
              styles: { fillColor: [26, 125, 77], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 12 }
            }
          ]
        ],
        headStyles: { fillColor: [26, 125, 77], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        footStyles: { fontStyle: 'bold', fontSize: 9, fillColor: [255, 255, 255], textColor: [51, 51, 51] },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { halign: 'right', cellWidth: 27 },
          2: { halign: 'right', cellWidth: 27 },
          3: { halign: 'right', cellWidth: 28, textColor: [26, 125, 77] }
        },
        alternateRowStyles: { fillColor: [249, 253, 251] },
        margin: { left: M, right: M }
      })

      curY = doc.lastAutoTable.finalY + 8

      // ── QR + BOOKING REF (always on same page) ────────────────────────────
      const qrBoxH = 52
      ensureSpace(qrBoxH + 2)

      doc.setFillColor(249, 253, 251)
      doc.setDrawColor(200, 235, 215)
      doc.setLineWidth(0.5)
      doc.roundedRect(M, curY, CW, qrBoxH, 3, 3, 'FD')

      // Embed QR image (already a data URL — no fetch needed)
      if (qrDataUrl) {
        try {
          doc.addImage(qrDataUrl, 'PNG', M + 4, curY + 5, 38, 38)
        } catch {
          /* skip QR if addImage fails */
        }
      }
      doc.setTextColor(136, 136, 136)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.text('SCAN TO VERIFY', M + 23, curY + 46, { align: 'center' })

      // Reference text
      const refX = M + 48
      doc.setTextColor(39, 174, 96)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('BOOKING REFERENCE', refX, curY + 9)
      doc.setFontSize(16)
      doc.text(`#${booking.BOOKING_NO}`, refX, curY + 20)

      const verifyLines = doc.splitTextToSize(
        'Scan the QR code or visit the link below to view and verify this booking online.',
        CW - 62 - 30
      )
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(85, 85, 85)
      doc.text(verifyLines, refX, curY + 30)
      doc.setTextColor(39, 174, 96)
      doc.text(
        `${window.location.origin}/hotels/booking/scan/${booking.BOOKING_NO}`,
        refX,
        curY + 30 + verifyLines.length * 4,
        { maxWidth: CW - 62 - 30 }
      )

      // Status badge
      const statusRgb = status === 'CONFIRMED' ? [39, 174, 96] : status === 'CANCELLED' ? [229, 57, 53] : [245, 158, 11]
      doc.setFillColor(...statusRgb)
      doc.roundedRect(W - M - 28, curY + 16, 28, 10, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(status, W - M - 14, curY + 23, { align: 'center' })
      doc.setTextColor(136, 136, 136)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.text('BOOKING STATUS', W - M - 14, curY + 31, { align: 'center' })

      curY += qrBoxH + 8

      // ── NOTES ─────────────────────────────────────────────────────────────
      const noteText =
        'Free cancellation available until 48 hours before check-in. Modifications subject to availability and rate changes. Present this invoice or your booking reference at the property reception. For support, contact us at support@gocommunitymap.com.'
      const noteLines = doc.splitTextToSize(noteText, CW - 12)
      const noteBoxH = 10 + noteLines.length * 4.5
      ensureSpace(noteBoxH + 4)

      doc.setFillColor(255, 248, 231)
      doc.rect(M, curY, CW, noteBoxH, 'F')
      doc.setFillColor(245, 158, 11)
      doc.rect(M, curY, 2.5, noteBoxH, 'F')
      doc.setTextColor(146, 100, 10)
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      doc.text('Booking Notes & Cancellation Policy', M + 6, curY + 6)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(noteLines, M + 6, curY + 12)

      // ── FOOTER (all pages) ─────────────────────────────────────────────────
      const totalPages = doc.internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        const fY = H - 12
        doc.setFillColor(30, 30, 45)
        doc.rect(0, fY - 6, W, 20, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('GoCommunityMap', M, fY)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text('Hotel Booking Services \u00B7 www.gocommunitymap.com', M, fY + 5)
        doc.text('This is a computer-generated invoice and does not require a signature.', W - M, fY, {
          align: 'right'
        })
        doc.text('\u00A9 2026 GoCommunityMap. All rights reserved.', W - M, fY + 5, { align: 'right' })
      }

      doc.save(`Invoice-${ref}.pdf`)
    } catch (e) {
      console.error('PDF generation failed', e)
      window.print()
    } finally {
      setDownloading(false)
    }
  }

  // ── derived values ──────────────────────────────────────────────────────
  const nights = Number(booking?.NIGHTS || 1)
  const rooms = Number(booking?.ROOMS || 1)
  const subtotal = Number(booking?.SUBTOTAL || 0)
  const serviceFee = Number(booking?.SERVICE_FEE || 0)
  const total = Number(booking?.TOTAL || 0)
  const ratePerNight = nights > 0 && rooms > 0 ? subtotal / nights / rooms : 0

  const guestName = `${booking?.GUEST_FIRST_NAME || ''} ${booking?.GUEST_LAST_NAME || ''}`.trim() || '—'
  const status = (booking?.STATUS || 'CONFIRMED').toUpperCase()
  const statusColor = status === 'CONFIRMED' ? '#27ae60' : status === 'CANCELLED' ? '#e53935' : '#f59e0b'

  // ── print style (injected once) ─────────────────────────────────────────
  const printStyle = `
    @media print {
      .gcm-invoice-actions { display: none !important; }
      .gcm-invoice-appbar  { display: none !important; }
      body { background: #fff !important; }
      .gcm-invoice-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
    }
  `

  if (loading) {
    return (
      <div style={{ fontFamily: defaultPageFont, textAlign: 'center', padding: '80px 20px', color: '#666' }}>
        <p style={{ fontSize: 16 }}>Loading invoice…</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div style={{ fontFamily: defaultPageFont, textAlign: 'center', padding: '80px 20px', color: '#555' }}>
        <p style={{ fontSize: 20, fontWeight: 700 }}>Booking not found</p>
        <button
          onClick={() => router.push('/account/bookings')}
          style={{
            marginTop: 20,
            padding: '10px 28px',
            borderRadius: 8,
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            fontFamily: defaultPageFont,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          My Bookings
        </button>
      </div>
    )
  }

  return (
    <>
      <SeoHead
        title={`Invoice #${booking.BOOKING_NO} – GoCommunityMap`}
        description={`Hotel booking invoice for ${guestName}`}
      />
      <Head>
        <style>{printStyle}</style>
      </Head>

      {/* ── Action bar (hidden on print) ── */}
      <div
        className='gcm-invoice-actions'
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#fff',
          borderBottom: '1px solid #eee',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        <Stack direction='row' spacing={1.2} alignItems='center'>
          <CompanyLogo width='36' />
          <Typography variant='h6' sx={{ color: '#0b1730', fontWeight: 800, fontFamily: defaultPageFont }}>
            {themeConfig.templateName}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={1.2} alignItems='center'>
          <button onClick={() => router.back()} style={btnStyle('outline')}>
            <Stack direction='row' spacing={1.2} alignItems='center'>
              <IconifyIcon width={20} icon='mdi:arrow-left' /> Back
            </Stack>
          </button>
          <Button onClick={() => window.print()} style={btnStyle('outline')}>
            <IconifyIcon width={20} icon='mdi:printer' /> Print
          </Button>
          <Button onClick={handleDownloadPDF} disabled={downloading} style={btnStyle('primary')}>
            {downloading ? (
              'Generating…'
            ) : (
              <>
                <IconifyIcon width={20} icon='mdi:download' /> Download PDF
              </>
            )}
          </Button>
        </Stack>
      </div>

      {/* ── Page wrapper ── */}
      <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '32px 16px 64px' }}>
        {/* ── Invoice document ── */}
        <div
          ref={invoiceRef}
          className='gcm-invoice-page'
          style={{
            maxWidth: 820,
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            fontFamily: defaultPageFont
          }}
        >
          {/* ──────────── HEADER ──────────── */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a7d4d 0%, #27ae60 60%, #2ecc71 100%)',
              padding: '36px 48px 28px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            {/* Left: brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <CompanyLogo />
                <span style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>
                  {themeConfig.templateName}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 13 }}>Hotel Booking</p>
            </div>

            {/* Right: INVOICE label */}
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  margin: '0 0 2px',
                  letterSpacing: 3,
                  textTransform: 'uppercase'
                }}
              >
                Invoice
              </p>
              <p style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 4px', letterSpacing: 1 }}>
                #{booking.BOOKING_NO}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: 20,
                  letterSpacing: 1.5,
                  border: '1px solid rgba(255,255,255,0.4)'
                }}
              >
                {status}
              </span>
            </div>
          </div>

          {/* ──────────── META ROW ──────────── */}
          <div
            style={{
              backgroundColor: '#f9fdfb',
              borderBottom: '1px solid #e8f5ef',
              padding: '14px 48px',
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap'
            }}
          >
            {[
              { label: 'Issue Date', value: today() },
              {
                label: 'Booking Date',
                value: fmtDate(booking.CREATED_ON) !== '—' ? fmtDate(booking.CREATED_ON) : today()
              },
              { label: 'Payment Method', value: booking.PAYMENT_METHOD || 'Credit Card' }
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {label}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#333' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ──────────── BILLED TO / FROM ──────────── */}
          <div style={{ padding: '28px 48px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {/* Billed To */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={sectionLabel}>Billed To</p>
              <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{guestName}</p>
              {booking.GUEST_EMAIL && (
                <p style={{ margin: '0 0 2px', fontSize: 13, color: '#555' }}>{booking.GUEST_EMAIL}</p>
              )}
              {booking.GUEST_PHONE && (
                <p style={{ margin: '0 0 2px', fontSize: 13, color: '#555' }}>{booking.GUEST_PHONE}</p>
              )}
              {booking.GUEST_COUNTRY && (
                <p style={{ margin: 0, fontSize: 13, color: '#555' }}>{booking.GUEST_COUNTRY}</p>
              )}
            </div>

            {/* Property */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={sectionLabel}>Property</p>
              <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                {booking.PROPERTY_NAME || 'Hotel Property'}
              </p>
              {booking.PLACE && <p style={{ margin: '0 0 2px', fontSize: 13, color: '#555' }}>{booking.PLACE}</p>}
            </div>

            {/* Stay Period */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={sectionLabel}>Stay Period</p>
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <p
                    style={{
                      margin: '0 0 2px',
                      fontSize: 10,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    Check-in
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#333' }}>{fmtDate(booking.CHECK_IN)}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 11, color: '#27ae60' }}>From 3:00 PM</p>
                </div>
                <div>
                  <p
                    style={{
                      margin: '0 0 2px',
                      fontSize: 10,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    Check-out
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#333' }}>
                    {fmtDate(booking.CHECK_OUT)}
                  </p>
                  <p style={{ margin: '1px 0 0', fontSize: 11, color: '#e67e22' }}>By 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: '#eef5f1', margin: '0 48px' }} />

          {/* ──────────── BOOKING SUMMARY ──────────── */}
          <div style={{ padding: '24px 48px' }}>
            <p style={sectionLabel}>Stay Details</p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                backgroundColor: '#f9fdfb',
                borderRadius: 10,
                border: '1px solid #e8f5ef',
                padding: '16px 20px'
              }}
            >
              {[
                { icon: '🌙', label: 'Nights', value: `${nights} night${nights !== 1 ? 's' : ''}` },
                { icon: '🚪', label: 'Rooms', value: `${rooms} room${rooms !== 1 ? 's' : ''}` },
                {
                  icon: '👤',
                  label: 'Adults',
                  value: `${booking.ADULTS || 1} adult${Number(booking.ADULTS) !== 1 ? 's' : ''}`
                },
                { icon: '👶', label: 'Children', value: `${booking.CHILDREN || 0}` },
                { icon: '🕐', label: 'Expected Arrival', value: booking.ARRIVAL_TIME || '—' }
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ flex: '1 1 130px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 20 }}>{icon}</p>
                  <p
                    style={{
                      margin: '0 0 2px',
                      fontSize: 10,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#333' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ──────────── LINE ITEMS TABLE ──────────── */}
          <div style={{ padding: '0 48px 24px' }}>
            <p style={sectionLabel}>Charges</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#1a7d4d' }}>
                  {['Description', 'Unit Price', 'Nights × Rooms', 'Amount ($)'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 14px',
                        color: '#fff',
                        fontWeight: 700,
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: 12,
                        letterSpacing: 0.5
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Room charge row */}
                <tr style={{ backgroundColor: '#f9fdfb', borderBottom: '1px solid #e8f5ef' }}>
                  <td style={{ padding: '12px 14px', color: '#333', fontWeight: 600 }}>
                    <p style={{ margin: 0 }}>{booking.PROPERTY_NAME || 'Hotel Room'}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>
                      {booking.ROOM_NAME ? `Room: ${booking.ROOM_NAME}` : 'Standard Room'} · {fmtDate(booking.CHECK_IN)}{' '}
                      → {fmtDate(booking.CHECK_OUT)}
                    </p>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>
                    {ratePerNight > 0 ? `$ ${fmt(ratePerNight)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>
                    {nights} × {rooms}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#27ae60' }}>
                    $ {fmt(subtotal)}
                  </td>
                </tr>

                {/* Service / taxes row */}
                <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #e8f5ef' }}>
                  <td style={{ padding: '12px 14px', color: '#333', fontWeight: 600 }}>
                    Taxes &amp; Service Fees
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#888' }}>
                      Platform &amp; local taxes included
                    </p>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>—</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>1</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#555' }}>
                    $ {fmt(serviceFee)}
                  </td>
                </tr>
              </tbody>

              {/* Totals */}
              <tfoot>
                <tr style={{ borderTop: '2px solid #e8f5ef' }}>
                  <td colSpan={3} style={{ padding: '10px 14px', textAlign: 'right', color: '#555', fontSize: 13 }}>
                    Subtotal
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#333', fontWeight: 600 }}>
                    $ {fmt(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ padding: '6px 14px', textAlign: 'right', color: '#555', fontSize: 13 }}>
                    Taxes &amp; Fees
                  </td>
                  <td style={{ padding: '6px 14px', textAlign: 'right', color: '#333', fontWeight: 600 }}>
                    $ {fmt(serviceFee)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#1a7d4d' }}>
                  <td
                    colSpan={3}
                    style={{ padding: '14px 14px', textAlign: 'right', color: '#fff', fontWeight: 800, fontSize: 14 }}
                  >
                    Total Paid
                  </td>
                  <td
                    style={{ padding: '14px 14px', textAlign: 'right', color: '#fff', fontWeight: 900, fontSize: 18 }}
                  >
                    $ {fmt(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ──────────── QR + BOOKING REF ──────────── */}
          <div
            style={{
              margin: '0 48px 32px',
              padding: '24px 28px',
              backgroundColor: '#f9fdfb',
              border: '1.5px solid #c8ebd7',
              borderRadius: 12,
              display: 'flex',
              gap: 32,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {/* QR Code */}
            <div style={{ textAlign: 'center' }}>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR for booking ${booking.BOOKING_NO}`}
                  width={140}
                  height={140}
                  style={{ display: 'block', borderRadius: 8, border: '1px solid #e0efe8' }}
                />
              ) : (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 8,
                    backgroundColor: '#e8f5ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 36,
                    border: '1px solid #c8ebd7'
                  }}
                >
                  ▦
                </div>
              )}
              <p style={{ margin: '8px 0 0', fontSize: 10, color: '#888', letterSpacing: 1 }}>SCAN TO VERIFY</p>
            </div>

            {/* Booking reference info */}
            <div style={{ flex: 1 }}>
              <p style={{ ...sectionLabel, marginBottom: 8 }}>Booking Reference</p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#1a7d4d',
                  letterSpacing: 3,
                  margin: '0 0 8px',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                #{booking.BOOKING_NO}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#555', lineHeight: 1.5 }}>
                Scan the QR code or visit the link below to view and verify this booking online.
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#27ae60', wordBreak: 'break-all' }}>
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/hotels/booking/scan/${booking.BOOKING_NO}`
                  : `/hotels/booking/scan/${booking.BOOKING_NO}`}
              </p>
            </div>

            {/* Status badge */}
            <div style={{ textAlign: 'center', minWidth: 110 }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  borderRadius: 50,
                  backgroundColor: statusColor,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  boxShadow: `0 4px 14px ${statusColor}55`
                }}
              >
                {status}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 10, color: '#888', letterSpacing: 1 }}>BOOKING STATUS</p>
            </div>
          </div>

          {/* ──────────── NOTES ──────────── */}
          <div
            style={{
              margin: '0 48px 32px',
              padding: '18px 22px',
              backgroundColor: '#fff8e7',
              borderLeft: '4px solid #f59e0b',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#92640a' }}>
              📋 Booking Notes &amp; Cancellation Policy
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#7a5c1e', lineHeight: 1.6 }}>
              Free cancellation available until 48 hours before check-in. Modifications subject to availability and rate
              changes. Present this invoice or your booking reference at the property reception. For support, contact us
              at support@gocommunitymap.com.
            </p>
          </div>

          {/* ──────────── FOOTER ──────────── */}
          <div
            style={{
              backgroundColor: '#1a1a2e',
              padding: '24px 48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>GoCommunityMap</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                Hotel Booking Services · www.gocommunitymap.com
              </p>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'right' }}>
              This is a computer-generated invoice and does not require a signature.
              <br />© {new Date().getFullYear()} GoCommunityMap. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ── shared micro-styles ──────────────────────────────────────────────────────

const sectionLabel = {
  margin: '0 0 10px',
  fontSize: 10,
  color: '#27ae60',
  textTransform: 'uppercase',
  letterSpacing: 2,
  fontWeight: 700
}

const btnStyle = type => ({
  padding: '8px 20px',
  borderRadius: 8,
  border: type === 'primary' ? 'none' : '1.5px solid #ddd',
  backgroundColor: type === 'primary' ? '#27ae60' : '#fff',
  color: type === 'primary' ? '#fff' : '#555',
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: defaultPageFont,
  transition: 'opacity 0.15s'
})

HotelBookingInvoice.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default HotelBookingInvoice
