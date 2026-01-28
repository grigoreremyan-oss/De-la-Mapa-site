(() => {
  const STORAGE_KEY = "assistant-widget-side";
  const DEFAULT_CONFIG_URL = "/assistant-widget/config.json";

  const getScriptTag = () => {
    if (document.currentScript) {
      return document.currentScript;
    }
    return document.querySelector('script[src*="assistant-widget/widget.js"]');
  };

  const resolveAssetUrl = (scriptEl, assetPath) => {
    if (!assetPath) {
      return "";
    }
    if (/^https?:/i.test(assetPath) || assetPath.startsWith("/")) {
      return assetPath;
    }
    if (!scriptEl || !scriptEl.src) {
      return assetPath;
    }
    const baseUrl = scriptEl.src.split("/").slice(0, -1).join("/");
    return `${baseUrl}/${assetPath}`;
  };

  const loadCss = (scriptEl) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    const cssPath = resolveAssetUrl(scriptEl, "widget.css");
    link.href = cssPath;
    document.head.appendChild(link);
  };

  const fetchConfig = async (url) => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load widget config");
    }
    return response.json();
  };

  const createElement = (tag, className) => {
    const el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    return el;
  };

  const buildWidget = (config, scriptEl) => {
    const root = createElement("div", "aw-root");
    root.dataset.open = "false";

    const savedSide = localStorage.getItem(STORAGE_KEY);
    const side = savedSide || config.sideDefault || "right";
    root.classList.add(side === "left" ? "aw-left" : "aw-right");

    const bubble = createElement("div", "aw-bubble");
    bubble.textContent = config.texts?.bubble || "";

    const panels = createElement("div", "aw-panels");

    const actionsRow = createElement("div", "aw-actions");
    (config.actions || [])
      .filter((action) => action.enabled)
      .forEach((action) => {
        const button = createElement("a", "aw-action");
        button.dataset.type = action.type;
        button.textContent = action.title;
        if (action.type === "link" && action.href) {
          button.href = action.href;
        } else {
          button.href = "#";
          button.addEventListener("click", (event) => {
            event.preventDefault();
            root.dataset.open = "false";
          });
        }
        actionsRow.appendChild(button);
      });

    const messengersCol = createElement("div", "aw-messengers");
    if (config.phone?.enabled && config.phone.tel) {
      const phoneLink = createElement("a", "aw-messenger");
      phoneLink.href = `tel:${config.phone.tel}`;
      phoneLink.textContent = config.phone.label || config.phone.tel;
      messengersCol.appendChild(phoneLink);
    }

    (config.messengers || [])
      .filter((item) => item.enabled)
      .forEach((item) => {
        const link = createElement("a", "aw-messenger");
        link.href = item.href || "#";
        if (item.iconUrl) {
          const icon = createElement("img");
          icon.alt = item.label || item.id;
          icon.src = resolveAssetUrl(scriptEl, item.iconUrl);
          link.appendChild(icon);
        }
        const label = document.createElement("span");
        label.textContent = item.label || item.id;
        link.appendChild(label);
        messengersCol.appendChild(link);
      });

    const sideToggle = createElement("button", "aw-side-toggle");
    sideToggle.type = "button";
    sideToggle.textContent = side === "left" ? "Версия для правши" : "Версия для левши";
    sideToggle.addEventListener("click", () => {
      const isLeft = root.classList.contains("aw-left");
      root.classList.toggle("aw-left", !isLeft);
      root.classList.toggle("aw-right", isLeft);
      const nextSide = isLeft ? "right" : "left";
      localStorage.setItem(STORAGE_KEY, nextSide);
      sideToggle.textContent = nextSide === "left" ? "Версия для правши" : "Версия для левши";
    });

    messengersCol.appendChild(sideToggle);

    panels.appendChild(actionsRow);
    panels.appendChild(messengersCol);

    const fab = createElement("button", "aw-fab");
    fab.type = "button";
    fab.setAttribute("aria-expanded", "false");

    if (config.fab?.logoUrl) {
      const logo = createElement("img");
      logo.alt = "Assistant";
      logo.src = resolveAssetUrl(scriptEl, config.fab.logoUrl);
      fab.appendChild(logo);
    } else {
      fab.textContent = "+";
    }

    fab.addEventListener("click", () => {
      const isOpen = root.dataset.open === "true";
      root.dataset.open = isOpen ? "false" : "true";
      fab.setAttribute("aria-expanded", String(!isOpen));
    });

    root.appendChild(bubble);
    root.appendChild(panels);
    root.appendChild(fab);

    return root;
  };

  const init = async () => {
    const scriptEl = getScriptTag();
    const configUrl = scriptEl?.dataset?.config || DEFAULT_CONFIG_URL;
    loadCss(scriptEl);

    try {
      const config = await fetchConfig(configUrl);
      const widget = buildWidget(config, scriptEl);
      document.body.appendChild(widget);
    } catch (error) {
      console.error("Assistant widget error:", error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
