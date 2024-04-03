"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootPath = "bookings";
  const slugs = [
    { slug: "id", value: "" },
    { slug: "action", value: "" },
  ];
  const segments = useSelectedLayoutSegments();

  for (let i = 0; i < segments.length; i++) {
    slugs[i].value = segments[i];
  }

  const filteredSlugs = [{ slug: rootPath, value: rootPath }, ...slugs].filter(
    (slug) => slug.value
  );

  return (
    <div>
      {filteredSlugs.length === 1 ? null : (
        <Breadcrumb>
          <BreadcrumbList>
            {filteredSlugs.map((seg, i) => (
              <React.Fragment key={`segment-${i}`}>
                {i ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {filteredSlugs.length === i + 1 ? (
                    <BreadcrumbPage className="capitalize">
                      {seg.slug}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={
                          seg.value === rootPath
                            ? "/bookings"
                            : `/bookings/${seg.value}`
                        }
                        className="capitalize"
                      >
                        {seg.slug}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      {children}
    </div>
  );
}
