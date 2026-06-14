const DataGrid = () => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: 0,
          fontSize: '11px',
          color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          },

          // v7: columnHeaders background via CSS selector (slot override alone is unreliable in v7)
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.customColors.tableHeaderBg
          },

          // v7: row bottom border as divider — CSS selector required (slot override is clipped by virtualScroller)
          '& .MuiDataGrid-row': {
            borderBottom: `1px solid ${theme.palette.divider}`
          },

          // remove cell-level bottom border so only the row border shows (no double lines)
          '& .MuiDataGrid-cell': {
            borderBottom: 'none'
          },

          // keep header + body content vertically centered across all grids
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            alignItems: 'center'
          },

          // preserve explicit header alignment classes (left/center/right)
          '& .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center'
          },
          '& .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'flex-end'
          },

          // preserve explicit cell alignment classes (left/center/right)
          '& .MuiDataGrid-cell--textCenter': {
            justifyContent: 'center',
            textAlign: 'center'
          },
          '& .MuiDataGrid-cell--textRight': {
            justifyContent: 'flex-end',
            textAlign: 'right'
          },
          '& .MuiDataGrid-cell--textLeft': {
            justifyContent: 'flex-start',
            textAlign: 'left'
          }
        }),
        toolbarContainer: ({ theme }) => ({
          paddingRight: `${theme.spacing(5)} !important`,
          paddingLeft: `${theme.spacing(3.25)} !important`
        }),
        columnHeaders: ({ theme }) => ({
          backgroundColor: theme.palette.customColors.tableHeaderBg
        }),
        columnHeader: ({ theme }) => ({
          alignItems: 'center',
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(5)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(5)
          }
        }),
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        columnHeaderTitleContainer: {
          padding: 0,
          height: '100%',
          alignItems: 'center'
        },
        columnHeaderTitle: {
          fontSize: '0.75rem',
          letterSpacing: '0.17px',
          textTransform: 'uppercase'
        },
        columnSeparator: ({ theme }) => ({
          color: theme.palette.divider
        }),
        cell: ({ theme }) => ({
          display: 'flex',
          alignItems: 'center',
          borderColor: theme.palette.divider,
          '&:not(.MuiDataGrid-cellCheckbox)': {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(5)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(5)
          },
          '&:focus, &:focus-within': {
            outline: 'none'
          }
        }),
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        editInputCell: ({ theme }) => ({
          padding: 0,
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: 0
          }
        }),
        footerContainer: ({ theme }) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            paddingLeft: `${theme.spacing(4)} !important`,
            paddingRight: `${theme.spacing(4)} !important`
          },
          '& .MuiTablePagination-select': {
            color: theme.palette.text.primary
          }
        }),
        selectedRowCount: ({ theme }) => ({
          margin: 0,
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        })
      }
    }
  }
}

export default DataGrid
