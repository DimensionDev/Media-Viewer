import { ethers, Contract } from 'ethers';
import ERC721_ABI from './abi/ERC721.json'
import type { ViewerERC721TokenOptions } from './types'
import { CORS_PROXY } from './constants'
import { onError, onRejection } from './error'
import { onView } from './viewer'

export async function onERC721Parse(options: ViewerERC721TokenOptions) {
  const { rpc, contractAddress, tokenId, tokenURI: predefinedTokenURI } = options.erc721Token
  const provider = new ethers.providers.JsonRpcProvider({ url: rpc })
  const contract = new Contract(contractAddress, ERC721_ABI, provider)
  try {
    const tokenURI = predefinedTokenURI ?? await contract.tokenURI(tokenId)
    const asset = await getERC721TokenAssetFromChain(tokenURI)
    if (!asset?.mediaUrl) throw new Error('No resource found.')
    window.parentIFrame?.sendMessage({ message: { type: 'name', name: asset.name } })
    return onView({ ...options, url: asset.mediaUrl })
  } catch (error) {
    throw error
  }
}

const lazyVoid = Promise.resolve()
const BASE64_PREFIX = 'data:application/json;base64,'
const HTTP_PREFIX = 'http'

interface ERC721TokenInfo {
  name?: string
  description?: string
  tokenURI?: string
  mediaUrl?: string
  owner?: string
  // loading tokenURI
  hasTokenDetailed?: boolean
}

async function getERC721TokenAssetFromChain(tokenURI?: string): Promise<ERC721TokenInfo | void> {
  if (!tokenURI) return

  let promise: Promise<ERC721TokenInfo | void> = lazyVoid

  try {
    // for some NFT tokens return JSON in base64 encoded
    if (tokenURI.startsWith(BASE64_PREFIX)) {
      promise = Promise.resolve(JSON.parse(atob(tokenURI.replace(BASE64_PREFIX, ''))) as ERC721TokenInfo)
    } else {
      // for some NFT tokens return JSON
      promise = Promise.resolve(JSON.parse(tokenURI) as ERC721TokenInfo)
    }
  } catch (error) {
    void 0
  }

  if (promise === lazyVoid) {
    try {
      // for some NFT tokens return an URL refers to a JSON file
      const response = await fetch(tokenURI.startsWith(HTTP_PREFIX) ? `${CORS_PROXY}/?${tokenURI}` : tokenURI)
      if (!response?.ok) return
      const payload = await response.json()
      const mediaUrl = payload.image || payload.animation_url
      return ({ ...payload, mediaUrl }) as ERC721TokenInfo
    } catch (err) {
      return
    }
  }
  return
}
