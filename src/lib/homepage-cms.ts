import { getHomepageContentFromPostgres, HomepageSectionRecord } from "@/lib/db";
import { DEFAULT_HOMEPAGE_CMS } from "@/lib/catalogue-taxonomy";
import { HomePageCmsData } from "@/types";

export interface MergedHomepagePayload {
  cms: HomePageCmsData;
  sections: HomepageSectionRecord[];
  fallback: boolean;
}

/**
 * Fetches homepage CMS sections from Supabase PostgreSQL and merges them with defaults.
 */
export async function getMergedHomepageCmsFromPostgres(): Promise<MergedHomepagePayload> {
  try {
    const sections = await getHomepageContentFromPostgres();
    const byKey = new Map(sections.map((s) => [s.section_key, s]));

    const heroRow = byKey.get("hero");
    const announcementRow = byKey.get("announcement");
    const spotlightRow = byKey.get("spotlight");
    const visualizerRow = byKey.get("visualizer");
    const whyRow = byKey.get("why_candela");

    const heroExtra =
      heroRow?.extra_data && typeof heroRow.extra_data === "object"
        ? heroRow.extra_data
        : {};

    const cms: HomePageCmsData = {
      ...DEFAULT_HOMEPAGE_CMS,
      ...(heroExtra as Partial<HomePageCmsData>),
      heroTitle: heroRow?.title || DEFAULT_HOMEPAGE_CMS.heroTitle,
      heroTagline: heroRow?.subtitle || DEFAULT_HOMEPAGE_CMS.heroTagline,
      heroDescription: heroRow?.description || DEFAULT_HOMEPAGE_CMS.heroDescription,
      heroBgImage: heroRow?.image_url || DEFAULT_HOMEPAGE_CMS.heroBgImage,
      heroCtaPrimaryText: heroRow?.cta_text || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryText,
      heroCtaPrimaryUrl: heroRow?.cta_url || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryUrl,
      announcementText:
        announcementRow?.subtitle ||
        announcementRow?.title ||
        DEFAULT_HOMEPAGE_CMS.announcementText,
      spotlightTitle: spotlightRow?.title || DEFAULT_HOMEPAGE_CMS.spotlightTitle,
      spotlightEyebrow: spotlightRow?.subtitle || DEFAULT_HOMEPAGE_CMS.spotlightEyebrow,
      spotlightDescription:
        spotlightRow?.description || DEFAULT_HOMEPAGE_CMS.spotlightDescription,
      spotlightImage: spotlightRow?.image_url || DEFAULT_HOMEPAGE_CMS.spotlightImage,
      visualizerTitle: visualizerRow?.title || DEFAULT_HOMEPAGE_CMS.visualizerTitle,
      visualizerEyebrow:
        visualizerRow?.subtitle || DEFAULT_HOMEPAGE_CMS.visualizerEyebrow,
      visualizerDescription:
        visualizerRow?.description || DEFAULT_HOMEPAGE_CMS.visualizerDescription,
      visualizerImage:
        visualizerRow?.image_url || DEFAULT_HOMEPAGE_CMS.visualizerImage,
      whyCandelaTitle: whyRow?.title || DEFAULT_HOMEPAGE_CMS.whyCandelaTitle,
      whyCandelaEyebrow: whyRow?.subtitle || DEFAULT_HOMEPAGE_CMS.whyCandelaEyebrow,
      whyCandelaDescription:
        whyRow?.description || DEFAULT_HOMEPAGE_CMS.whyCandelaDescription,
    };

    return { cms, sections, fallback: false };
  } catch (err) {
    console.error("Failed to fetch homepage CMS from PostgreSQL:", err);
    return { cms: DEFAULT_HOMEPAGE_CMS, sections: [], fallback: true };
  }
}

