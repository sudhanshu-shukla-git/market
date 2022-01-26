import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import Time from '@shared/atoms/Time'
import AssetType from '@shared/AssetType'
import styles from './MetaCollection.module.css'
import { getServiceByName } from '@utils/ddo'
import { Asset } from '@oceanprotocol/lib'

export default function MetaCollection({ ddo }: { ddo: Asset }): ReactElement {
  const isCompute = Boolean(getServiceByName(ddo, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'

  return (
    <aside className={styles.collection}>
      <AssetType
        type={ddo?.metadata.type}
        accessType={accessType}
        className={styles.assetType}
      />
      Published{' '}
      <span>
        <Time date={ddo?.metadata.created} relative />
        {ddo?.metadata.created !== ddo?.metadata.updated && (
          <>
            {' — '}
            <span className={styles.updated}>
              updated <Time date={ddo?.metadata.updated} relative />
            </span>
          </>
        )}
      </span>
    </aside>
  )
}
