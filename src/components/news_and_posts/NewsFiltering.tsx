// src/components/news_and_posts/NewsFiltering.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterParams {
  categories?: string[];
  keyword?: string;
  source?: string;
}

interface NewsFilteringProps {
  allCategories?: string[];
  allSources?: string[];
  onFilterChange: (filters: FilterParams) => void;
}

export default function NewsFiltering({ 
  allCategories = [], 
  allSources = [], 
  onFilterChange 
}: NewsFilteringProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Local state for filters
  const [localFilters, setLocalFilters] = React.useState<FilterParams>({
    categories: [],
    keyword: '',
    source: '',
  });

  const handleLocalFilterChange = (newFilters: Partial<FilterParams>) => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false); // Close the dialog after applying filters
  };

  const handleResetFilters = () => {
    setLocalFilters({
      categories: [],
      keyword: '',
      source: '',
    });
    onFilterChange({}); // Reset filters in parent as well
  };

  return (
    <div className="flex justify-start mb-6 px-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter News</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Categories Select */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <Select 
                value={localFilters.categories?.[0] || ''}
                onValueChange={(value) => 
                  handleLocalFilterChange({ categories: [value] })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {allCategories?.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Source Select */}
            <div className="space-y-2">
              <Label>Source</Label>
              <Select 
                value={localFilters.source || ''}
                onValueChange={(value) => 
                  handleLocalFilterChange({ source: value })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sources</SelectLabel>
                    {allSources?.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Keyword Input */}
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by keyword..."
                value={localFilters.keyword}
                onChange={(e) => 
                  handleLocalFilterChange({ keyword: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}