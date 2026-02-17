"use client";

import { useEffect, use } from "react";
import { getHolidayBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { useHolidayStore } from "@/store/useHolidayStore";
import Modal from "@/components/ui/Modal";
import HolidayContent from "@/components/holiday-detail/HolidayContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function HolidayModalPage({ params }: PageProps) {
  const { slug } = use(params);
  const holiday = getHolidayBySlug(slug);
  const { setActiveHolidayId, setFocusPoint } = useHolidayStore();

  useEffect(() => {
    if (holiday) {
      setActiveHolidayId(holiday.id);
      setFocusPoint(holiday.coordinates);
    }
  }, [holiday, setActiveHolidayId, setFocusPoint]);

  if (!holiday) {
    notFound();
  }

  return (
    <Modal>
      <HolidayContent holiday={holiday} />
    </Modal>
  );
}
