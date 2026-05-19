import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function ManifestoPage() {
  const t = useTranslations("Manifesto");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
