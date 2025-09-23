import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useProjects, Project } from "@/hooks/useProjects";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { useTimeline } from "@/hooks/useTimeline";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { VideoCanvas } from "@/components/editor/VideoCanvas";
import { EditorTimeline } from "@/components/editor/EditorTimeline";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Loader2 } from "lucide-react";

export default function Editor() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { workspaces, currentWorkspace, createWorkspace } = useWorkspaces();
  const { projects, createProject, updateProject } = useProjects(currentWorkspace?.id);
  const { mediaAssets } = useMediaLibrary(currentWorkspace?.id);
  
  const [selectedTool, setSelectedTool] = useState("select");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const { tracks, items } = useTimeline(currentProject?.id);

  // Auto-save project data
  useEffect(() => {
    if (!currentProject || !autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      updateProject(currentProject.id, {
        canvas_data: {
          ...(currentProject.canvas_data as any),
          duration: duration * 1000, // Convert to milliseconds
        },
        timeline_data: {
          ...(currentProject.timeline_data as any),
          duration: duration * 1000,
        }
      });
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [currentProject, duration, currentTime, selectedLayer, autoSaveEnabled, updateProject]);

  // Skip authentication for now
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     navigate('/auth');
  //   }
  // }, [user, authLoading, navigate]);

  // Create default workspace and project for demo mode
  useEffect(() => {
    if (workspaces.length === 0) {
      // Demo workspace data for offline mode
      const demoWorkspace = {
        id: 'demo-workspace',
        name: 'Demo Workspace',
        description: 'Demo workspace for testing',
        owner_id: 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      // In real implementation, this would come from the backend
    }
  }, [workspaces, createWorkspace]);

  // Create a demo project for users
  useEffect(() => {
    if (projects.length === 0 && !currentProject) {
      // Demo project data for offline mode
      const demoProject = {
        id: 'demo-project',
        name: 'Demo Project',
        description: 'Your first video project',
        workspace_id: 'demo-workspace',
        owner_id: 'demo-user',
        canvas_data: {
          fps: 30,
          layers: [],
          duration: 30000,
          resolution: { width: 1920, height: 1080 }
        },
        timeline_data: {
          tracks: [],
          duration: 30000
        },
        settings: {
          quality: "high",
          autoSave: true
        },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        thumbnail_url: null
      };
      setCurrentProject(demoProject as any);
    } else if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject, createProject]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Allow demo mode without authentication
  // if (!user) {
  //   return null; // Will redirect to auth
  // }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <EditorHeader 
        currentProject={currentProject}
        onProjectSave={(project) => setCurrentProject(project)}
        projects={projects}
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
          <EditorSidebar 
            mediaAssets={mediaAssets}
            currentProject={currentProject}
            currentWorkspace={currentWorkspace}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main Editor Area */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            {/* Toolbar and Canvas */}
            <ResizablePanel defaultSize={75} minSize={40}>
              <div className="flex flex-col h-full">
                {/* Toolbar */}
                <EditorToolbar 
                  selectedTool={selectedTool}
                  onToolSelect={setSelectedTool}
                />
                
                {/* Canvas */}
                <div className="flex-1 overflow-hidden">
                  <VideoCanvas
                    selectedTool={selectedTool}
                    currentTime={currentTime}
                    selectedLayer={selectedLayer}
                    onLayerSelect={setSelectedLayer}
                    currentProject={currentProject}
                    isPlaying={isPlaying}
                    onTimelineChange={setCurrentTime}
                  />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Timeline */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
              <EditorTimeline
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onTimeChange={setCurrentTime}
                onDurationChange={setDuration}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                selectedLayer={selectedLayer}
                onLayerSelect={setSelectedLayer}
                currentProject={currentProject}
                tracks={tracks}
                items={items}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}