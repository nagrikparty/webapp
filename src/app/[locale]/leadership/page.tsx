import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function LeadershipPage() {
  const t = useTranslations("Leadership");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
