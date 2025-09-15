import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/hooks/useProjects";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3,
  Eye,
  EyeOff
} from "lucide-react";

interface EditorCanvasProps {
  selectedTool: string;
  currentTime: number;
  selectedLayer: string | null;
  onLayerSelect: (layerId: string | null) => void;
  currentProject: Project | null;
}

const mockLayers = [
  { 
    id: "layer1", 
    type: "text", 
    content: "Welcome to Keyframes", 
    x: 50, 
    y: 50, 
    width: 300, 
    height: 60,
    rotation: 0,
    opacity: 1
  },
  { 
    id: "layer2", 
    type: "shape", 
    content: "", 
    x: 200, 
    y: 150, 
    width: 100, 
    height: 100,
    rotation: 0,
    opacity: 0.8
  },
];

export const EditorCanvas = ({ 
  selectedTool, 
  currentTime, 
  selectedLayer, 
  onLayerSelect,
  currentProject
}: EditorCanvasProps) => {
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleFitToScreen = () => setZoom(100);

  return (
    <div className="flex-1 flex flex-col bg-surface-2 overflow-hidden">
      {/* Canvas Controls */}
      <div className="h-12 bg-surface-1 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Canvas: 1920 × 1080
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm text-muted-foreground">
            {zoom}%
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={showGrid ? "default" : "ghost"}
            onClick={() => setShowGrid(!showGrid)}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant={showGuides ? "default" : "ghost"}
            onClick={() => setShowGuides(!showGuides)}
            className="h-8 w-8 p-0"
          >
            {showGuides ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          
          <div className="h-4 w-px bg-border"></div>
          
          <Button size="sm" variant="ghost" onClick={handleZoomOut} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleFitToScreen} className="h-8 w-8 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleZoomIn} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-surface-3 p-8">
        <div className="flex items-center justify-center min-h-full">
          <div
            ref={canvasRef}
            className="relative bg-background border border-border shadow-2xl"
            style={{
              width: `${(1920 * zoom) / 100}px`,
              height: `${(1080 * zoom) / 100}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center',
            }}
          >
            {/* Grid Overlay */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            )}

            {/* Layers */}
            {mockLayers.map((layer) => (
              <div
                key={layer.id}
                className={`absolute border-2 cursor-pointer transition-all ${
                  selectedLayer === layer.id 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-primary/50'
                }`}
                style={{
                  left: layer.x,
                  top: layer.y,
                  width: layer.width,
                  height: layer.height,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                }}
                onClick={() => onLayerSelect(layer.id)}
              >
                {layer.type === "text" && (
                  <div className="w-full h-full flex items-center justify-center text-foreground font-bold text-xl bg-transparent">
                    {layer.content}
                  </div>
                )}
                
                {layer.type === "shape" && (
                  <div className="w-full h-full bg-primary rounded-lg opacity-80"></div>
                )}
                
                {/* Selection Handles */}
                {selectedLayer === layer.id && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary border border-background rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary border border-background rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary border border-background rounded-full"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary border border-background rounded-full"></div>
                  </>
                )}
              </div>
            ))}

            {/* Center Guidelines */}
            {showGuides && (
              <>
                <div className="absolute top-0 left-1/2 w-px h-full bg-primary/30 pointer-events-none"></div>
                <div className="absolute left-0 top-1/2 w-full h-px bg-primary/30 pointer-events-none"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};