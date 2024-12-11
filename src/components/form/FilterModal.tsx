"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TagsSelector from "@/components/form/TagsSelector";
import { DatePickerWithRange } from "@/app/utils/DatePickerWithRange";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchTags } from "@/services/postService";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { date } from "zod";
import { formatAsLocalDateTimeWithMillis } from "@/app/utils/FormatDate";

export default function FilterModal({ onSubmit }: { onSubmit: (tags: string[] | null, startDate: string | null, endDate: string | null, title: string | null, content: string | null) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const [selectedPostAge, setSelectedPostAge] = useState<string>("");
  const [titleKeyword, setTitleKeyword] = useState("");
  const [contentKeyword, setContentKeyword] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  

  useEffect(() => {
    async function loadTags() {
      try {
        const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
        setAvailableTags(tagsDto.items.map((tag) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    loadTags();
  }, []);

  const handleAgeChange = (value: string) => {
    setSelectedPostAge(value);
    setSelectedDateRange(undefined);
    // Reset the date range when a predefined age range is selected
    if (value) {
      const now = new Date();
      if (value === "this-week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7); // Set start to 7 days ago
        setStartDate(weekStart);
        setEndDate(now);
      } else if (value === "this-month") {
        const monthStart = new Date(now);
        monthStart.setMonth(now.getMonth() - 1); // Set start to 1 month ago
        setStartDate(monthStart);
        setEndDate(now);
      } else if (value === "this-year") {
        const yearStart = new Date(now);
        yearStart.setFullYear(now.getFullYear() - 1); // Set start to 1 year ago
        setStartDate(yearStart);
        setEndDate(now);
      } else if (value === "this-day") {
        setStartDate(now);
        setEndDate(now);
      }
    }
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setStartDate(range.from || null);
    if (range.to) {
      // Set the end date to the last moment of the selected day
      const adjustedEndDate = new Date(range.to);
      adjustedEndDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
      setEndDate(adjustedEndDate);
    } else {
      setEndDate(null);
    }
  };

  const handleSubmit = () => {
    const formattedStartDate = startDate ? formatAsLocalDateTimeWithMillis(startDate) : null;
    const formattedEndDate = endDate ? formatAsLocalDateTimeWithMillis(endDate) : null;

    console.log(selectedTags, formattedStartDate, formattedEndDate, titleKeyword, contentKeyword);
    // Pass the values to the onSubmit function, including null for unselected dates
    onSubmit(selectedTags, formattedStartDate, formattedEndDate, titleKeyword, contentKeyword);
    setIsOpen(false);

  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Filter Posts</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Filter Posts</DialogTitle>
            <DialogDescription>Use the options below to filter posts by tags, date, title, and content keywords.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tag Selector */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags
                </label>
                <span className="text-muted-foreground text-sm">These tags are used to filter posts and may differ from the interests you selected during sign-up.</span>
              
              <TagsSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} availableTags={availableTags}/>
            </div>

            {/* Date Range Picker */}
            <label className="block text-sm font-medium mb-1">
                Date Range <span className="text-muted-foreground">(or select post age)</span>
              </label>
            <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedDateRange?.from ? (
              selectedDateRange.to ? (
                <>
                  {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                  {format(selectedDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedDateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            disabled={(date) =>
              date > new Date() || date < new Date("2024-10-30")
            }
            selected={selectedDateRange}
            onSelect={(range) => {
              setSelectedDateRange(range);
              if (range) { // Ensure range is not undefined
                handleDateRangeChange({from: range.from, to: range.to});
              } // Update the state
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>

            {/* Post Age Selector */}
            <div>
              <label className="block text-sm font-medium mb-1">Post Age</label>
              <Select onValueChange={(value) => {
                setSelectedPostAge(value);
                handleAgeChange(value); // Adjust the date range based on age selection
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select post age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-day">This Day</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title Keyword Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Title Keyword</label>
              <Input
                type="text"
                placeholder="Enter keyword for title"
                value={titleKeyword}
                onChange={(e) => setTitleKeyword(e.target.value)}
              />
            </div>

            {/* Content Keyword Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Content Keyword</label>
              <Input
                type="text"
                placeholder="Enter keyword for content"
                value={contentKeyword}
                onChange={(e) => setContentKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

