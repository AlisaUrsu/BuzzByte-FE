import React from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select";
import { fetchTags } from "@/services/postService";


export default function TagsSelector({
  selectedTags,
  setSelectedTags,
  availableTags
}: {
  selectedTags: string[];
  setSelectedTags: (categories: string[]) => void;
  availableTags: string[];
}) {

  return (
    <MultiSelector
      values={selectedTags}
      onValuesChange={setSelectedTags}
      loop
      className="max-w-xs"
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select categories" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {availableTags.map((tag) => (
            <MultiSelectorItem key={tag} value={tag}>
              {tag}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
}
