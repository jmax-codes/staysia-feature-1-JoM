"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, User } from "lucide-react";

interface BlogArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: JSX.Element;
}

interface BlogArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: BlogArticle | null;
}

export function BlogArticleDialog({ open, onOpenChange, article }: BlogArticleDialogProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-[#FFB400]/10 text-[#283B73] text-xs font-semibold rounded-full">
              {article.category}
            </span>
            
            {/* Title */}
            <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {article.title}
            </DialogTitle>
            
            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Staysia Editorial Team</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mt-8">
          {/* Featured Image Placeholder */}
          <div className="w-full h-64 bg-gradient-to-br from-[#283B73] to-[#1e2d54] rounded-xl flex items-center justify-center mb-8">
            <span className="text-8xl">{article.image}</span>
          </div>

          {/* Dynamic Content */}
          {article.content}
        </article>
      </DialogContent>
    </Dialog>
  );
}