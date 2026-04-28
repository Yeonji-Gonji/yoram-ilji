import PlaygroundClient from '@/components/playground/PlaygroundClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground | 요람일지',
  description: 'Python 코드를 웹 브라우저에서 바로 실행해보세요.',
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
