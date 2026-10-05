"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export type ProductImageValue = {
  url: string;
  alt?: string;
};

type Props = {
  value: ProductImageValue[];
  onChange: (value: ProductImageValue[]) => void;
};

export default function MediaEditor({ value, onChange }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  function addImage() {
    onChange([...value, { url: "", alt: "" }]);
  }

  function updateImage(index: number, changes: Partial<ProductImageValue>) {
    onChange(
      value.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...changes } : image,
      ),
    );
  }

  function removeImage(index: number) {
    onChange(value.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= value.length) {
      return;
    }

    const next = [...value];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    onChange(next);
  }

  async function uploadImage(index: number, file?: File) {
    if (!file) return;

    setUploadError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("The image must not exceed 5 MB.");
      return;
    }

    setUploadingIndex(index);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body,
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Image upload failed.");
      }

      const currentImage = value[index];

      updateImage(index, {
        url: result.url,
        alt:
          currentImage?.alt?.trim() ||
          file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Unable to upload the image.",
      );
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className="space-y-4">
      {uploadError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {uploadError}
        </div>
      )}

      {value.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#DCD2C3] bg-[#FDFBF7] p-8 text-center">
          <p className="text-sm text-[#6D756E]">No product images added yet.</p>

          <button
            type="button"
            onClick={addImage}
            className="button button-solid mt-4"
          >
            <Plus size={16} />
            Add first image
          </button>
        </div>
      )}

      {value.map((image, index) => (
        <div
          key={`product-image-${index}`}
          className="rounded-2xl border border-[#DCD2C3] bg-[#FDFBF7] p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCD2C3] bg-[#F6F1E8] sm:w-32">
              {image.url.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url.trim()}
                  alt={image.alt || `Product image ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="px-3 text-center text-xs text-[#6D756E]">
                  Image preview
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#242B27]">
                  Image {index + 1}
                  {index === 0 ? " · Main image" : ""}
                </p>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || uploadingIndex !== null}
                    onClick={() => moveImage(index, -1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD2C3] disabled:opacity-30"
                    aria-label={`Move image ${index + 1} up`}
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === value.length - 1 || uploadingIndex !== null
                    }
                    onClick={() => moveImage(index, 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD2C3] disabled:opacity-30"
                    aria-label={`Move image ${index + 1} down`}
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={uploadingIndex !== null}
                    onClick={() => removeImage(index)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD2C3] text-red-600 disabled:opacity-30"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Upload photo from your computer</label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingIndex !== null}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void uploadImage(index, file);
                  }}
                  className="field"
                />

                {uploadingIndex === index && (
                  <p className="mt-2 text-xs text-[#174D3D]">
                    Uploading image...
                  </p>
                )}

                <p className="mt-1 text-xs text-[#6D756E]">
                  JPG, PNG or WebP. Maximum 5 MB.
                </p>
              </div>

              <div>
                <label className="label">Image URL or local path</label>

                <input
                  type="text"
                  value={image.url}
                  onChange={(event) =>
                    updateImage(index, { url: event.target.value })
                  }
                  placeholder="/uploads/products/example.jpg"
                  className="field"
                />
              </div>

              <div>
                <label className="label">Alternative text</label>

                <input
                  type="text"
                  value={image.alt ?? ""}
                  onChange={(event) =>
                    updateImage(index, { alt: event.target.value })
                  }
                  placeholder="Perfume bottle, front view"
                  className="field"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {value.length > 0 && (
        <button
          type="button"
          onClick={addImage}
          disabled={uploadingIndex !== null}
          className="button"
        >
          <Plus size={16} />
          Add another image
        </button>
      )}

      <p className="text-xs leading-5 text-[#6D756E]">
        The first image is the main image. Use the arrows to change the order.
        Uploaded images are saved inside your local project.
      </p>
    </div>
  );
}
