import {
  Clock,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { business, toTelHref } from "@/config/business";
import WaveDivider from "./WaveDivider";

// Semantic footer: address, tap-to-call, WhatsApp, socials, hours, © year.
export default function MenuFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-line bg-shell px-6 pb-12 pt-9 text-center">
      <div className="flex justify-center">
        <WaveDivider />
      </div>

      <p className="mt-3 font-sans text-[15px] italic text-ink-soft">
        {business.tagline}
      </p>

      {/* Address */}
      <a
        href={business.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Adresi Google Haritalar'da aç"
        className="mx-auto mt-5 flex max-w-[280px] items-start justify-center gap-2 text-sm text-ink-soft"
      >
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sea" aria-hidden="true" />
        <span>{business.address.full}</span>
      </a>

      {/* Hours */}
      <p className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-soft">
        <Clock className="h-4 w-4 text-sea" aria-hidden="true" />
        {business.hours}
      </p>

      {/* Phones — tap to call */}
      <div className="mt-5 flex flex-col items-center gap-2">
        {business.phones.map((phone) => (
          <a
            key={phone}
            href={toTelHref(phone)}
            aria-label={`${phone} numarasını ara`}
            className="inline-flex min-h-[48px] w-full max-w-[280px] items-center justify-center gap-2 rounded-xl border border-line bg-foam px-4 text-sm font-semibold text-ink transition-colors active:bg-sea-wash"
          >
            <Phone className="h-4 w-4 text-sea" aria-hidden="true" />
            {phone}
          </a>
        ))}

        {/* WhatsApp */}
        <a
          href={business.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ile mesaj gönder"
          className="inline-flex min-h-[48px] w-full max-w-[280px] items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors active:bg-sea-deep"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp&apos;tan Yaz
        </a>
      </div>

      {/* Socials */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <a
          href={business.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram sayfamız"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-foam text-ink transition-colors active:bg-sea-wash"
        >
          <Instagram className="h-5 w-5 text-sea" aria-hidden="true" />
        </a>
        <a
          href={business.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook sayfamız"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-foam text-ink transition-colors active:bg-sea-wash"
        >
          <Facebook className="h-5 w-5 text-sea" aria-hidden="true" />
        </a>
      </div>

      <p className="mx-auto mt-7 max-w-[300px] text-[11px] leading-relaxed text-ink-muted">
        Menümüzde enerji (kalori) ve porsiyon bilgileri yer alır. İçerik ve
        alerjenler hakkında ayrıntılı bilgi için personelimize danışabilirsiniz.
      </p>

      <p className="mt-6 text-xs text-ink-muted">
        © {year} {business.name}
      </p>
    </footer>
  );
}
