import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const print = ({ title, data, header = [], footer = [] }) => {
  const columns = Object.keys(data[0])

  const nw = window.open('_blank')

  const headerColumns = () => {
    let element = ''
    for (let i = 0; i < header.length; i++) {
      element += `<td colspan='${header[i].colspan || '1'}' style='${header[i].align || 'left'}'><strong>${
        header[i].field
      }</strong></td>`
    }

    return element
  }

  const footerColumns = () => {
    let element = ''
    for (let i = 0; i < footer.length; i++) {
      element += `<th colspan='${footer[i].colspan || '1'}' style='${footer[i].align || 'left'}'><strong>${
        footer[i].field
      }</strong></th>`
    }

    return element
  }

  const tableColumns = () => {
    let element = ''
    for (let i = 0; i < columns.length; i++) {
      element += `<th>${columns[i]}</th>`
    }

    return element
  }

  const body = () => {
    let element = ''

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      element += `<tr>`
      for (let x = 0; x < columns.length; x++) {
        const col = row[columns[x]]
        element += `<td>${col}</td>`
      }
      element += `</tr>`
    }

    return element
  }

  const html = `<html><head><title>Print</title>
  <link href="${window.location.origin}/mui/mui.min.css" rel="stylesheet" />
  </head><body><h2 style='text-align:center'>${title}</h2>
  <table class='mui-table mui-table--bordered' style='width:100%'>
  ${
    header.length > 0
      ? `<thead><tr>
            ${headerColumns()}
          </tr></thead>`
      : ''
  }
  <thead>
    <tr>
      ${tableColumns()}
    </tr>
  </thead>
  <tbody>
    ${body()}
  </tbody>
  ${
    footer.length > 0
      ? `<tbody><tr>
            ${footerColumns()}
          </tr></tbody>`
      : ''
  }
</table>
  </body></html>`
  nw.document.write(html)

  setTimeout(() => {
    nw.print()
    nw.close()
  }, 1000)
}

export const generatePDF = async ({
  title,
  data,
  header = [],
  footer = [],
  element = null,
  format = 'a4',
  orientation = 'portrait'
}) => {
  const columns = Object.keys(data[0])

  const headerColumns = () => {
    let element = ''
    for (let i = 0; i < header.length; i++) {
      element += `<td colspan='${header[i].colspan || '1'}' style='${header[i].align || 'left'}'><strong>${
        header[i].field
      }</strong></td>`
    }

    return element
  }

  // const headerColumnsJsPDF = header.map(i => ({
  //   id: i.field,
  //   name: i.headerName,
  //   prompt: i.field,
  //   width: 100,
  //   align: 'center',
  //   padding: 0
  // }))

  const headerColumnsJsPDF = Object.keys(data[0]).map(i => i)

  const dataColumns = Object.keys(data[0])

  const doc = new jsPDF({
    unit: 'mm',
    format: format,
    orientation: orientation
  })
  doc.setFontSize(25)
  doc.text(title, 15, 20)

  const newData = data.map(i => {
    const row = dataColumns.map(c => i[c])

    return row
  })

  autoTable(
    doc,
    {
      startY: 30,
      head: [dataColumns],
      body: newData,
      theme: 'plain',
      headStyles: { fillColor: [248, 247, 250] },
      styles: {
        startY: 50,
        cellWidth: 'auto',
        overflow: 'linebreak',
        fillColor: null,
        valign: 'middle',

        lineWidth: 0.2
      },
      margin: { top: 10 }
    },
    20,
    40
  )

  var pageCount = doc.internal.getNumberOfPages()

  for (let i = 0; i < pageCount; i++) {
    doc.setPage(i)
    let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber //Current Page
    doc.setFontSize(12)
    doc.text(
      'page: ' + pageCurrent + '/' + pageCount,
      doc.internal.pageSize.width - 15,
      doc.internal.pageSize.height - 10,
      null,
      null,
      'right'
    )
  }

  doc.save(`${title}.pdf`)
  doc.close()
}
