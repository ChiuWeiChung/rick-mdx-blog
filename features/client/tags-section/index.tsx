import { getTagOptions } from '@/actions/tags';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export default async function TagsSection() {
  const tags = await getTagOptions();
  return (
    <div className="m-4 flex max-w-3xl flex-wrap justify-center gap-4 rounded-lg bg-white p-4 shadow-md">
      {tags.map(tag => (
        //   TODO Link to tag page
        <Badge
          key={tag.value}
          variant="outline"
          className="cursor-pointer text-sm hover:bg-gray-100"
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}
