import { useTranslations } from "next-intl";
import InstitutionalLayout from "@/components/layout/InstitutionalLayout";

export default function ContactPage() {
  const t = useTranslations("Contact");
  return <InstitutionalLayout title={t("title")} content={t("content")} />;
}
