import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  Type, 
  Shapes, 
  Sparkles,
  Search,
  Plus,
  Trash2,
  Download,
  FolderOpen,
  Play
} from "lucide-react";

const textTemplates = [
  { id: 1, name: "Animated Title", preview: "Sample Text" },
  { id: 2, name: "Subtitle", preview: "Subtitle Text" },
  { id: 3, name: "Call to Action", preview: "Click Here!" },
];

const shapes = [
  { id: 1, name: "Rectangle", icon: "□" },
  { id: 2, name: "Circle", icon: "○" },
  { id: 3, name: "Triangle", icon: "△" },
  { id: 4, name: "Arrow", icon: "→" },
];

export const EditorSidebar = () => {
  const { user } = useAuth();
  const { mediaFiles, loading, uploading, uploadFile, deleteFile } = useMediaLibrary();
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
    
    // Reset input
    event.target.value = "";
  };

  const filteredMedia = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = mediaFilter === "all" || 
      (mediaFilter === "image" && file.file_type.startsWith('image/')) ||
      (mediaFilter === "video" && file.file_type.startsWith('video/')) ||
      (mediaFilter === "audio" && file.file_type.startsWith('audio/'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-80 bg-surface-1 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="media" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="media" className="text-xs">
            <FolderOpen className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs">
            <Shapes className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <Sparkles className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="media" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Media"}
                </Button>
              </label>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={mediaFilter === "all" ? "default" : "ghost"} 
                  className="flex-1"
                  onClick={() => setMediaFilter("all")}
                >
                  All
                </Button>
                <Button 
                  size="sm" 
                  variant={mediaFilter === "image" ? "default" : "ghost"} 
                  className="flex-1"
                  onClick={() => setMediaFilter("image")}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={mediaFilter === "video" ? "default" : "ghost"} 
                  className="flex-1"
                  onClick={() => setMediaFilter("video")}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={mediaFilter === "audio" ? "default" : "ghost"} 
                  className="flex-1"
                  onClick={() => setMediaFilter("audio")}
                >
                  <Music className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {loading && (
                  <div className="text-center text-muted-foreground py-8">
                    Loading media...
                  </div>
                )}
                
                {!loading && filteredMedia.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No media found" : "Upload files to get started"}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  {filteredMedia.map((file) => (
                    <div
                      key={file.id}
                      className="relative group cursor-pointer border border-border rounded-lg p-2 hover:bg-surface-2 transition-colors"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(file));
                      }}
                    >
                      <div className="aspect-square bg-surface-2 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                        {file.file_type.startsWith('image/') ? (
                          <img 
                            src={file.file_path} 
                            alt={file.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : file.file_type.startsWith('video/') ? (
                          <Video className="h-6 w-6 text-blue-500" />
                        ) : (
                          <Music className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-foreground font-medium truncate">
                        {file.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(file.file_size / 1024 / 1024).toFixed(1)} MB
                      </div>
                      
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                            onClick={() => window.open(file.file_path, '_blank')}
                          >
                            <Download className="h-3 w-3 text-white" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                            onClick={() => deleteFile(file.id, file.file_path)}
                          >
                            <Trash2 className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="text" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Text
              </Button>
              
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {textTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-border rounded-lg p-3 hover:bg-surface-2 cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-sm mb-1">{template.name}</div>
                      <div className="text-xs text-muted-foreground bg-surface-2 rounded px-2 py-1">
                        {template.preview}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="shapes" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {shapes.map((shape) => (
                    <div
                      key={shape.id}
                      className="aspect-square border border-border rounded-lg flex flex-col items-center justify-center hover:bg-surface-2 cursor-pointer transition-colors"
                    >
                      <div className="text-2xl mb-1">{shape.icon}</div>
                      <div className="text-xs text-muted-foreground">{shape.name}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="h-full m-0">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <Button className="w-full btn-hero">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-3">
                  <div className="font-medium text-sm mb-2">AI Scene Generator</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Create scenes with AI prompts
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Try Now
                  </Button>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <div className="font-medium text-sm mb-2">Auto Animations</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Smart keyframe generation
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};