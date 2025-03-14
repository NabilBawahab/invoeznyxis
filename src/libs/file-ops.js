import { s3CLient } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFile({ key, folder, body }) {
  const buffer = Buffer.from(await body.arrayBuffer());

  try {
    const command = new PutObjectCommand({
      Bucket: "invoeznyxis",
      Key: `${folder}/${key}`,
      Body: buffer,
      ContentType: body.type,
    });

    const fileUpload = await s3CLient.send(command);
    // console.log(fileUpload);
  } catch (error) {
    console.log("Error uploading file", error);
  }
}
