import sharp from "sharp";

export const compressImage =
  async (
    inputPath,
    outputPath
  ) => {

    await sharp(inputPath)

      .resize({
        width: 1200,
      })

      .jpeg({
        quality: 70,
      })

      .toFile(outputPath);

    return outputPath;

  };