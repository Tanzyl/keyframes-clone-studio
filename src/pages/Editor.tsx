import { useState } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { EditorTimeline } from "@/components/editor/EditorTimeline";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

export default function Editor() {
  const [selectedTool, setSelectedTool] = useState("select");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <EditorHeader />
      
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
          />
        </div>
      </div>
    </div>
  );
}