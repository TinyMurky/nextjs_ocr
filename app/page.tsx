'use client'
import { useState } from "react";
import UploadImage from "./components/UploadImage";
import { blockDataType } from "@/common/types/google_vision";
import TextDisplay from "./components/TextDisplay";
import ImageDisplay from "./components/ImageDisplay";

export default function Home() {
  // Info Murky (20240410) 上傳的圖片暫存處
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [blockData, setBlockData] = useState<blockDataType>([]);
  // Info Murky (20240410) 上傳圖片到後端
  async function handleImageUpload() {
    const formData = new FormData();

    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    const response = await fetch(`/api/uploadImage`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Failed to upload image');
      return null
    }

    const data = await response.json();
    const { text, blockData }: { text: string, blockData: blockDataType } = data;
    setText(text);
    setBlockData(blockData);
    return null
  }

  return (
    <main className="min-h-screen flex-col items-center justify-between p-24 grid grid-cols-12 gap-2 bg-slate-800">
      <section id="UploadImage" className="relative flex flex-col items-center justify-center col-span-2 h-full border-white border-2 rounded">
        <button className="absolute top-5 border-2 rounded px-2 z-10" onClick={() => handleImageUpload()}>Upload</button>
        <UploadImage setSelectedImage={setSelectedImage} />
      </section>
      <section className="flex flex-col items-center justify-center col-span-5 h-full border-white border-2 rounded">
        <TextDisplay text={text} />
      </section>
      <section className="flex flex-col items-center justify-center col-span-5  h-full border-white border-2 rounded">
        <ImageDisplay blockData={blockData} image={selectedImage} />
      </section>
    </main>
  );
}
