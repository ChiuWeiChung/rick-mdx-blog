import { TableTag } from '@/actions/tags/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import React from 'react';

interface TagsSectionProps {
  tags: TableTag[];
}

export default function TagsSection({ tags }: TagsSectionProps) {
  return (
    <div className="flex max-w-3xl flex-wrap justify-center gap-4 rounded-lg bg-white p-4 shadow-md">
      {tags.map(tag => (
        //   TODO Link to tag page
        <Link href={`/tags/${tag.id}`} key={tag.id}>
          <Badge variant="outline" className="cursor-pointer text-sm hover:bg-gray-100">
            {tag.name} ({tag.postCount})
          </Badge>
        </Link>
      ))}
    </div>
  );
}
