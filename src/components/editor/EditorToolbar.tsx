import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer2,
  Move,
  RotateCcw,
  Square,
  Circle,
  Triangle,
  Type,
  Image,
  Scissors,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";

interface EditorToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "move", icon: Move, label: "Move" },
  { id: "rotate", icon: RotateCcw, label: "Rotate" },
];

const shapes = [
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
];

const actions = [
  { id: "text", icon: Type, label: "Add Text" },
  { id: "image", icon: Image, label: "Add Image" },
];

const editActions = [
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "copy", icon: Copy, label: "Copy" },
  { id: "delete", icon: Trash2, label: "Delete" },
];

const alignActions = [
  { id: "align-left", icon: AlignLeft, label: "Align Left" },
  { id: "align-center", icon: AlignCenter, label: "Align Center" },
  { id: "align-right", icon: AlignRight, label: "Align Right" },
  { id: "align-justify", icon: AlignJustify, label: "Align Justify" },
];

export const EditorToolbar = ({ selectedTool, onToolSelect }: EditorToolbarProps) => {
  return (
    <div className="h-12 bg-surface-1 border-b border-border flex items-center px-4 space-x-1">
      {/* Selection Tools */}
      <div className="flex items-center space-x-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant={selectedTool === tool.id ? "default" : "ghost"}
            onClick={() => onToolSelect(tool.id)}
            className="h-8 w-8 p-0"
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Shape Tools */}
      <div className="flex items-center space-x-1">
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            size="sm"
            variant={selectedTool === shape.id ? "default" : "ghost"}
            onClick={() => onToolSelect(shape.id)}
            className="h-8 w-8 p-0"
            title={shape.label}
          >
            <shape.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Add Tools */}
      <div className="flex items-center space-x-1">
        {actions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant={selectedTool === action.id ? "default" : "ghost"}
            onClick={() => onToolSelect(action.id)}
            className="h-8 w-8 p-0"
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Edit Actions */}
      <div className="flex items-center space-x-1">
        {editActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant="ghost"
            onClick={() => onToolSelect(action.id)}
            className="h-8 w-8 p-0"
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center space-x-1">
        {alignActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant="ghost"
            onClick={() => onToolSelect(action.id)}
            className="h-8 w-8 p-0"
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};