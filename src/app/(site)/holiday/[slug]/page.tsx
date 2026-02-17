import { getHolidayBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import HolidayContent from "@/components/holiday-detail/HolidayContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const holiday = getHolidayBySlug(slug);

  if (!holiday) {
    return {
      title: "Holiday Not Found",
    };
  }

  return {
    title: `${holiday.title} - World Timeline`,
    description: holiday.description,
    openGraph: {
      title: holiday.title,
      description: holiday.description,
      images: [holiday.coverImage],
    },
  };
}

export default async function HolidayPage({ params }: PageProps) {
  const { slug } = await params;
  const holiday = getHolidayBySlug(slug);

  if (!holiday) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <div className="p-4">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Timeline
          </Link>
        </div>

        <HolidayContent holiday={holiday} />
      </div>
    </div>
  );
}
