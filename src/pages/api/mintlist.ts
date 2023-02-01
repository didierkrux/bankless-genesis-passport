import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: move in .env
const ALCHEMY_KEY = 'OqVebafskIMfxHaVJNBdms7AmlzRaQ9X'

const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hasAllNFTs, nfts } = req.query
  try {
    if (!nfts) res.status(200).json([])
    console.log('nfts', nfts)
    let endpoints = []
    const nftsArray = typeof nfts === 'string' ? nfts?.split(',').filter((a) => a.trim() !== '') : []

    for (const nftAddress of nftsArray) {
      endpoints.push(`${baseURL}/getOwnersForCollection/?contractAddress=${nftAddress}`)
    }
    console.log(endpoints)

    const collections: { ownerAddresses: string[] }[] = await Promise.all(
      endpoints.map(async (endpoint) => {
        const resp = await fetch(endpoint)
        return resp.json()
      })
    )
    // console.log(collections)
    const collectionOwners = []
    const collectionsPerWallet: { [key: string]: number } = {}
    for (const collection of collections) {
      // console.log(collection.ownerAddresses)
      // add unique owners for each collection
      collectionOwners.push(...new Set(collection.ownerAddresses))
    }
    console.log('collectionOwners', collectionOwners)
    console.log('count collectionOwners', collectionOwners.length)
    for (const walletAddress of collectionOwners) {
      collectionsPerWallet[walletAddress] = (collectionsPerWallet[walletAddress] || 0) + 1
    }
    console.log(collectionsPerWallet)
    const mintlist: string[] = []
    if (hasAllNFTs === 'false') {
      mintlist.push(...Object.keys(collectionsPerWallet))
      console.log('mintlist (has at least 1):\n', mintlist.join(',\n'))
      console.log('count mintlist', mintlist.length)
      res.status(200).json(mintlist)
    } else {
      Object.keys(collectionsPerWallet).map((walletAddress) => {
        if (collectionsPerWallet[walletAddress] >= nftsArray.length) {
          mintlist.push(walletAddress)
        }
      })
      console.log('mintlist (has all):\n', mintlist.join(',\n'))
      console.log('count mintlist', mintlist.length)
      res.status(200).json(mintlist)
    }
  } catch (ex) {
    console.error(ex)
    return res.status(500).json({ error: ex })
  }
}
