import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { HOTEL_DEFAULT_FAQS } from 'src/@core/utils/constant'

const PropertyFAQ = ({ faqs }) => {
  console.log('faqs', faqs)

  const list = faqs ?? []

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
        Frequently Asked Questions (FAQ)
      </Typography>
      {list.map((faq, idx) => (
        <Accordion key={idx}>
          <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
            <Typography variant='subtitle2' sx={{ fontWeight: 500 }}>
              {faq.QUESTION}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2' sx={{ color: '#666' }}>
              {faq.ANSWER}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default PropertyFAQ
