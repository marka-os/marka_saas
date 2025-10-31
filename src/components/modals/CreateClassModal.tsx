import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@marka/components/ui/dialog';
import { Button } from '@marka/components/ui/button';
import { Input } from '@marka/components/ui/input';
import { Label } from '@marka/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@marka/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useClasses } from '@marka/hooks/use-classes';

interface CreateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StreamInput {
  name: string;
  capacity: number;
}

export function CreateClassModal({ open, onOpenChange }: CreateClassModalProps) {
  const { addClass, isLoading } = useClasses();
  const [formData, setFormData] = useState({
    name: '',
    level: 'O-Level',
    description: '',
  });
  const [streams, setStreams] = useState<StreamInput[]>([
    { name: 'A', capacity: 50 },
  ]);

  const handleAddStream = () => {
    const nextLetter = String.fromCharCode(65 + streams.length);
    setStreams([...streams, { name: nextLetter, capacity: 50 }]);
  };

  const handleRemoveStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index));
  };

  const handleStreamChange = (index: number, field: keyof StreamInput, value: string | number) => {
    setStreams(streams.map((stream, i) => 
      i === index ? { ...stream, [field]: value } : stream
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addClass({
        ...formData,
        streams: streams.map(stream => ({
          name: stream.name,
          capacity: stream.capacity,
          studentCount: 0,
          classId: '',
          id: '',
        })),
      });
      
      setFormData({ name: '', level: 'O-Level', description: '' });
      setStreams([{ name: 'A', capacity: 50 }]);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create class:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Add a new class with multiple streams to your school system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Senior 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O-Level">O-Level (Senior 1-4)</SelectItem>
                  <SelectItem value="A-Level">A-Level (Senior 5-6)</SelectItem>
                  <SelectItem value="Primary">Primary (P1-P7)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Streams *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddStream}
                  disabled={streams.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stream
                </Button>
              </div>

              <div className="space-y-2">
                {streams.map((stream, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Stream Name</Label>
                      <Input
                        placeholder="A"
                        value={stream.name}
                        onChange={(e) => handleStreamChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Capacity</Label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={stream.capacity}
                        onChange={(e) => handleStreamChange(index, 'capacity', parseInt(e.target.value) || 0)}
                        required
                        min="1"
                      />
                    </div>
                    {streams.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStream(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
