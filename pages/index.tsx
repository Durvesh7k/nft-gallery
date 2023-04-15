import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type nftType = {
  description : string,
  tokenUri: {
    gateway: string
  }
}

type nftType1 = {
  contractMetadata: {
    openSea: {
      collectionName: string,
      imageUrl: string
    }
  }
}


export default function Home() {
  const [nfts, setNfts] = useState<{ name: string, image: string }[]>([]);
  const [account, setAccount] = useState<string>('');
  const [collectionAddress, setCollectionAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);

  const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

  async function getNfts(): Promise<void> {
    const options = {
      method: 'GET',
      url: `https://eth-mainnet.g.alchemy.com/nft/v2/${api_key}/getNFTs`,
      params: { owner: `${account}`, withMetadata: 'true', pageSize: '100' },
      headers: { accept: 'application/json' }
    };

    try {
      setLoading(true)
      const response = await axios.request(options)
      console.log(response.data);
      let nftsData: { name: string, image: string }[] = []
      response.data.ownedNfts.map((nft: nftType1, i: Number) => {
        nftsData.push({
          name: nft.contractMetadata.openSea.collectionName,
          image: nft.contractMetadata.openSea.imageUrl,
        })
      })
      setNfts(nftsData)
      setLoading(false)
    } catch (e) {
      console.log(e);
    }
  }


  async function getNftsByCollection(): Promise<void> {
    const options = {
      method: 'GET',
      url: `https://eth-mainnet.g.alchemy.com/nft/v2/${api_key}/getNFTsForCollection`,
      params: {
        contractAddress: `${collectionAddress}`,
        withMetadata: 'true'
      },
      headers: { accept: 'application/json' }
    };

    try {
      setLoading(true)
      const response = await axios.request(options)
      console.log(response.data);
      let nftsData: { name: string, image: string }[] = []
      response.data.nfts.map((nft: nftType, i: Number) => {
        nftsData.push({
          name: nft.description,
          image: nft.tokenUri.gateway,
        })
      })
      setNfts(nftsData)
      setLoading(false)
      console.log(nfts)
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <div className='grid gap-6 justify-center'>
      <div className='flex justify-center'>
        <h1 className='text-2xl mt-4 font-semibold'>NFT Gallery</h1>
      </div>
      <div className='grid grid-cols-1 gap-3 justify-center text-black font-semibold'>
        <div className='grid justify-center gap-3 '>
          <input className='h-10 w-80 rounded-md outline-none p-4' onChange={e => setAccount(e.target.value)} placeholder='Enter the account address' />
          <input className='h-10 w-80 rounded-md outline-none p-4' onChange={e => setCollectionAddress(e.target.value)} placeholder='Enter the collection address' />
        </div>
        <div className='flex gap-4 justify-center'>
          <button onClick={getNfts} className='w-32 rounded-md h-10 bg-indigo-700 text-white hover:bg-indigo-500'>Byaddress</button>
          <button onClick={getNftsByCollection} className='w-32 rounded-md h-10 bg-indigo-700 text-white hover:bg-indigo-500'>Bycollection</button>
        </div>
      </div>

      {!loading ? (
        <div className='grid gap-8 grid-cols-4 justify-center'>
          {nfts.map((nft, i) => {
            return (
              <div className='grid justify-center w-60 h-40 rounded-md bg-white font-semibold' key={i}>
                <img className='w-40 h-40' alt='Nft image' src={nft.image} />
                <h2>{nft.name}</h2>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='flex justify-center'>
          <span>Loading.....</span>
        </div>
      )}
    </div>
  )
}
