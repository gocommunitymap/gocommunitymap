import { useRouter } from 'next/router'

const PaymentPage = () => {
  const { query } = useRouter()
  const { status } = query

  return <div>Payment Page: {status}</div>
}

export default PaymentPage
