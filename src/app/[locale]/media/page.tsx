import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function MediaPage() {
  const t = useTranslations("Media");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
