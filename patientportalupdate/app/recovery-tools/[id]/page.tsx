import { notFound } from 'next/navigation';
import Link from 'next/link';

const TOOL_CONTENT: Record<string, { title: string; description: string; content: React.ReactNode }> = {
  '478': {
    title: '4-7-8 Breathing Exercise',
    description: 'A calming breathwork technique to help reduce stress and anxiety.',
    content: (
      <>
        <h2 className="text-2xl font-bold mb-2">4-7-8 Breathing Exercise</h2>
        <p className="mb-4">Follow these steps:</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Inhale quietly through your nose for 4 seconds</li>
          <li>Hold your breath for 7 seconds</li>
          <li>Exhale completely through your mouth for 8 seconds</li>
          <li>Repeat for 4 breath cycles</li>
        </ol>
        <p className="mb-4">This technique can help calm your nervous system and reduce stress. Try it whenever you need a reset.</p>
      </>
    )
  }
};

export default function RecoveryToolPage({ params }: { params: { id: string } }) {
  const tool = TOOL_CONTENT[params.id];

  if (!tool) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Tool Not Found</h1>
        <p className="mb-4">Sorry, we couldn&apos;t find that recovery tool.</p>
        <Link href="/recovery-tools" className="text-blue-600 underline">Back to Recovery Tools</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{tool.title}</h1>
      <p className="mb-6 text-gray-700">{tool.description}</p>
      <div>{tool.content}</div>
      <div className="mt-8">
        <Link href="/recovery-tools" className="text-blue-600 underline">Back to Recovery Tools</Link>
      </div>
    </div>
  );
} 