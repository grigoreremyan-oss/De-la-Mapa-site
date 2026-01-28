# Assistant Widget

## Установка виджета

Добавьте скрипт перед закрывающим тегом `</body>`:

```html
<script
  src="https://domain.com/assistant-widget/widget.js?v=1.0.0"
  data-config="https://domain.com/assistant-widget/config.json"
  defer>
</script>
```

## Админка

Откройте `/widget-admin/index.html` и настройте тексты, телефон и сторону отображения. Live preview показывает, как будет выглядеть виджет на мобильном экране.

## Изменение телефона и мессенджеров

Редактируйте поля **Телефон**, **WhatsApp**, **Telegram** в админке. Для сохранения в продакшн-конфиг потребуется подключить backend `PUT /assistant-widget/config.json`.

## Ограничения iOS / Android

* Виджет отображается при ширине экрана `≤ 768px`.
* Учтён safe-area отступ снизу: `16px + env(safe-area-inset-bottom)`.
* При `prefers-reduced-motion` анимации становятся более спокойными.
