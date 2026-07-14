import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { ExternalLink, MapPin, Navigation } from "lucide-react";

interface RestaurantMapProps {
  name: string;
  address?: string | null;
  mapUrl?: string | null;
  className?: string;
  mapClassName?: string;
  compact?: boolean;
}

const defaultCenter = { lat: 10.8231, lng: 106.6297 };
const unknownAddress = "Chưa cập nhật địa chỉ";

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const buildMapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const buildMapsDirectionsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

const buildEmbedUrl = (query: string, mapUrl?: string | null) => {
  if (mapUrl?.includes("/maps/embed")) {
    return mapUrl;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

export default function RestaurantMap({
  name,
  address,
  mapUrl,
  className = "",
  mapClassName,
  compact = false,
}: RestaurantMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const cleanedAddress = address?.trim();
  const query = useMemo(
    () => [name, cleanedAddress].filter(Boolean).join(", "),
    [name, cleanedAddress],
  );
  const canSearchLocation = query.length > 0 && cleanedAddress !== unknownAddress;
  const externalUrl = mapUrl || buildMapsSearchUrl(query);
  const directionsUrl = buildMapsDirectionsUrl(query);
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [useEmbedFallback, setUseEmbedFallback] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "chaynow-google-map",
    googleMapsApiKey: apiKey || "",
  });

  useEffect(() => {
    if (!isLoaded || !canSearchLocation) {
      setPosition(null);
      setUseEmbedFallback(false);
      return;
    }

    const geocoder = new google.maps.Geocoder();
    let cancelled = false;

    setUseEmbedFallback(false);
    geocoder.geocode({ address: query, region: "VN" }, (results, status) => {
      if (cancelled) return;

      const location = results?.[0]?.geometry.location;
      if (status === "OK" && location) {
        setPosition({ lat: location.lat(), lng: location.lng() });
        return;
      }

      console.warn("Google Maps geocode fallback:", status);
      setPosition(null);
      setUseEmbedFallback(true);
    });

    return () => {
      cancelled = true;
    };
  }, [canSearchLocation, isLoaded, query]);

  const headerPadding = compact ? "p-4" : "p-4 sm:p-5";
  const mapHeight = mapClassName || (compact ? "h-56" : "h-80");
  const shouldShowEmbed = canSearchLocation && (!apiKey || loadError || useEmbedFallback);

  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className={`flex flex-col gap-3 border-b border-slate-100 ${headerPadding}`}>
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Bản đồ
          </p>
          {!compact && <h2 className="mt-1 text-base font-bold text-slate-900">{name}</h2>}
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {cleanedAddress || unknownAddress}
          </p>
        </div>

        {canSearchLocation && (
          <div className="flex gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Navigation className="h-4 w-4" />
              Chỉ đường
            </a>
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Mở trong Google Maps"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      {!canSearchLocation ? (
        <MapStateMessage mapHeight={mapHeight} message="Chưa có đủ thông tin để hiển thị bản đồ." />
      ) : shouldShowEmbed ? (
        <iframe
          title={`Bản đồ ${name}`}
          src={buildEmbedUrl(query, mapUrl)}
          className={`w-full border-0 ${mapHeight}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : !isLoaded ? (
        <MapStateMessage mapHeight={mapHeight} message="Đang tải bản đồ..." />
      ) : (
        <GoogleMap
          center={position || defaultCenter}
          zoom={position ? 16 : 12}
          mapContainerClassName={`w-full ${mapHeight}`}
          options={mapOptions}
        >
          {position && <MarkerF position={position} title={name} />}
        </GoogleMap>
      )}
    </section>
  );
}

function MapStateMessage({
  mapHeight,
  message,
}: {
  mapHeight: string;
  message: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-50 px-6 text-center ${mapHeight}`}>
      <MapPin className="h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm font-semibold text-slate-700">{message}</p>
    </div>
  );
}
