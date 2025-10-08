import React from "react";
import PropTypes from "prop-types";

// ====== Helpers ======
const DEFAULT_TARGETS = {
  tirInRangeMinPct: 70,
  cvMaxPct: 36,
  ppgMax: 9, // mmol/L
  fpgMin: 4,
  fpgMax: 7,
};

function mgdlToMmol(x) {
  return x / 18;
}

// DCCT-formule: eAG(mg/dL) ≈ 28.7 × HbA1c(%) − 46.7
function calcEagFromHbA1cPercent(hba1cPercent) {
  const eAGmgdl = 28.7 * hba1cPercent - 46.7;
  const eAGmmol = mgdlToMmol(eAGmgdl);
  // Round mmol value to 1 decimal place
  return { mgdl: round(eAGmgdl, 0), mmol: round(eAGmmol, 1) };
}

function round(num, dp = 1) {
  const f = Math.pow(10, dp);
  return (Math.round(num * f) / f).toFixed(dp);
}

function statusBadge(
  kind,
  label
) {
  return (
    <span
      className={`dr-badge dr-badge--${kind}`}
      aria-label={label}
      title={label}
    >
      {label}
    </span>
  );
}

function sectionVisible(
  key,
  show
) {
  return !show || show.includes(key);
}

// Placeholder for empty values
const EmptyValue = () => <div className="dr-tile__sub">Geen gegevens</div>;


