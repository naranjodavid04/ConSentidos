import Link from "next/link";

import { BannerForm } from "../banner-form";

export default function NewBannerPage() {
  return (
    <div>
      <Link
        href="/admin/banners"
        className="text-ink-soft hover:text-pink text-sm"
      >
        ← Volver a banners
      </Link>
      <h1 className="font-display text-ink mt-3 text-2xl">Nuevo banner</h1>
      <BannerForm />
    </div>
  );
}
