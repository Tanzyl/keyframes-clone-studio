import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { Project } from '@/hooks/useProjects';

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  resolution: { width: number; height: number };
  fps: number;
  duration: number;
}

export const useVideoExport = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportVideo = async (project: Project, settings: ExportSettings) => {
    if (!user || !project) {
      toast({
        title: "Error",
        description: "Please sign in to export videos",
        variant: "destructive",
      });
      return false;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Create export record
      const { data: exportRecord, error: exportError } = await supabase
        .from('project_exports')
        .insert({
          project_id: project.id,
          export_settings: settings,
          created_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (exportError) throw exportError;

      // Start export process via edge function
      const { data, error } = await supabase.functions.invoke('export-video', {
        body: {
          projectId: project.id,
          exportId: exportRecord.id,
          settings,
          canvasData: project.canvas_data,
          timelineData: project.timeline_data
        }
      });

      if (error) throw error;

      // Poll for export progress
      const pollInterval = setInterval(async () => {
        const { data: updatedExport, error: pollError } = await supabase
          .from('project_exports')
          .select('*')
          .eq('id', exportRecord.id)
          .single();

        if (pollError) {
          clearInterval(pollInterval);
          throw pollError;
        }

        if (updatedExport) {
          setExportProgress(updatedExport.progress || 0);

          if (updatedExport.status === 'completed') {
            clearInterval(pollInterval);
            setIsExporting(false);
            
            toast({
              title: "Export Complete",
              description: "Your video has been exported successfully",
            });

            // Download the file
            if (updatedExport.file_url) {
              const link = document.createElement('a');
              link.href = updatedExport.file_url;
              link.download = `${project.name}.${settings.format}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }

            return true;
          } else if (updatedExport.status === 'failed') {
            clearInterval(pollInterval);
            setIsExporting(false);
            
            toast({
              title: "Export Failed",
              description: updatedExport.error_message || "Unknown error occurred",
              variant: "destructive",
            });
            
            return false;
          }
        }
      }, 2000);

      return true;
    } catch (error: any) {
      setIsExporting(false);
      setExportProgress(0);
      
      toast({
        title: "Export Error",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const exportGif = async (project: Project, duration: number = 3000) => {
    const settings: ExportSettings = {
      format: 'gif',
      quality: 'medium',
      resolution: { width: 800, height: 600 },
      fps: 12,
      duration
    };

    return exportVideo(project, settings);
  };

  const exportHD = async (project: Project) => {
    const settings: ExportSettings = {
      format: 'mp4',
      quality: 'high',
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      duration: (project.timeline_data as any)?.duration || 30000
    };

    return exportVideo(project, settings);
  };

  const export4K = async (project: Project) => {
    const settings: ExportSettings = {
      format: 'mp4',
      quality: 'ultra',
      resolution: { width: 3840, height: 2160 },
      fps: 30,
      duration: (project.timeline_data as any)?.duration || 30000
    };

    return exportVideo(project, settings);
  };

  return {
    isExporting,
    exportProgress,
    exportVideo,
    exportGif,
    exportHD,
    export4K
  };
};