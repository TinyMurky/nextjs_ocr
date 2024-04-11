'use client'
import { blockDataType } from '@/common/types/google_vision';
import React, { useEffect, useState } from 'react'
import { getImageDimensions } from '../../utils/functions/getImageDimensions';

type Props = {
  blockData: blockDataType,
  image: File | null
}

export default function TextDisplay({ blockData, image }: Props) {


  const [originWidth, setOriginWidth] = useState<number>(1);
  const [originHeight, setOriginHeight] = useState<number>(1);
  const [imgSrc, setImgSrc] = useState<string>('');

  const [displayedDimensions, setDisplayedDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (image) {
      getImageDimensions(image).then(({ width, height, imgSrc }) => {
        setOriginHeight(height);
        setOriginWidth(width);
        setImgSrc(imgSrc);
      })
    }
  }, [image]);
  if (!image) {
    return <div className="text-white">Please upload an image</div>
  }
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = event.currentTarget;
    setDisplayedDimensions({ width, height });
    console.log(`Displayed Width: ${width}, Displayed Height: ${height}`);
  };

  // 计算缩放比例
  const scaleX = displayedDimensions.width / originWidth;
  const scaleY = displayedDimensions.height / originHeight;

  return (
    <div className="relative text-white">
      <div className="relative">
        {/* 假设您有一个显示图像的 <img> 标签 */}
        <img src={imgSrc} alt="uploaded" className="max-w-full" onLoad={handleImageLoad} />
        {/* 动态创建框框 */}
        {blockData.map((block, index) => {
          if (block?.blockVertices && block?.blockVertices.length >= 4 && block?.blockVertices[0]?.x && block?.blockVertices[0]?.y && block?.blockVertices[1]?.x && block?.blockVertices[2]?.y) {
            return <div
              key={index}
              className="absolute border-2 border-red-500"
              style={{
                left: `${block.blockVertices[0].x * scaleX - 5}px`,
                top: `${block.blockVertices[0].y * scaleY - 5}px`,
                width: `${(block.blockVertices[1].x - block.blockVertices[0].x) * scaleX + 10}px`,
                height: `${(block.blockVertices[2].y - block.blockVertices[0].y) * scaleY + 10}px`,
              }}
            />
          }

        })}
      </div>
    </div>
  );
}