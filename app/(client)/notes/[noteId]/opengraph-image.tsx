import { ImageResponse } from 'next/og';
import { getNoteInfoById } from '@/actions/notes';

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image(props: { params: Promise<{ noteId: string }> }) {
  const params = await props.params;
  const note = await getNoteInfoById(params.noteId);

  if (!note) return new ImageResponse(<div>筆記不存在</div>);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {note.title}
      </div>
    )
  );
}
