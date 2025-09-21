import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, X } from 'lucide-react';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { toast } from '@/hooks/use-toast';

interface VideoUploadProps {
  workspaceId?: string;
  projectId?: string;
  onUploadComplete?: (asset: any) => void;
}

export const VideoUpload = ({ workspaceId, projectId, onUploadComplete }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadFile } = useMediaLibrary(workspaceId);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('video/') || 
                     file.type.startsWith('image/') || 
                     file.type.startsWith('audio/');
      
      if (!isValid) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not a supported media file`,
          variant: "destructive",
        });
      }
      
      return isValid;
    });

    for (const file of validFiles) {
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const asset = await uploadFile(file, projectId);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (asset) {
          onUploadComplete?.(asset);
          toast({
            title: "Upload Complete",
            description: `${file.name} has been uploaded successfully`,
          });
        }
        
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-surface-2'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,image/*,audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Video className="h-6 w-6 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Media Files</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your videos, images, or audio files here, or click to browse
            </p>
          </div>
          
          <Button variant="outline" className="mt-4">
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </div>

      {(uploading || uploadProgress > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Supported formats: MP4, WebM, MOV, AVI (video) • JPG, PNG, GIF (images) • MP3, WAV (audio)
      </div>
    </div>
  );
};