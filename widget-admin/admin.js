const FORM = document.getElementById("widget-form");
const preview = document.getElementById("preview");
const embedCode = document.getElementById("embed-code");
const copyButton = document.getElementById("copy-code");

const defaultConfig = {
  version: 1,
  sideDefault: "right",
  texts: {
    bubble: "Как могу вам помочь? Нужна помощь с бронированием?"
  },
  phone: {
    enabled: true,
    tel: "+431234567"
  },
  messengers: [
    { id: "whatsapp", enabled: true, href: "https://wa.me/431234567" },
    { id: "telegram", enabled: true, href: "https://t.me/hotel" }
  ]
};

const state = {
  config: { ...defaultConfig }
};

const updatePreview = () => {
  preview.innerHTML = "";
  const container = document.createElement("div");
  container.className = `preview-widget ${state.config.sideDefault === "left" ? "left" : ""}`;

  const bubble = document.createElement("div");
  bubble.className = "preview-bubble";
  bubble.textContent = state.config.texts.bubble;

  const links = document.createElement("div");
  links.className = "preview-links";
  const phoneChip = document.createElement("div");
  phoneChip.className = "preview-chip";
  phoneChip.textContent = state.config.phone.tel || "Телефон";
  links.appendChild(phoneChip);

  state.config.messengers
    .filter((item) => item.enabled)
    .forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "preview-chip";
      chip.textContent = item.id;
      links.appendChild(chip);
    });

  const fab = document.createElement("div");
  fab.className = "preview-fab";
  fab.textContent = "LOGO";

  container.appendChild(bubble);
  container.appendChild(links);
  container.appendChild(fab);
  preview.appendChild(container);
};

const updateEmbedCode = () => {
  embedCode.textContent = `<script src="https://domain.com/assistant-widget/widget.js?v=1.0.0" data-config="https://domain.com/assistant-widget/config.json" defer></script>`;
};

const syncForm = () => {
  FORM.bubble.value = state.config.texts.bubble;
  FORM.phone.value = state.config.phone.tel;
  FORM.side.value = state.config.sideDefault;
  FORM.wa.value = state.config.messengers.find((item) => item.id === "whatsapp")?.href || "";
  FORM.tg.value = state.config.messengers.find((item) => item.id === "telegram")?.href || "";
};

FORM.addEventListener("input", () => {
  state.config.texts.bubble = FORM.bubble.value;
  state.config.phone.tel = FORM.phone.value;
  state.config.sideDefault = FORM.side.value;
  state.config.messengers = state.config.messengers.map((item) => {
    if (item.id === "whatsapp") {
      return { ...item, href: FORM.wa.value };
    }
    if (item.id === "telegram") {
      return { ...item, href: FORM.tg.value };
    }
    return item;
  });
  updatePreview();
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(embedCode.textContent);
  copyButton.textContent = "Скопировано";
  setTimeout(() => {
    copyButton.textContent = "Скопировать";
  }, 1500);
});

syncForm();
updatePreview();
updateEmbedCode();
