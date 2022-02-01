import { AssetNft } from '@oceanprotocol/lib'
import Copy from '@shared/atoms/Copy'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import { decodeTokenURI, NftMetadata } from '@utils/nft'
import External from '@images/external.svg'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './MetaNft.module.css'
import { gql } from 'urql'
import { fetchData, getQueryContext } from '@utils/subgraph'

const tokenUriQuery = gql`
  query TokenUri($nft_address: String!) {
    nft(id: $nft_address) {
      id
      tokenUri
    }
  }
`

export default function MetaNft({
  nft,
  chainId,
  isBlockscoutExplorer
}: {
  nft: AssetNft
  chainId: number
  isBlockscoutExplorer: boolean
}): ReactElement {
  // https://support.opensea.io/hc/en-us/articles/4404027708051-Which-blockchains-does-OpenSea-support-
  const openseaNetworks = [1, 137, 8217]
  const openseaTestNetworks = [4, 1001, 80001, 97, 420]
  const isOpenSeaSupported = openseaNetworks
    .concat(openseaTestNetworks)
    .includes(chainId)

  const openSeaBaseUri = isOpenSeaSupported
    ? openseaTestNetworks.includes(chainId)
      ? 'https://testnets.opensea.io'
      : 'https://opensea.io'
    : undefined

  const [tokenUri, setTokenUri] = useState<NftMetadata>(undefined)

  useEffect(() => {
    const fetchTokenUri = async () => {
      const context = getQueryContext(chainId)
      const response = await fetchData(
        tokenUriQuery,
        {
          nft_address: nft.address
        },
        context
      )
      console.log('subgraph response:', response)
      setTokenUri(decodeTokenURI(response.data?.nft?.tokenUri))
    }
    fetchTokenUri()
  }, [nft, chainId])

  return (
    <div className={styles.nft}>
      <img src={tokenUri?.image_data} alt={nft?.name || 'Data NFT'} />
      {nft && (
        <Tooltip
          content={
            <div className={styles.tooltip}>
              <img src={tokenUri?.image_data} alt={nft?.name || 'Data NFT'} />
              <div className={styles.info}>
                <h2>{nft.name}</h2>
                <div className={styles.address}>
                  {nft.address} <Copy text={nft.address} />
                </div>
                <ExplorerLink
                  className={styles.link}
                  networkId={chainId}
                  path={
                    isBlockscoutExplorer
                      ? `tokens/${nft.address}`
                      : `token/${nft.address}`
                  }
                >
                  View on explorer
                </ExplorerLink>
                {isOpenSeaSupported && (
                  <a
                    className={styles.link}
                    href={`${openSeaBaseUri}/assets/${nft.address}/1`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on OpenSea <External />
                  </a>
                )}
              </div>
            </div>
          }
          className={styles.tooltipIcon}
        />
      )}
    </div>
  )
}
