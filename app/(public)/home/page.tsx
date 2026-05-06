import UserProfile from '@/features/home/components/UserProfile';

/**
 * HOME PAGE — Server Component.
 * UserProfile is a client component (interactive elements),
 * but the page itself is a server component.
 */
export default function HomePage() {
  return <UserProfile />;
}
