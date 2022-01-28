import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { Asset } from '@oceanprotocol/lib'
import AddToken from '@shared/AddToken'
import Tooltip from '@shared/atoms/Tooltip'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import { decodeTokenURI } from '@utils/nft'
import React, { ReactElement } from 'react'
import MetaCollection from './MetaCollection'
import styles from './MetaHeader.module.css'
import MetaNft from './MetaNft'

export default function MetaHeader({ ddo }: { ddo: Asset }): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3ProviderInfo } = useWeb3()

  const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]
  const isBlockscoutExplorer = blockscoutNetworks.includes(ddo?.chainId)

  const dataTokenSymbol = ddo?.datatokens[0]?.symbol

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <MetaNft
          nft={ddo?.nft}
          chainId={ddo?.chainId}
          isBlockscoutExplorer={isBlockscoutExplorer}
        />
        <div>
          <div>
            Owned by <Publisher account={ddo?.nft?.owner} />
          </div>
          <ExplorerLink
            className={styles.datatoken}
            networkId={ddo?.chainId}
            path={
              isBlockscoutExplorer
                ? `tokens/${ddo?.services[0].datatokenAddress}`
                : `token/${ddo?.services[0].datatokenAddress}`
            }
          >
            Accessed with {`${dataTokenSymbol}`}
          </ExplorerLink>
        </div>

        {web3ProviderInfo?.name === 'MetaMask' && isAssetNetwork && (
          <span className={styles.addWrap}>
            <AddToken
              address={ddo?.services[0].datatokenAddress}
              symbol={(ddo as Asset)?.datatokens[0]?.symbol}
              logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
              text={`Add ${(ddo as Asset)?.datatokens[0]?.symbol} to wallet`}
              className={styles.add}
              minimal
            />
          </span>
        )}
      </header>
      <MetaCollection ddo={ddo} />
    </div>
  )
}
