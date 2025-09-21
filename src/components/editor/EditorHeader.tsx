import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Project } from "@/hooks/useProjects";
import { 
  FileText, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  User,
  ChevronDown,
  Undo,
  Redo,
  Play,
  Pause
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ExportDialog } from "./ExportDialog";

interface EditorHeaderProps {
  currentProject: Project | null;
  onProjectSave: (project: Project) => void;
  projects: Project[];
}

export const EditorHeader = ({ currentProject, onProjectSave, projects }: EditorHeaderProps) => {
  const { user, signOut } = useAuth();
  const [projectName, setProjectName] = useState(currentProject?.name || "Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="h-14 bg-surface-1 border-b border-border flex items-center justify-between px-4">
      {/* Left Section - Logo & Project */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-blue-light rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-sm font-bold text-foreground">KEYFRAMES</span>
        </div>
        
        <div className="h-6 w-px bg-border"></div>
        
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-48 h-8 text-sm border-none bg-transparent focus:bg-surface-2 focus:border-border"
        />
      </div>

      {/* Center Section - Playback Controls */}
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Undo className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <Button 
          size="sm" 
          variant="default" 
          className="h-8 px-3"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      {/* Right Section - Actions & User */}
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <ExportDialog currentProject={currentProject}>
          <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </ExportDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
              <Share2 className="h-4 w-4 mr-1" />
              Share
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Publish to Web
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border"></div>

        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Projects</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};