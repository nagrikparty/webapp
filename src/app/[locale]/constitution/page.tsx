import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function ConstitutionPage() {
  const t = useTranslations("Constitution");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
