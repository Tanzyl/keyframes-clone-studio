import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricImage, Textbox, Rect, Circle } from 'fabric';
import { Button } from '@/components/ui/button';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useTimeline, TimelineItem } from '@/hooks/useTimeline';
import { Project } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3,
  Eye,
  EyeOff,
  RotateCcw,
  FlipHorizontal
} from 'lucide-react';

interface VideoCanvasProps {
  selectedTool: string;
  currentTime: number;
  selectedLayer: string | null;
  onLayerSelect: (layerId: string | null) => void;
  currentProject: Project | null;
  isPlaying: boolean;
  onTimelineChange: (time: number) => void;
}

export const VideoCanvas = ({ 
  selectedTool, 
  currentTime, 
  selectedLayer, 
  onLayerSelect,
  currentProject,
  isPlaying,
  onTimelineChange
}: VideoCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const { mediaAssets } = useMediaLibrary(currentProject?.workspace_id);
  const { items: timelineItems, updateItem } = useTimeline(currentProject?.id);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    // Enable object controls
    canvas.selection = true;
    canvas.selectionColor = 'rgba(100, 149, 237, 0.3)';
    canvas.selectionBorderColor = 'rgba(100, 149, 237, 1)';

    setFabricCanvas(canvas);

    // Handle object selection
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        onLayerSelect((e.selected[0] as any).id || null);
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0]) {
        onLayerSelect((e.selected[0] as any).id || null);
      }
    });

    canvas.on('selection:cleared', () => {
      onLayerSelect(null);
    });

    return () => {
      canvas.dispose();
    };
  }, [canvasSize, onLayerSelect]);

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === 'draw';
    
    if (selectedTool === 'draw' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = '#000000';
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    switch (selectedTool) {
      case 'rectangle':
        addRectangle();
        break;
      case 'circle':
        addCircle();
        break;
      case 'text':
        addText();
        break;
    }
  }, [selectedTool, fabricCanvas]);

  // Update canvas with timeline items
  useEffect(() => {
    if (!fabricCanvas || !timelineItems) return;

    // Clear canvas
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';

    // Add items that should be visible at current time
    const visibleItems = timelineItems.filter(item => 
      currentTime >= item.start_time && currentTime <= item.end_time
    );

    visibleItems.forEach(async (item) => {
      await addTimelineItemToCanvas(item);
    });

    fabricCanvas.renderAll();
  }, [currentTime, timelineItems, fabricCanvas]);

  const addTimelineItemToCanvas = async (item: TimelineItem) => {
    if (!fabricCanvas) return;

    const mediaAsset = mediaAssets.find(asset => asset.id === item.media_asset_id);
    
    if (mediaAsset && mediaAsset.media_type === 'image') {
      try {
        const img = await FabricImage.fromURL(mediaAsset.file_url || '');
        const props = item.properties as any;
        img.set({
          left: props?.x || 0,
          top: props?.y || 0,
          scaleX: props?.scaleX || 1,
          scaleY: props?.scaleY || 1,
          angle: props?.rotation || 0,
        });
        (img as any).id = item.id;
        fabricCanvas.add(img);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    } else if ((item.properties as any)?.type === 'text') {
      const props = item.properties as any;
      const text = new Textbox(props?.text || 'Text', {
        left: props?.x || 0,
        top: props?.y || 0,
        fontSize: props?.fontSize || 24,
        fill: props?.color || '#000000',
        fontFamily: props?.fontFamily || 'Arial',
      });
      (text as any).id = item.id;
      fabricCanvas.add(text);
    }
  };

  const addRectangle = useCallback(() => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: '#3b82f6',
      width: 100,
      height: 100,
    });
    
    (rect as any).id = `rect_${Date.now()}`;
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const addCircle = useCallback(() => {
    if (!fabricCanvas) return;
    
    const circle = new Circle({
      left: 100,
      top: 100,
      fill: '#ef4444',
      radius: 50,
    });
    
    (circle as any).id = `circle_${Date.now()}`;
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const addText = useCallback(() => {
    if (!fabricCanvas) return;
    
    const text = new Textbox('Your Text Here', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial',
    });
    
    (text as any).id = `text_${Date.now()}`;
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const addImageToCanvas = useCallback((imageUrl: string) => {
    if (!fabricCanvas) return;

    FabricImage.fromURL(imageUrl).then((img) => {
      // Scale image to fit canvas if too large
      const maxWidth = canvasSize.width * 0.8;
      const maxHeight = canvasSize.height * 0.8;
      
      if (img.width! > maxWidth || img.height! > maxHeight) {
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
        img.scale(scale);
      }
      
      img.set({
        left: 50,
        top: 50,
      });
      
      (img as any).id = `image_${Date.now()}`;
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      
      toast({
        title: "Image Added",
        description: "Image has been added to the canvas",
      });
    }).catch((error) => {
      console.error('Failed to load image:', error);
      toast({
        title: "Error",
        description: "Failed to load image",
        variant: "destructive",
      });
    });
  }, [fabricCanvas, canvasSize]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 400);
    setZoom(newZoom);
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom / 100);
      fabricCanvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    setZoom(newZoom);
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom / 100);
      fabricCanvas.renderAll();
    }
  };

  const handleFitToScreen = () => {
    if (!fabricCanvas || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 100;
    const containerHeight = container.clientHeight - 100;
    
    const scaleX = containerWidth / canvasSize.width;
    const scaleY = containerHeight / canvasSize.height;
    const newZoom = Math.min(scaleX, scaleY) * 100;
    
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom / 100);
    fabricCanvas.renderAll();
  };

  const handleCanvasResize = (width: number, height: number) => {
    setCanvasSize({ width, height });
    if (fabricCanvas) {
      fabricCanvas.setDimensions({ width, height });
      fabricCanvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  };

  const rotateSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      fabricCanvas.renderAll();
    }
  };

  const flipSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set('flipX', !activeObject.flipX);
      fabricCanvas.renderAll();
    }
  };

  // Handle drag and drop from media library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('text/plain');
    if (imageUrl) {
      addImageToCanvas(imageUrl);
    }
  }, [addImageToCanvas]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-surface-2 overflow-hidden">
      {/* Canvas Controls */}
      <div className="h-12 bg-surface-1 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Canvas: {canvasSize.width} × {canvasSize.height}
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm text-muted-foreground">
            {zoom}%
          </div>
          <div className="h-4 w-px bg-border"></div>
          <select 
            className="text-sm bg-transparent border border-border rounded px-2 py-1"
            value={`${canvasSize.width}x${canvasSize.height}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              handleCanvasResize(width, height);
            }}
          >
            <option value="1920x1080">1920 × 1080 (HD)</option>
            <option value="1280x720">1280 × 720 (HD)</option>
            <option value="1080x1080">1080 × 1080 (Square)</option>
            <option value="1080x1920">1080 × 1920 (Vertical)</option>
            <option value="3840x2160">3840 × 2160 (4K)</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={deleteSelected}
            className="h-8 px-2 text-xs"
          >
            Delete
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={rotateSelected}
            className="h-8 w-8 p-0"
            title="Rotate"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={flipSelected}
            className="h-8 w-8 p-0"
            title="Flip"
          >
            <FlipHorizontal className="h-4 w-4" />
          </Button>
          
          <div className="h-4 w-px bg-border"></div>
          
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
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-surface-3 p-8"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-center min-h-full">
          <div className="relative" style={{ zoom: zoom / 100 }}>
            <canvas
              ref={canvasRef}
              className="border border-border shadow-2xl bg-white"
            />
            
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