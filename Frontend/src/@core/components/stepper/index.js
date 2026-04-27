import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Chip, StepIcon } from '@mui/material'

const VerticalLinearStepper = ({ stepsData, handleComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)

    if (activeStep === stepsData?.length - 1) {
      handleComplete()
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        orientation='vertical'
        sx={{
          '& .MuiStepConnector-vertical': {
            display: 'none'
          }
        }}
      >
        {stepsData.map((step, index) => (
          <Step
            key={step.label}
            sx={{
              display: index <= activeStep ? 'block' : 'none'
            }}
          >
            <StepIcon icon={<Chip size='small' label={`Step ${index + 1} of 4`} variant='outlined' />} />

            <StepContent>
              {step.children}

              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant='contained' onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    {index === stepsData.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === stepsData.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default VerticalLinearStepper
