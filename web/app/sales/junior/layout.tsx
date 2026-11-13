import RoleLayout from '@/components/RoleLayout';

export default function LayoutJunior({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleLayout role="junior">{children}</RoleLayout>;
}
