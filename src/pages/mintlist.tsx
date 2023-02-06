import { Box, FormControl, FormLabel, Switch, Textarea, Text, Button, SimpleGrid, Container } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useEffect, useState } from 'react'
const { CSVLink } = require('react-csv')
import queryString from 'query-string'

const NFT_ADDRESSES: any = {
  // Bankless Genesis Podcast gauntlet
  bankless_gauntlet: [
    '0xe60a7e1a1ee79832f8f8042b0cffb2eaddb5e6c0',
    '0x1041f479b21f9ba7c8a487877b61098842f1f25a',
    '0xbf6cb74f15655865542668512b55668c35d7fc94',
    '0xd19a5ee68e2ed7c19d509b6f4ecad7409e79ad58',
    '0xbfb33f1e522f9c02633f16bacf3f4f24dc4b8755',
  ],
  // Bankless Academy
  bankless_academy: [
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2561',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2562',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2563',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2564',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2565',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2608',
    'matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/14611',
  ],
}

const DEFAULT_COLLECTION = 'bankless_gauntlet'

export default function Home() {
  const collection =
    typeof window !== 'undefined' ? (queryString.parse(window.location.search)?.nfts || DEFAULT_COLLECTION)?.toString() : DEFAULT_COLLECTION
  const initialNFTs: string[] = collection in NFT_ADDRESSES ? NFT_ADDRESSES[collection] : []
  const [nfts, setNFTs] = useState<string[]>(initialNFTs)
  const [mintList, setMintList] = useState<string[]>([])
  const [hasAllNFTs, setHasAllNFTs] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getMintList = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/mintlist?hasAllNFTs=${hasAllNFTs}&nfts=${nfts.join(',')}`)
        if (res.status === 200) {
          const json = await res.json()
          console.log(json)
          if (json) setMintList(json)
        } else setMintList(['error, please refresh'])
        setIsLoading(false)
      } catch (_error) {
        setIsLoading(false)
      }
    }
    if (!isLoading) getMintList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAllNFTs, nfts])

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value
    setNFTs(inputValue.split('\n'))
  }

  const hasAllNFTsLabel = hasAllNFTs ? `has all ${nfts.filter((a) => a.trim() !== '')?.length}` : 'has at least 1'
  const csv = mintList.map((a) => [a])
  // console.log(csv)
  const date = new Date(Date.now())
  return (
    <>
      <Head />
      <main>
        <SimpleGrid minChildWidth="500px" columns={2} spacing={4}>
          <Box justifySelf="center" w="100%" p="4">
            <Text align="center" fontSize="xl" mb="2">
              NFTs (ERC-721 & ERC-1155 on Mainnet & Polygon)
            </Text>
            <Textarea w="100%" h="600px" value={nfts?.join('\n')} onChange={handleInputChange}></Textarea>
          </Box>
          <Box justifySelf="center" w="100%" p="4">
            <Text align="center" fontSize="xl" mb="2">
              {`Mintlist (${hasAllNFTsLabel}): `}
              <Text as="span" color="burlywood">
                {`${isLoading ? '...' : mintList.length} unique addresses`}
              </Text>
            </Text>
            <Textarea w="100%" h="600px" value={isLoading ? 'loading ...' : Array.isArray(mintList) ? mintList?.join('\n') : ''}></Textarea>
          </Box>
          <Box justifySelf="center">
            <FormControl display="flex" alignItems="center" justifyContent="center">
              <FormLabel color="burlywood" mb="0">
                {hasAllNFTsLabel}
              </FormLabel>
              <Switch colorScheme="blue" isChecked={hasAllNFTs} onChange={(e) => setHasAllNFTs(e.target.checked)} />
            </FormControl>
          </Box>
          <Box justifySelf="center">
            <CSVLink data={csv} filename={`mintlist - ${date.toDateString()} - ${hasAllNFTsLabel}.csv`}>
              <Button>Download .csv</Button>
            </CSVLink>
          </Box>
          <Box></Box>
        </SimpleGrid>
      </main>
    </>
  )
}
