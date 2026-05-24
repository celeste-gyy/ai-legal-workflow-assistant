import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-6">✅ 已完成确认</h1>
      <p className="text-lg max-w-2xl text-center mb-8">
        你已确认了解 AI 回答的局限性。如有需要，请务必咨询专业律师。
      </p>
      <Link
        href="/"
        className="rounded-md bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
      >
        返回首页
      </Link>
    </main>
  );
}