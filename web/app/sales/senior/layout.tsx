import RoleLayout from '@/components/RoleLayout';

export default function LayoutSenior({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleLayout role="senior">{children}</RoleLayout>;
}
