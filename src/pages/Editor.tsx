import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorTimeline } from "@/components/editor/EditorTimeline";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Editor() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { projects, createProject, updateProject } = useProjects();
  
  const [selectedTool, setSelectedTool] = useState("select");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Auto-save project data
  useEffect(() => {
    if (!currentProject || !autoSaveEnabled) return;

    const autoSaveTimer = setTimeout(() => {
      updateProject(currentProject.id, {
        data: {
          layers: [], // This would contain actual layer data
          duration,
          currentTime,
          selectedLayer,
        }
      });
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [currentProject, duration, currentTime, selectedLayer, autoSaveEnabled, updateProject]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Create a demo project for new users
  useEffect(() => {
    if (user && projects.length === 0) {
      createProject("Demo Project", "Your first video project").then((project) => {
        if (project) {
          setCurrentProject(project);
        }
      });
    } else if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  }, [user, projects, currentProject, createProject]);

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

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <EditorHeader 
        currentProject={currentProject}
        onProjectSave={(project) => setCurrentProject(project)}
        projects={projects}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <EditorSidebar />
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar 
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
          
          {/* Canvas */}
          <div className="flex-1 flex overflow-hidden">
            <EditorCanvas
              selectedTool={selectedTool}
              currentTime={currentTime}
              selectedLayer={selectedLayer}
              onLayerSelect={setSelectedLayer}
              currentProject={currentProject}
            />
          </div>
          
          {/* Timeline */}
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
          />
        </div>
      </div>
    </div>
  );
}