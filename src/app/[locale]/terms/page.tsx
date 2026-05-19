import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function TermsPage() {
  const t = useTranslations("Terms");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
