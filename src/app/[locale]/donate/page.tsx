import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function DonatePage() {
  const t = useTranslations("Donate");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
