import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Legal AI Trust Layer</h1>
      <p className="mb-8 text-lg text-gray-600">法律 AI 回答可信度评估系统</p>
      <Link
        href="/question"
        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        开始提问
      </Link>
    </main>
  );
}