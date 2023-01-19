import { AspectRatio, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useState } from 'react'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  const [isDemo, setIsDemo] = useState(false)

  const stateAddress = isDemo ? '0xBD19a3F0A9CaCE18513A1e2863d648D13975CB30' : address
  return (
    <>
      <Head />

      <main>
        <AspectRatio m="auto" w="500px" maxW="100%" ratio={1}>
          <iframe src={`/nft.html${stateAddress?.length ? `?address=${stateAddress}` : ''}`} width="100%" height="100%" />
        </AspectRatio>
        <FormControl display="flex" alignItems="center" justifyContent="center" mt="8">
          <FormLabel color="burlywood" mb="0">
            Activate full gauntlet demo
          </FormLabel>
          <Switch colorScheme="blue" onChange={(e) => setIsDemo(e.target.checked)} />
        </FormControl>
      </main>
    </>
  )
}
