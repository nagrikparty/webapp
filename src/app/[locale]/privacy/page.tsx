import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
