import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function TransparencyPage() {
  const t = useTranslations("Transparency");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
