import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { getCompanyConfig } from '../constants/companies';

interface CompanyLogoProps {
  // Support passing company object, slug, or explicit props
  company?: string | { id?: string; slug?: string; name?: string; logoUrl?: string };
  slug?: string;
  name?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  imgClassName?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  slug: explicitSlug,
  name: explicitName,
  logoUrl: explicitLogoUrl,
  size = 'md',
  className,
  imgClassName,
}) => {
  // 1. Resolve Company Details
  let slug = explicitSlug || '';
  let name = explicitName || '';
  let logoUrl = explicitLogoUrl || '';

  if (typeof company === 'string') {
    slug = company;
  } else if (company && typeof company === 'object') {
    slug = company.slug || company.id || '';
    name = company.name || name;
    logoUrl = company.logoUrl || logoUrl;
  }

  const config = getCompanyConfig(slug);
  const companyName = name || config?.name || slug || 'Company';
  const aspectHint = config?.aspectHint || 'horizontal';

  // 2. Resolve Candidate Logo Asset Sources
  const candidateSources: string[] = [];

  // Priority 1: Configured Local Imported Asset from src/assets/company-logos/
  if (config?.logo) {
    candidateSources.push(config.logo);
  }

  // Priority 2: Relative public folder logo path /logos/<slug>.png
  if (slug) {
    const sLower = slug.toLowerCase().replace(/^comp-/, '');
    candidateSources.push(`/logos/${sLower}.png`);
    candidateSources.push(`/logos/${sLower}.jpg`);

    if (sLower === 'hdfc') candidateSources.push('/logos/hdfc_bank.png');
    if (sLower === 'jpmorgan') candidateSources.push('/logos/jpmorgan and chase.png');
    if (sLower === 'pwc') candidateSources.push('/logos/pwc (2).png');
  }

  // Priority 3: Passed explicit logoUrl (e.g. from backend or mock)
  if (logoUrl) {
    candidateSources.push(logoUrl);
  }

  const uniqueSources = Array.from(new Set(candidateSources.filter(Boolean)));

  const [srcIndex, setSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSrcIndex(0);
    setHasError(false);
  }, [slug, logoUrl]);

  const handleError = () => {
    if (srcIndex < uniqueSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const currentSrc = uniqueSources[srcIndex];

  // 3. Container Size Formatting
  const containerSizeClasses = {
    sm: 'w-9 h-9 rounded-lg p-1',
    md: 'w-12 h-12 rounded-xl p-1.5',
    lg: 'w-16 h-16 rounded-2xl p-2',
  }[size];

  // 4. Image Aspect Sizing (Preserve proportions, max-width/max-height rules)
  const imageAspectClasses = aspectHint === 'wide' || aspectHint === 'horizontal'
    ? 'max-w-[86%] max-h-[65%] w-auto h-auto object-contain'
    : 'max-w-[76%] max-h-[76%] w-auto h-auto object-contain';

  // Default container styling: Solid clean white background container (#FFFFFF)
  // Ensures dark/black text wordmarks & transparent PNGs are 100% visible against dark UI
  const defaultContainerClass = `${containerSizeClasses} bg-white border border-zinc-700/60 flex items-center justify-center shrink-0 shadow-md shadow-black/30 transition-transform group-hover:scale-105`;
  const containerStyle = className || defaultContainerClass;
  const imageStyle = imgClassName || imageAspectClasses;

  // 5. Initial Fallback Text (e.g. Google -> G, Microsoft -> MSFT, IBM -> IBM)
  const fallbackText = config?.fallbackText || companyName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() || 'C';

  return (
    <div className={containerStyle}>
      {!hasError && currentSrc ? (
        <img
          src={currentSrc}
          alt={companyName}
          onError={handleError}
          className={imageStyle}
        />
      ) : (
        // Reusable initial fallback badge
        <div className="w-full h-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-extrabold text-amber-400 select-none text-xs">
          {fallbackText || <Building2 className="w-1/2 h-1/2 text-amber-400" />}
        </div>
      )}
    </div>
  );
};
