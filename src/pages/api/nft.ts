import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: move in .env
const ALCHEMY_KEY = 'OqVebafskIMfxHaVJNBdms7AmlzRaQ9X'

const NFT_ADDRESSES = [
  '0xe60a7e1a1ee79832f8f8042b0cffb2eaddb5e6c0',
  '0x1041f479b21f9ba7c8a487877b61098842f1f25a',
  '0xbf6cb74f15655865542668512b55668c35d7fc94',
  '0xd19a5ee68e2ed7c19d509b6f4ecad7409e79ad58',
  '0xbfb33f1e522f9c02633f16bacf3f4f24dc4b8755',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query
  try {
    // console.log('address', address)
    const contractAddresses = NFT_ADDRESSES.map((nftAddress) => `&contractAddresses[]=${nftAddress}`).join('')
    // console.log(contractAddresses)
    const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}/getNFTs?owner=${address}&pageSize=100${contractAddresses}&withMetadata=false`
    const result = await fetch(url)
    const json = await result.json()
    // console.log(json)
    const nftCollected: string[] = json.ownedNfts.map((nft: any) => nft.contract.address)
    // const uniqueNftCollected: string[] = [...new Set(nftCollected)]
    const uniqueNftCollected = nftCollected.filter((value, index, self) => self.indexOf(value) === index)
    console.log(uniqueNftCollected)
    res.status(200).json(uniqueNftCollected)
  } catch (ex) {
    console.error(ex)
    return res.json({ error: ex })
  }
}
