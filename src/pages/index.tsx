import { Box } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address } = useAccount()

  return (
    <>
      <Head />

      <main>
        <Box w="500px" h="500px" m="auto" background="grey">
          <iframe src={`/nft.html${address ? `?address=${address}` : ''}`} width="500px" height="500px" />
        </Box>
      </main>
    </>
  )
}
