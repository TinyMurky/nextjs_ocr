import { NextRequest, NextResponse } from "next/server";
import {config} from "../../../common/constants/config";
import {v4 as uuidv4} from 'uuid';
import { promises as fs } from 'fs';
import path from "path";
export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  const formidableUploadUrl = process.env.VERCEL === '1' ? config.formidableUploadUrl : path.join(process.cwd(), config.formidableUploadUrl);
  const formData = await req.formData();
  const file = formData.getAll('image')[0] as File;

  /**
   * Save file to disk
   */
 const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(formidableUploadUrl, `${file.name}`), buffer); // Write buffer to file
  return NextResponse.json({message: 'success'})
}