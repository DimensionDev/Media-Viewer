export interface ViewerOptions {
  url: string
  type: string | null
  source: string | null
  controls: boolean
  autoPlay: boolean
  playsInline: boolean
  loop: boolean
  muted: boolean
  erc721Token: {
    contractAddress: string
    tokenId: string
    rpc: string
  } | null
}

export interface ViewerRawOptions extends Omit<ViewerOptions, 'url'> {
  url: string | null
}

export interface ViewerERC721TokenOptions extends Omit<ViewerRawOptions, 'erc721Token'> {
  erc721Token: {
    contractAddress: string
    tokenId: string
    rpc: string
  }
}