// ====== Component ======
const DiabeticRapportValues = ({
  title = "Diabetessamenvatting",
  data,
  targetRanges,
  density = "comfortable",
  showSections,
  onTileClick,
}) => {
  const targets = { ...DEFAULT_TARGETS, ...(targetRanges || {}) };
  const densityClass = density === "compact" ? "dr--compact" : "dr--comfortable";

  const handleTileClick = (section) => {
    if (onTileClick) onTileClick(section);
  };

  // Helpers voor status
  const tirStatus = (tir) => {
    if (!tir) return null;
    const inRange = tir.inRangePct;
    if (inRange >= targets.tirInRangeMinPct) return statusBadge("ok", "Binnen doel");
    if (inRange >= targets.tirInRangeMinPct - 10) return statusBadge("warn", "Bijna doel");
    return statusBadge("alert", "Buiten doel");
  };

  const cvStatus = (cvPct) => {
    if (cvPct == null) return null;
    if (cvPct <= targets.cvMaxPct) return statusBadge("ok", "Stabiel");
    if (cvPct <= targets.cvMaxPct + 5) return statusBadge("warn", "Let op");
    return statusBadge("alert", "Variabel");
    };
  
  const valueStatus = (value, min, max) => {
    if (min != null && value < min) return statusBadge("alert", "Te laag");
    if (max != null && value > max) return statusBadge("alert", "Te hoog");

    if (min != null && max != null) {
        const range = max - min;
        if (range > 0 && (value < min + range * 0.1 || value > max - range * 0.1)) {
            return statusBadge("warn", "Rand");
        }
    }
    return statusBadge("ok", "Binnen doel");
  };

  // Normaliseer PPG/FPG naar mmol/L voor drempelvergelijking
  const fpgMmol =
    data.fpg?.value != null
      ? data.fpg.unit === "mg/dL"
        ? mgdlToMmol(data.fpg.value)
        : data.fpg.value
      : undefined;

  const ppgMmol =
    data.ppg?.value != null
      ? data.ppg.unit === "mg/dL"
        ? mgdlToMmol(data.ppg.value)
        : data.ppg.value
      : undefined;

  // eAG vanuit HbA1c% (indien % aangeleverd)
  const eAG =
    data.hbA1c?.unit === "%" && data.hbA1c.value != null
      ? calcEagFromHbA1cPercent(data.hbA1c.value)
      : null;

  return (
    <section className={`dr-card ${densityClass}`} aria-live="polite">
      <header className="dr-card__header">
        <h2 className="dr-card__title">{title}</h2>
        {data.updatedAt && (
          <time
            className="dr-card__meta"
            dateTime={data.updatedAt}
            title={new Date(data.updatedAt).toLocaleString()}
          >
            Laatst bijgewerkt:{" "}
            {new Date(data.updatedAt).toLocaleDateString()}
          </time>
        )}
      </header>

      <div className="dr-grid">
        {/* HbA1c */}
        {sectionVisible("hbA1c", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("hbA1c")}
            aria-label="HbA1c"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">HbA1c</span>
            </div>
            {data.hbA1c ? (
              <>
                <div className="dr-tile__value">
                  {data.hbA1c.value} {data.hbA1c.unit}
                </div>
                {eAG && (
                  <div className="dr-tile__sub">
                    eAG: {eAG.mmol} mmol/L ({eAG.mgdl} mg/dL)
                  </div>
                )}
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {/* Gemiddelde glucose */}
        {sectionVisible("avgGlucose", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("avgGlucose")}
            aria-label="Gemiddelde glucose"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Gemiddelde glucose</span>
            </div>
            {data.avgGlucose && Object.keys(data.avgGlucose.values).length > 0 ? (
              <div className="dr-avglist" role="list" aria-label="Gemiddelden per periode">
                {([ "7d", "14d", "30d", "90d", "180d"]).map((k) =>
                  data.avgGlucose.values[k] != null ? (
                    <div key={k} className="dr-avglist__row" role="listitem">
                      <span className="dr-avglist__key">{k}</span>
                      <span className="dr-avglist__value">
                        {/* Round to 1 decimal place */}
                        {round(data.avgGlucose.values[k], 1)} {data.avgGlucose.unit}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {/* Time in Range */}
        {sectionVisible("timeInRange", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("timeInRange")}
            aria-label="Time in Range"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Time in Range</span>
              {data.timeInRange && <span className="dr-tile__status">{tirStatus(data.timeInRange)}</span>}
            </div>
            {data.timeInRange ? (
              <>
                <div className="dr-tile__value">
                  {data.timeInRange.inRangePct}% in bereik
                </div>
                <div className="dr-tile__sub">
                  {data.timeInRange.belowRangePct}% laag · {data.timeInRange.aboveRangePct}% hoog
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {/* CV */}
        {sectionVisible("cvPct", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("cvPct")}
            aria-label="Glucosevariabiliteit"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Variabiliteit (CV)</span>
              {data.cvPct != null && <span className="dr-tile__status">{cvStatus(data.cvPct)}</span>}
            </div>
            {data.cvPct != null ? (
              <>
                <div className="dr-tile__value">{round(data.cvPct, 0)}%</div>
                <div className="dr-tile__sub">Doel: ≤ {DEFAULT_TARGETS.cvMaxPct}%</div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {/* FPG */}
        {sectionVisible("fpg", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("fpg")}
            aria-label="Nuchtere glucose"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Nuchter (FPG)</span>
              {fpgMmol != null && (
                <span className="dr-tile__status">
                  {valueStatus(fpgMmol, targets.fpgMin, targets.fpgMax)}
                </span>
              )}
            </div>
            {data.fpg ? (
              <>
                <div className="dr-tile__value">
                  {data.fpg.value} {data.fpg.unit}
                </div>
                <div className="dr-tile__sub">
                  Doel: {targets.fpgMin}–{targets.fpgMax} mmol/L
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {/* PPG */}
        {sectionVisible("ppg", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("ppg")}
            aria-label="Postprandiale glucose"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Na maaltijd (PPG)</span>
              {ppgMmol != null && (
                <span className="dr-tile__status">
                  {valueStatus(ppgMmol, undefined, targets.ppgMax)}
                </span>
              )}
            </div>
            {data.ppg ? (
              <>
                <div className="dr-tile__value">
                  {data.ppg.value} {data.ppg.unit}
                </div>
                <div className="dr-tile__sub">
                  {data.ppg.atMinutes ? `${data.ppg.atMinutes} min · ` : ""}Doel: ≤ {targets.ppgMax} mmol/L
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {/* Ketonen */}
        {sectionVisible("ketones", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("ketones")}
            aria-label="Ketonen"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Ketonen</span>
            </div>
            {data.ketones ? (
              <div className="dr-tile__value">
                {data.ketones.value} {data.ketones.unit}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {/* Lifestyle */}
        {sectionVisible("lifestyle", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("lifestyle")}
            aria-label="Leefstijl"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Leefstijl</span>
            </div>
            {data.lifestyle && Object.keys(data.lifestyle).length > 0 ? (
              <div className="dr-list">
                {data.lifestyle.carbsPerDayGrams != null && (
                  <div className="dr-list__row"><span>Koolhydraten</span><span>{data.lifestyle.carbsPerDayGrams} g/dag</span></div>
                )}
                {data.lifestyle.activityMinutes != null && (
                  <div className="dr-list__row"><span>Beweging</span><span>{data.lifestyle.activityMinutes} min/dag</span></div>
                )}
                {data.lifestyle.sleepHours != null && (
                  <div className="dr-list__row"><span>Slaap</span><span>{round(data.lifestyle.sleepHours, 1)} u</span></div>
                )}
                {data.lifestyle.sleepQualityPct != null && (
                  <div className="dr-list__row"><span>Slaapkwaliteit</span><span>{round(data.lifestyle.sleepQualityPct, 0)}%</span></div>
                )}
                {data.lifestyle.stressScore != null && (
                  <div className="dr-list__row"><span>Stress</span><span>{data.lifestyle.stressScore}/10</span></div>
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {/* Vitals */}
        {sectionVisible("vitals", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("vitals")}
            aria-label="Vitale waarden"
          >
            <div className="dr-tile__head">
              <span className="dr-tile__title">Vitale waarden</span>
            </div>
            {data.vitals && Object.keys(data.vitals).length > 0 ? (
              <div className="dr-list">
                {data.vitals.systolic != null && data.vitals.diastolic != null && (
                  <div className="dr-list__row"><span>Bloeddruk</span><span>{data.vitals.systolic}/{data.vitals.diastolic} mmHg</span></div>
                )}
                {data.vitals.weightKg != null && (
                  <div className="dr-list__row"><span>Gewicht</span><span>{round(data.vitals.weightKg, 1)} kg</span></div>
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}
      </div>

      {/* Voetnoot / definities */}
      <footer className="dr-card__footer">
        <p className="dr-footnote">
          TIR = Time in Range (3.9–10 mmol/L). CV &le; {DEFAULT_TARGETS.cvMaxPct}% = stabielere glucose.
        </p>
      </footer>
    </section>
  );
};

DiabeticRapportValues.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    hbA1c: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['%', 'mmol/mol'])
    }),
    avgGlucose: PropTypes.shape({
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL']),
      values: PropTypes.objectOf(PropTypes.number)
    }),
    timeInRange: PropTypes.shape({
      inRangePct: PropTypes.number,
      belowRangePct: PropTypes.number,
      aboveRangePct: PropTypes.number
    }),
    cvPct: PropTypes.number,
    fpg: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL'])
    }),
    ppg: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL']),
      atMinutes: PropTypes.number
    }),
    ketones: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L'])
    }),
    lifestyle: PropTypes.shape({
        carbsPerDayGrams: PropTypes.number,
        activityMinutes: PropTypes.number,
        sleepHours: PropTypes.number,
        sleepQualityPct: PropTypes.number,
        stressScore: PropTypes.number,
    }),
    vitals: PropTypes.shape({
        systolic: PropTypes.number,
        diastolic: PropTypes.number,
        weightKg: PropTypes.number,
    }),
    updatedAt: PropTypes.string
  }).isRequired,
  targetRanges: PropTypes.shape({
    tirInRangeMinPct: PropTypes.number,
    cvMaxPct: PropTypes.number,
    ppgMax: PropTypes.number,
    fpgMin: PropTypes.number,
    fpgMax: PropTypes.number
  }),
  density: PropTypes.oneOf(['comfortable', 'compact']),
  showSections: PropTypes.arrayOf(PropTypes.string),
  onTileClick: PropTypes.func
};

export default DiabeticRapportValues;
