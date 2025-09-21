import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Download, Video, Image, FileVideo } from 'lucide-react';
import { useVideoExport, ExportSettings } from '@/hooks/useVideoExport';
import type { Project } from '@/hooks/useProjects';

interface ExportDialogProps {
  currentProject: Project | null;
  children: React.ReactNode;
}

export const ExportDialog = ({ currentProject, children }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'mp4',
    quality: 'high',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    duration: 30000
  });

  const { isExporting, exportProgress, exportVideo, exportGif, exportHD, export4K } = useVideoExport();

  const handleExport = async () => {
    if (!currentProject) return;
    
    const success = await exportVideo(currentProject, settings);
    if (success) {
      setOpen(false);
    }
  };

  const handleQuickExport = async (type: 'gif' | 'hd' | '4k') => {
    if (!currentProject) return;
    
    let success = false;
    switch (type) {
      case 'gif':
        success = await exportGif(currentProject);
        break;
      case 'hd':
        success = await exportHD(currentProject);
        break;
      case '4k':
        success = await export4K(currentProject);
        break;
    }
    
    if (success) {
      setOpen(false);
    }
  };

  const formatSizeOptions = [
    { label: '1920 × 1080 (HD)', value: '1920x1080' },
    { label: '1280 × 720 (HD)', value: '1280x720' },
    { label: '1080 × 1080 (Square)', value: '1080x1080' },
    { label: '1080 × 1920 (Vertical)', value: '1080x1920' },
    { label: '3840 × 2160 (4K)', value: '3840x2160' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
          <DialogDescription>
            Choose your export settings and download your video.
          </DialogDescription>
        </DialogHeader>

        {isExporting ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-medium">Exporting...</div>
              <div className="text-sm text-muted-foreground">
                {exportProgress}% complete
              </div>
            </div>
            <Progress value={exportProgress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Export Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Export</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickExport('gif')}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <Image className="h-5 w-5 mb-1" />
                  <span className="text-xs">GIF</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickExport('hd')}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <Video className="h-5 w-5 mb-1" />
                  <span className="text-xs">HD Video</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickExport('4k')}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <FileVideo className="h-5 w-5 mb-1" />
                  <span className="text-xs">4K Video</span>
                </Button>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <Label className="text-sm font-medium">Custom Settings</Label>
              
              {/* Format */}
              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm">Format</Label>
                <Select
                  value={settings.format}
                  onValueChange={(value: 'mp4' | 'webm' | 'gif') =>
                    setSettings(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label htmlFor="quality" className="text-sm">Quality</Label>
                <Select
                  value={settings.quality}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'ultra') =>
                    setSettings(prev => ({ ...prev, quality: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution */}
              <div className="space-y-2">
                <Label htmlFor="resolution" className="text-sm">Resolution</Label>
                <Select
                  value={`${settings.resolution.width}x${settings.resolution.height}`}
                  onValueChange={(value) => {
                    const [width, height] = value.split('x').map(Number);
                    setSettings(prev => ({ ...prev, resolution: { width, height } }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatSizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Video
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};