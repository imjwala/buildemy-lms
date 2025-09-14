"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";

interface AdminProfilePreviewProps {
  admin: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
  };
}

export const AdminProfilePreview = ({ admin }: AdminProfilePreviewProps) => {
  // Only use useConstructUrl for S3 keys, not external URLs
  const isS3Key = admin.image && !admin.image.startsWith("http");
  const imageUrl = isS3Key ? useConstructUrl(admin.image || "") : admin.image;

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Preview</h3>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {admin.image ? (
              <img
                src={imageUrl || ""}
                alt={admin.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-muted-foreground">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="text-center">
          <h4 className="font-medium">{admin.name}</h4>
          <p className="text-sm text-muted-foreground">{admin.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {admin.role?.charAt(0).toUpperCase()}
            {admin.role?.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
};
