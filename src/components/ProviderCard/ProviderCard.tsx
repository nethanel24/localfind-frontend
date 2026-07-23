import { memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Provider, Coords } from "../../types";
import { getDistanceKm } from "../../utils/distance";
import { toWhatsappNumber } from "../../utils/phone";
import styles from "./ProviderCard.module.css";

interface ProviderCardProps {
  provider: Provider;
  coords?: Coords;
  isFavorite?: boolean;
  onToggleFavorite?: (providerId: string) => void;
}

const avatarPalettes = [
  { background: "var(--color-primary-light)", color: "var(--color-primary-medium)" },
  { background: "var(--amber-lt)", color: "var(--amber-dk)" },
  { background: "var(--purple-lt)", color: "var(--purple)" },
];

const KM_LABEL = String.fromCharCode(1511, 34, 1502);

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((part) => part[0]).join(" ");

const ProviderCard = ({ provider, coords, isFavorite, onToggleFavorite }: ProviderCardProps) => {
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

  return (
    <div className={styles.card}>
      <Link to={detailsHref} className={styles.main}>
        <div className={styles.avatar} style={palette}>{getInitials(provider.user?.name || "")}</div>

        <div className={styles.body}>
          <div className={styles.name}>{provider.user?.name}</div>
          <div className={styles.meta}>{metaText}</div>
        </div>

        <div className={styles.rating}><FontAwesomeIcon icon={faStar} /> {provider.rating.toFixed(1)}</div>
      </Link>

      <div className={styles.actions}>
        {onToggleFavorite && (
          <button className={styles.fav} onClick={() => onToggleFavorite(provider._id)} title={isFavorite ? "הסר מהשמורים" : "שמור"}>
            <FontAwesomeIcon icon={isFavorite ? faStar : faStarOutline} />
          </button>
        )}
        {phone && (
          <>
            <a href={waHref} target="_blank" rel="noreferrer" className={styles.wa}><FontAwesomeIcon icon={faWhatsapp} /></a>
            <a href={telHref} className={styles.tel}><FontAwesomeIcon icon={faPhone} /></a>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(ProviderCard);