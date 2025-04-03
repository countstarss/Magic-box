"use client"

import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useState } from "react";

// TODO: 获取一下fileInfo的类型（optional）

const Avatar = () => {

  const [imageUrl, setImageUrl] = useState("");

  // @ts-ignore
  const handleUploadComplete = (fileInfo: any) => {
    console.log("Uploaded file info:", fileInfo);
    setImageUrl(fileInfo.cdnUrl); // 保存图片链接
  };

  return (

    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="w-20 h-20">
        <Image
          src={`https://utfs.io/a/5442z6o70d/npk57TahPsF2xERcqM7ExjG5cqoUg9QF1CVfvmZNnH7Bp8XD`}
          alt="Uploaded"
          width={100}
          height={100}
        />
      </div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("FilesURL: ", res[0].appUrl);
          handleUploadComplete(res[0]);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={300}
            height={300}
          />
        </div>
      )}
    </div>
  );
}

export default Avatar;