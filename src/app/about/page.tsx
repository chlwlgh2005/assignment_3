'use client';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="text-lg">Learn more about our mission and vision.</p>
      <div className="mt-8 text-center">
        <p className="text-xl font-semibold text-gray-800">이 홈페이지는 여러분이 자유롭게 펀딩을 열고 관심있는 프로젝트에 후원하기 위해 만들어졌습니다.</p>
        <p className="text-lg text-red-600 font-bold mt-4">결제 프로그램은 없어요, 교수님.</p>
      </div>
    </main>
  );
}
