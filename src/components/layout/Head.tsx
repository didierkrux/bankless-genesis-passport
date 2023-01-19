import React from 'react'
import { default as NextHead } from 'next/head'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from 'utils/config'

interface Props {
  title?: string
  description?: string
}

export function Head(props: Props) {
  return (
    <NextHead>
      <title>{props.title ?? SITE_NAME}</title>
      <meta name="description" content={props.description ?? SITE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:image" content={`${SITE_URL}/social.png`} />
    </NextHead>
  )
}
