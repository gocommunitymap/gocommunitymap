const Rating = () => {
  return {
    MuiRating: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.warning.main,
          '& svg': {
            flexShrink: 0
          }
        }),
        iconEmpty: ({ theme }) => ({
          color: `rgba(${theme.palette.customColors.mainChannel}, 0.22)`
        })
      }
    }
  }
}

export default Rating

