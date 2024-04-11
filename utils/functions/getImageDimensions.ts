export function getImageDimensions(file: File) : Promise<{width:number, height:number, imgSrc: string}> {
  return new Promise((resolve, reject) => {
    // 创建一个临时的 URL 来指向上传的文件
    const src = URL.createObjectURL(file);

    // 创建一个新的 <img> 元素并设置其 src 属性为这个临时的 URL
    const img = new Image();
    img.src = src;

    // 当图像加载完成时，读取其宽度和高度
    img.onload = () => {
      // 获取图像尺寸
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // 清理临时的 URL
      URL.revokeObjectURL(src);

      // 使用图像的宽度和高度来解析 promise
      resolve({ width, height, imgSrc: src});
    };

    // 如果加载图像失败，拒绝这个 promise
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Failed to load image'));
    };
  });
}
