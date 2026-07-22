import { memo } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Provider, Coords } from "../../types";
import { getDistanceKm } from "../../utils/distance";
import { toWhatsappNumber } from "../../utils/phone";
import styles from "./ProviderCard.module.css";

interface ProviderCardProps {
  provider: Provider;
  coords?: Coords;
}

const avatarPalettes = [
  { background: "var(--color-primary-light)", color: "var(--color-primary-medium)" },
  { background: "var(--amber-lt)", color: "var(--amber-dk)" },
  { background: "var(--purple-lt)", color: "var(--purple)" },
];

const KM_LABEL = String.fromCharCode(1511, 34, 1502);

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const ProviderCard = ({ provider, coords }: ProviderCardProps) => {
  const palette =
    avatarPalettes[provider._id.charCodeAt(provider._id.length - 1) % 3];

  const distance =
    coords && provider.location?.coordinates
      ? getDistanceKm(
          coords.lat,
          coords.lng,
          provider.location.coordinates[1],
          provider.location.coordinates[0]
        )
      : null;

  const phone = provider.user?.phone;
  const detailsHref = "/providers/" + provider._id;
  const waHref = phone ? "https://wa.me/" + toWhatsappNumber(phone) : "";
  const telHref = phone ? "tel:" + phone : "";

  const metaText =
    (provider.category?.name || "") +
    (distance !== null ? " - " + distance.toFixed(1) + " " + KM_LABEL : "") +
    " - " +
    provider.price;

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <Link to={detailsHref} className={styles.card}>
      <div className={styles.avatar} style={palette}>{getInitials(provider.user?.name || "")}</div>

      <div className={styles.body}>
        <div className={styles.name}>{provider.user?.name}</div>
        <div className={styles.meta}>{metaText}</div>
      </div>

      <div className={styles.rating}><FontAwesomeIcon icon={faStar} /> {provider.rating.toFixed(1)}</div>

      {phone && (
        <div className={styles.actions}>
          <a href={waHref} target="_blank" rel="noreferrer" className={styles.wa} onClick={stop}><FontAwesomeIcon icon={faWhatsapp} /></a>
          <a href={telHref} className={styles.tel} onClick={stop}><FontAwesomeIcon icon={faPhone} /></a>
        </div>
      )}
    </Link>
  );
};

export default memo(ProviderCard);