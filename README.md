# Koushik Biswas — Portfolio

A responsive personal portfolio based on Koushik's CV, with dark and light themes, selected engineering projects, experience, education, résumé download, and an email contact form.

## Stack

Semantic HTML, CSS, vanilla JavaScript, and a dependency-free Node.js build. No secrets or API keys are required in the browser. CSS project previews are illustrations, not screenshots of the live applications.

## Run locally

Requires Node.js 22 or later. There are no dependencies to install.

```sh
npm run dev
```

Open `http://localhost:3000`. To validate and create the deployment output:

```sh
npm run check
npm run build
```

The build writes public website files to `dist/` only. It excludes source tooling and deployment configuration.

## Contact form: one-time activation

The form submits to **koushikbiswas2423@gmail.com** through [FormSubmit](https://formsubmit.co/). A live submission triggers a confirmation email the first time the address is used for this form. **Open that email and click Activate Form** to enable delivery. Check Spam if it is missing. FormSubmit keeps pending submissions for 30 days according to its [help page](https://formsubmit.co/help).

The form includes required fields, email validation, a honeypot, duplicate-submit prevention, a timeout, and visible success/error feedback. Messages remain in the form if the network fails. The visitor's email is included as Reply-To. JavaScript-disabled browsers use a normal form POST, including the provider's verification flow. All messages depend on FormSubmit's availability and email activation. Do not add private keys to frontend code.

To test the real email path after deployment, submit a short message using an email address you control, activate the form in Gmail, and confirm the submission arrives. Browser UI tests with mocked responses do not prove email delivery.

## GitHub Pages deployment

The optional `.github/workflows/pages.yml` workflow checks and builds the portfolio and publishes `dist/` when manually triggered from the Actions tab after Pages has been enabled. Vercel handles automatic deployments from `main` when the repository is linked.

**First-time account setup:** In this repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. The GitHub connector can push source, but it does not expose the administration operation needed to enable Pages. After enabling Pages, rerun the deployment workflow if necessary. Once GitHub reports a successful deployment, the default project URL is `https://koushik-biswas.github.io/Portfolio/`.

All local assets use relative paths to support this project subdirectory. No custom domain is required.

## Vercel deployment

Import `Koushik-Biswas/Portfolio` into your Vercel account and select the free Hobby plan when eligible. The included `vercel.json` sets the build command to `npm run build`, the framework to Other, and the output directory to `dist`. No environment variables are needed.

If Vercel becomes the primary host, update the URLs in `robots.txt`, `sitemap.xml`, and the `og:image` tag to the verified production domain. The site itself works at either host without changing asset URLs. The contact form does not depend on a Vercel function.

## Edit content

- `index.html`: biography, project links, experience, skills, contact details, metadata, and form recipient.
- `styles.css`: navy/white themes, responsive layouts, CSS interface illustrations, and reduced-motion support.
- `app.js`: theme preference, mobile navigation, current section, and contact form behavior.
- `assets/Koushik-Biswas-Resume.pdf`: supplied résumé.

The supplied CV is the source for personal claims. Project descriptions avoid implying unverified encryption or production scale. Live demo links are those embedded in the CV and can depend on the original applications' availability.
