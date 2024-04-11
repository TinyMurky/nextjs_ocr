'use client'
import React from 'react'

type Props = {
  text: string
}

export default function TextDisplay({ text }: Props) {
  const textArray = text.split('\n');
  const textElement = text ? textArray.map((text, index) => {
    return <p key={index}>{`${index}. ${text}`}</p>
  }) : <p>Please upload an image</p>
  return (
    <div>
      {textElement}
    </div>
  )
}