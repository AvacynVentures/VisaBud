-- ============================================================================
-- Seed: Insert initial prices (matches current Stripe products)
-- Run AFTER creating the prices table
-- Update the stripe_price_id and stripe_product_id values to match your
-- actual Stripe dashboard values before running.
-- ============================================================================

INSERT INTO public.prices (tier, price_gbp, price_pence, stripe_price_id, stripe_product_id, is_active)
VALUES
  ('standard', 50.00, 5000, 'price_1TLJsF2F2Knncp2Pr66XqlWA', 'prod_UJxnonMaExi89i', true),
  ('premium', 149.00, 14900, 'price_1TLJt82F2Knncp2PkA4OsgYh', 'prod_UJxotFUa1oKLJv', true),
  ('expert', 299.00, 29900, 'price_1TLJuC2F2Knncp2PnSFp3yn9', 'prod_UJxpGbUC36d3Tb', true)
ON CONFLICT (tier) DO UPDATE SET
  price_gbp = EXCLUDED.price_gbp,
  price_pence = EXCLUDED.price_pence,
  stripe_price_id = EXCLUDED.stripe_price_id,
  stripe_product_id = EXCLUDED.stripe_product_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
