// Server Component
import { fetchTags } from '@/services/postService';
import TagsSelector from '@/components/form/TagsSelector'; 

export default async function Tags() {
  const tagsDto = await fetchTags({ pageNumber: 0, pageSize: 100 });
  const tags = tagsDto.items.map((tag) => tag.name);

  return (
    <div>
      <TagsSelector selectedTags={[]} setSelectedTags={() => {}} availableTags={tags} />
    </div>
  );
}
