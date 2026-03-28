"use client";

import { useState } from 'react';
import { generatePastryDescription } from '@/ai/flows/generate-pastry-description-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pastryName: '',
    keywords: '',
    length: 'medium' as 'short' | 'medium' | 'long'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pastryName) return;

    setLoading(true);
    try {
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');
      const response = await generatePastryDescription({
        pastryName: formData.pastryName,
        keywords: keywordsArray,
        length: formData.length
      });
      setResult(response.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate description. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Description copied to clipboard."
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-headline text-primary mb-2">Product Description Tool</h1>
        <p className="text-muted-foreground">Internal AI tool to craft enticing content for dhawa9ni.tn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">Generator Inputs</CardTitle>
            <CardDescription>Details about the pastry to inspire the AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pastryName">Pastry Name</Label>
                <Input 
                  id="pastryName" 
                  placeholder="e.g., Kaak Warka de Zaghouan" 
                  value={formData.pastryName}
                  onChange={(e) => setFormData({...formData, pastryName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input 
                  id="keywords" 
                  placeholder="e.g., crispy, honey, almond, rose water" 
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Target Length</Label>
                <Select 
                  value={formData.length} 
                  onValueChange={(v: any) => setFormData({...formData, length: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (Paragraph)</SelectItem>
                    <SelectItem value="long">Long (Full story)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Description
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-secondary/10 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Result</CardTitle>
              <CardDescription>AI-generated copywriting.</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {result ? (
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed animate-in fade-in zoom-in duration-300">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 py-20">
                <Sparkles className="h-12 w-12 mb-4" />
                <p>Fill in the details to see the magic.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
