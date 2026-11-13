# DSCR Calculator Widget

A free, embeddable **DSCR (debt service coverage ratio) calculator** for real estate blogs, investor communities and agent websites. One script tag, no dependencies, no cookies, no lead capture.

**▶ Live demo:** https://faasfunding.github.io/dscr-calculator-widget/
**Full calculator:** [faasfunding.com/dscr-calculator](https://faasfunding.com/dscr-calculator/?utm_source=github&utm_medium=readme&utm_campaign=dscr_widget_repo)

## Embed it

```html
<div id="faas-dscr-calculator"></div>
<script src="https://faasfunding.com/embed/dscr-calculator.js" async></script>
```

You can place more than one on a page, and set the accent color for each:

```html
<div class="faas-dscr-widget" data-accent="#1D3366"></div>
```

| Attribute | Default | What it does |
|---|---|---|
| `data-accent` | `#cc1e1e` | Button and focus color (hex only) |

## What it calculates

- **Principal and interest** on an amortizing loan, or **interest-only** when that box is ticked
- **PITIA**: principal + interest + taxes + insurance + HOA
- **DSCR** = monthly rent ÷ PITIA
- **Monthly rent minus PITIA**

Many lenders look for a DSCR of about **1.00 to 1.25 or higher**, but methods and minimums vary by program. Learn more in [DSCR loan requirements](https://faasfunding.com/dscr-loan-requirements/?utm_source=github&utm_medium=readme&utm_campaign=dscr_widget_repo).

## Design notes

- Renders inside a **Shadow DOM**, so host-page CSS can't break it, and it can't leak styles into the host page.
- Vanilla JavaScript, about 7 KB, no build step.
- Accessible labels and numeric keyboards on mobile (`inputmode="decimal"`).
- No network requests, cookies or personal data. The only links are attribution links back to the full calculator.

## Self-hosting

Copy `dscr-calculator.js` to your own server and change the `src`. Please keep the attribution line in the footer.

## License

[MIT](LICENSE) © FAAS Funding

---

<sub>Educational estimates only. Not a rate quote, loan offer or commitment to lend. Programs are subject to underwriting and terms vary. [FAAS Funding](https://faasfunding.com/?utm_source=github&utm_medium=readme&utm_campaign=dscr_widget_repo) is a loan broker, not a lender.</sub>
