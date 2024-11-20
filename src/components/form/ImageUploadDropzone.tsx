"use client";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-upload";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";

type ImageUploadDropzoneProps = {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  onFileUrlChange: (url: string) => void;  // New prop for updating image URL in the form
};

const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({files, setFiles, onFileUrlChange}) => {

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
  } satisfies DropzoneOptions;

  useEffect(() => {
    if (files && files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      onFileUrlChange(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);  // Clean up URL
    }
    //onFileUrlChange("");
  }, [files, onFileUrlChange]);

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropzone}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput
        id="fileInput"
        className="outline-dashed outline-1 outline-slate-500"
      >
        <div className="flex items-center justify-center flex-col p-8 w-full ">
          <CloudUpload className='text-gray-500 w-10 h-10' />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF
          </p>
        </div>
      </FileInput>
      <FileUploaderContent className="flex items-center flex-row gap-2">
        {files?.map((file, i) => (
          <FileUploaderItem
            key={i}
            index={i}
            className="size-20 p-0 rounded-md overflow-hidden"
            aria-roledescription={`file ${i + 1} containing ${file.name}`}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              height={80}
              width={80}
              className="size-20 p-0"
            />
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default ImageUploadDropzone;

