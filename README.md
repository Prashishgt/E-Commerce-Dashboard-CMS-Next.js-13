# Sunday Supply

A small, runnable commerce project with a catalog CMS and a customer storefront. The CMS manages stores, billboards, categories, sizes, colors, products, and orders. The storefront has category and product pages, a saved bag, and checkout with cash on delivery or Stripe **test mode**.

## Start locally

Docker Desktop must be running. From this directory:

```sh
docker compose up --build -d
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3001
- Postgres: `localhost:5432` (`shop` / `shop` / `shop`)

The admin container pushes the Prisma schema and runs an idempotent sample seed on startup. It creates **Sunday Supply** (`demo-store`), six products, three categories, and two example orders. Admin access uses a local demo user. `LOCAL_DEMO_MODE` is intended for local use only, and Compose binds the ports to `127.0.0.1`.

Run `docker compose logs -f admin` to watch startup. Run `docker compose down` to stop the apps. The Postgres data volume persists; `docker compose down -v` removes the local database.

## Try the full flow

1. Browse the seeded collection at `http://localhost:3000`.
2. Add a product to the bag and choose **Cash on delivery** at checkout.
3. Open the admin's **Orders** page. Mark the order paid or fulfilled.
4. Edit a product or create a category in the CMS and refresh the storefront.

Images are public image URLs, so catalog editing needs no Cloudinary account.

## Stripe test checkout

Cash on delivery works without credentials. To enable Stripe, copy the root `.env.example` to `.env`, then add your Stripe **test** secret key and a local webhook signing secret:

```dotenv
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the admin container after editing this file. Forward Stripe test webhooks to `http://localhost:3001/api/webhook`, for example with the Stripe CLI:

```sh
stripe listen --forward-to localhost:3001/api/webhook
```

Use the `whsec_...` value printed by the listener. Stripe Checkout chooses eligible payment methods for the test account; cash on delivery is the additional local option. The order stays `awaiting_payment` until a signed `checkout.session.completed` or `checkout.session.async_payment_succeeded` event confirms payment. The success page is not used as proof of payment.

## App layout

- `admin/`: Next.js CMS, API, Prisma schema, and seed.
- `client/`: Next.js storefront and cart.
- `compose.yaml`: Postgres and both development servers.

The apps can also run outside Docker with Node and a Postgres server. Copy `admin/.env.example` to `admin/.env`, copy `client/.env.example` to `client/.env.local`, install each app's dependencies, run `npm run db:push` and `npm run db:seed` in `admin`, then start admin on port 3001 and client on port 3000. The Docker path is recommended on Windows because Prisma's native Windows binary may be blocked by application control.
