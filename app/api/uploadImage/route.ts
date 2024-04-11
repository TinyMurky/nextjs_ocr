import { NextRequest, NextResponse } from "next/server";
import {config} from "../../../common/constants/config";
import {v4 as uuidv4} from 'uuid';
import { promises as fs } from 'fs';
import vision from '@google-cloud/vision';
import path from "path";
import { blockDataType } from "@/common/types/google_vision";


export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  const formidableUploadUrl = process.env.VERCEL === '1' ? config.formidableUploadUrl : path.join(process.cwd(), config.formidableUploadUrl);
  const formData = await req.formData();
  const file = formData.getAll('image')[0] as File;

  if (!file) {
    return NextResponse.json({error: 'No file uploaded'}, {status: 400})
  }

  // 保存文件到磁盘
  const filePath = path.join(formidableUploadUrl, `${uuidv4()}-${file.name}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);


  // 使用 Google Cloud Vision API 进行图像文本识别
  //  base64 -i mermer-official-415806-bff497e489c7.json -o haha.json
  const client = new vision.ImageAnnotatorClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64 || '', 'base64').toString('ascii')),
  });
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations;

  const fullTextAnnotation = result.fullTextAnnotation;
  const blockData: blockDataType= [];
// 遍历页面
if (fullTextAnnotation?.pages?.length) {
  fullTextAnnotation?.pages?.forEach(page => {
      // 遍历区块
        page?.blocks?.forEach(block => {
          // 获取区块的文本内容
          const blockText = block.paragraphs?.map(paragraph => 
            paragraph.words?.map(word => 
              word.symbols?.map(symbol => symbol.text).join('')
            ).join('')
          ).join('\n');

          // 获取区块的边界框
          const blockVertices = block.boundingBox?.vertices?.map(vertex => ({ x: vertex.x, y: vertex.y }));

          blockData.push({ blockText, blockVertices});
        });
  });
}

  // 删除上传的文件
  await fs.unlink(filePath);

  // 响应识别结果
  if (detections) {
    const description = detections[0].description; // 第一项通常包含整个文本
    console.log(description);
    return NextResponse.json({text: description, blockData})
  } else {
    return NextResponse.json({text: 'No text detected'})
  }
}