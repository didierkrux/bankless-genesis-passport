import { Box, FormControl, FormLabel, Switch, Textarea, Text, Button, SimpleGrid } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useEffect, useState } from 'react'
const { CSVLink } = require('react-csv')

// Bankless Genesis NFT addresses
const NFT_ADDRESSES = [
  '0xe60a7e1a1ee79832f8f8042b0cffb2eaddb5e6c0',
  '0x1041f479b21f9ba7c8a487877b61098842f1f25a',
  '0xbf6cb74f15655865542668512b55668c35d7fc94',
  '0xd19a5ee68e2ed7c19d509b6f4ecad7409e79ad58',
  '0xbfb33f1e522f9c02633f16bacf3f4f24dc4b8755',
]

export default function Home() {
  const [nfts, setNFTs] = useState(NFT_ADDRESSES)
  const [mintList, setMintList] = useState<string[]>([])
  const [hasAllNFTs, setHasAllNFTs] = useState(true)

  useEffect(() => {
    const getMintList = async () => {
      setMintList(['...'])
      try {
        const res = await fetch(`/api/mintlist?hasAllNFTs=${hasAllNFTs}&nfts=${nfts.join(',')}`)
        if (res.status === 200) {
          const json = await res.json()
          console.log(json)
          if (json) setMintList(json)
        } else setMintList(['error, please refresh'])
      } catch (_error) {}
    }
    getMintList()
  }, [hasAllNFTs, nfts])

  let handleInputChange = (e: any) => {
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
        <SimpleGrid minChildWidth="420px" columns={2} spacing={4}>
          <Box justifySelf="center" w="100%" p="4">
            <Text align="center" fontSize="xl" mb="2">
              NFTs (ERC-721 on Mainnet)
            </Text>
            <Textarea w="100%" h="600px" value={nfts?.join('\n')} onChange={handleInputChange}></Textarea>
          </Box>
          <Box justifySelf="center" w="100%" p="4">
            <Text align="center" fontSize="xl" mb="2">
              {`Mintlist (${hasAllNFTsLabel}): `}
              <Text as="span" color="burlywood">
                {`${mintList.join() === '...' ? mintList.join() : mintList.length} unique addresses`}
              </Text>
            </Text>
            <Textarea w="100%" h="600px" value={Array.isArray(mintList) ? mintList?.join('\n') : ''}></Textarea>
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
