interface PublicationLinkSource {
  id: string;
  data: {
    paperSite?: string;
    projectUrl?: string;
    paperUrl?: string;
  };
}

export const getPublicationPrimaryHref = (publication: PublicationLinkSource) => {
  if (publication.data.paperSite) return `/publications/${publication.id}/`;
  if (publication.data.projectUrl) return publication.data.projectUrl;
  if (publication.data.paperUrl) return publication.data.paperUrl;
  return `/publications/${publication.id}/`;
};

interface PublicationImageSource {
  data: {
    image?: string;
    researchAreas?: readonly string[];
  };
}

const researchAreaFallbackImages: Record<string, string> = {
  'software-networks': '/assets/research/software-networks.jpg',
  'network-intelligence': '/assets/research/network-intelligence.jpg',
  'iot-systems': '/assets/research/iot-systems.jpg',
  'network-security': '/assets/research/network-security.jpg',
};

/**
 * Papers without a teaser figure fall back to the illustration of their first
 * research area, so the archive grid stays visually consistent.
 */
export const getPublicationImage = (publication: PublicationImageSource) =>
  publication.data.image?.trim()
    || researchAreaFallbackImages[publication.data.researchAreas?.[0] ?? '']
    || '/assets/research/software-networks.jpg';

interface PublicationSortSource {
  data: {
    image?: string;
    pubDate: Date;
  };
}

/**
 * Newest first, but papers still missing a cover figure sink to the end so the
 * grid does not open with a run of placeholder illustrations.
 */
export const comparePublications = (a: PublicationSortSource, b: PublicationSortSource) => {
  const hasImage = (item: PublicationSortSource) => (item.data.image ? 0 : 1);
  return hasImage(a) - hasImage(b) || b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
};
