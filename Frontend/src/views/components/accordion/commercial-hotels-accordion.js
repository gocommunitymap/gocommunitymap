import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const CommercialAccordion = ({ id, expanded, title, bodyText, children, handleChange }) => {
  return (
    <Accordion variant='outlined' expanded={expanded === id} sx={{ p: 1, m: '0 !important' }} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${id}bh-header`}>
        <Typography variant='subtitle1'>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant='subtitle2'>{bodyText}</Typography>
        <Typography variant='subtitle2'>{children}</Typography>
      </AccordionDetails>
    </Accordion>
  )
}
