// Shared real-time filtering for /destinations and /packages.
// Reads and writes the querystring (shareable + back-button friendly), keeps
// the legacy `/vibe/{slug}` chip links and `#vibe=`/`?vibe=` deep-links
// working, and combines every active facet against each card's data-*
// attributes.

type Mode = "destinations" | "packages";

interface FilterState {
  keyword: string;
  vibes: Set<string>;
  region: string;
  month: number | null;
  duration: string;
  travellers: number;
  budget: string;
}

function readInitialState(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const vibes = new Set((params.get("vibe") ?? "").split(",").filter(Boolean));

  // Legacy deep-link support: `#vibe=slug` from earlier single-select chips.
  const hashMatch = window.location.hash.match(/^#vibe=(.+)$/);
  if (hashMatch && vibes.size === 0) vibes.add(hashMatch[1]);

  const monthParam = params.get("month");
  return {
    keyword: params.get("q") ?? "",
    vibes,
    region: params.get("region") ?? "",
    month: monthParam ? Number(monthParam) : null,
    duration: params.get("duration") ?? "",
    travellers: Math.min(8, Math.max(1, Number(params.get("travellers") ?? "1") || 1)),
    budget: params.get("budget") ?? "",
  };
}

function writeState(state: FilterState) {
  const params = new URLSearchParams();
  if (state.keyword) params.set("q", state.keyword);
  if (state.vibes.size > 0) params.set("vibe", [...state.vibes].join(","));
  if (state.region) params.set("region", state.region);
  if (state.month !== null) params.set("month", String(state.month));
  if (state.duration) params.set("duration", state.duration);
  if (state.travellers > 1) params.set("travellers", String(state.travellers));
  if (state.budget) params.set("budget", state.budget);

  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState(null, "", url);
}

function cardMatches(card: HTMLElement, state: FilterState, mode: Mode): boolean {
  if (state.keyword) {
    const haystack = card.dataset.search ?? "";
    if (!haystack.includes(state.keyword.trim().toLowerCase())) return false;
  }

  if (state.vibes.size > 0) {
    const cardVibes = (card.dataset.vibes ?? "").split(" ").filter(Boolean);
    if (!cardVibes.some((v) => state.vibes.has(v))) return false;
  }

  if (state.region && (card.dataset.region ?? "") !== state.region) return false;

  if (state.month !== null) {
    const months = (card.dataset.months ?? "")
      .split(",")
      .filter(Boolean)
      .map((m) => Number(m));
    if (!months.includes(state.month)) return false;
  }

  if (mode === "packages") {
    if (state.duration) {
      const days = Number(card.dataset.duration ?? "0");
      if (state.duration === "1-4" && !(days >= 1 && days <= 4)) return false;
      if (state.duration === "5-7" && !(days >= 5 && days <= 7)) return false;
      if (state.duration === "8+" && !(days >= 8)) return false;
    }

    if (state.budget) {
      const priceTo = Number(card.dataset.priceTo ?? "0");
      const estimatedTotal = priceTo * state.travellers;
      if (state.budget === "500" && !(estimatedTotal <= 500)) return false;
      if (state.budget === "1000" && !(estimatedTotal <= 1000)) return false;
      if (state.budget === "1500" && !(estimatedTotal <= 1500)) return false;
      if (state.budget === "1500+" && !(estimatedTotal > 1500)) return false;
    }
  }

  return true;
}

function updateEstimatedTotal(card: HTMLElement, travellers: number) {
  const el = card.querySelector<HTMLElement>("[data-est-total]");
  if (el) {
    if (travellers > 1) {
      const priceFrom = Number(card.dataset.priceFrom ?? "0") * travellers;
      const priceTo = Number(card.dataset.priceTo ?? "0") * travellers;
      el.textContent = `Est. total for ${travellers}: €${priceFrom}–€${priceTo}`;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  const enquireLink = card.querySelector<HTMLAnchorElement>("[data-est-enquire]");
  if (enquireLink) {
    const url = new URL(enquireLink.href, window.location.origin);
    url.searchParams.set("adults", String(travellers));
    enquireLink.href = `${url.pathname}${url.search}`;
  }
}

export function initListingFilters(mode: Mode) {
  const bar = document.getElementById("filter-bar");
  const grid = bar ? document.getElementById(bar.dataset.grid ?? "") : null;
  if (!bar || !grid) return;

  const cards = Array.from(grid.querySelectorAll<HTMLElement>(".listing-card"));
  const keywordInput = document.getElementById("filter-keyword") as HTMLInputElement | null;
  const vibeChips = Array.from(document.querySelectorAll<HTMLAnchorElement>("#filter-vibes .vibe-chip"));
  const regionSelect = document.getElementById("filter-region") as HTMLSelectElement | null;
  const monthSelect = document.getElementById("filter-month") as HTMLSelectElement | null;
  const durationSelect = document.getElementById("filter-duration") as HTMLSelectElement | null;
  const travellersInput = document.getElementById("filter-travellers") as HTMLInputElement | null;
  const budgetSelect = document.getElementById("filter-budget") as HTMLSelectElement | null;
  const clearBtn = document.getElementById("filter-clear");
  const emptyState = document.getElementById("filter-empty");
  const secondaryClearBtn = emptyState?.querySelector<HTMLButtonElement>(".filter-clear-secondary");
  const countEl = document.getElementById("filter-count");

  const state = readInitialState();

  function syncControlsFromState() {
    if (keywordInput) keywordInput.value = state.keyword;
    if (regionSelect) regionSelect.value = state.region;
    if (monthSelect) monthSelect.value = state.month !== null ? String(state.month) : "";
    if (durationSelect) durationSelect.value = state.duration;
    if (travellersInput) travellersInput.value = String(state.travellers);
    if (budgetSelect) budgetSelect.value = state.budget;
    vibeChips.forEach((chip) => {
      const active = !!chip.dataset.vibe && state.vibes.has(chip.dataset.vibe);
      chip.setAttribute("aria-pressed", String(active));
      chip.classList.toggle("bg-coral-600", active);
      chip.classList.toggle("text-white", active);
      chip.classList.toggle("bg-sand-100", !active);
      chip.classList.toggle("text-sand-700", !active);
      chip.classList.toggle("hover:bg-sand-200", !active);
    });
  }

  function render() {
    let visible = 0;
    cards.forEach((card) => {
      const match = cardMatches(card, state, mode);
      card.hidden = !match;
      if (match) visible += 1;
      if (mode === "packages") updateEstimatedTotal(card, state.travellers);
    });

    if (countEl) {
      countEl.textContent = `Showing ${visible} of ${cards.length} ${mode === "packages" ? "trip" : "destination"}${cards.length === 1 ? "" : "s"}`;
    }
    if (emptyState) emptyState.hidden = visible !== 0;
    grid.hidden = visible === 0;

    writeState(state);
  }

  keywordInput?.addEventListener("input", () => {
    state.keyword = keywordInput.value;
    render();
  });

  vibeChips.forEach((chip) => {
    const slug = chip.dataset.vibe;
    if (!slug) return;
    chip.addEventListener("click", (event) => {
      event.preventDefault();
      if (state.vibes.has(slug)) state.vibes.delete(slug);
      else state.vibes.add(slug);
      syncControlsFromState();
      render();
    });
    chip.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        chip.click();
      }
    });
  });

  regionSelect?.addEventListener("change", () => {
    state.region = regionSelect.value;
    render();
  });

  monthSelect?.addEventListener("change", () => {
    state.month = monthSelect.value ? Number(monthSelect.value) : null;
    render();
  });

  durationSelect?.addEventListener("change", () => {
    state.duration = durationSelect.value;
    render();
  });

  travellersInput?.addEventListener("input", () => {
    const n = Number(travellersInput.value);
    state.travellers = Number.isFinite(n) ? Math.min(8, Math.max(1, n)) : 1;
    render();
  });

  budgetSelect?.addEventListener("change", () => {
    state.budget = budgetSelect.value;
    render();
  });

  function clearAll() {
    state.keyword = "";
    state.vibes.clear();
    state.region = "";
    state.month = null;
    state.duration = "";
    state.budget = "";
    state.travellers = 1;
    syncControlsFromState();
    render();
  }

  clearBtn?.addEventListener("click", clearAll);
  secondaryClearBtn?.addEventListener("click", clearAll);

  window.addEventListener("popstate", () => {
    const fresh = readInitialState();
    state.keyword = fresh.keyword;
    state.vibes = fresh.vibes;
    state.region = fresh.region;
    state.month = fresh.month;
    state.duration = fresh.duration;
    state.travellers = fresh.travellers;
    state.budget = fresh.budget;
    syncControlsFromState();
    render();
  });

  syncControlsFromState();
  render();
}
