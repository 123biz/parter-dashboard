-- ============================================================
-- 대리점 관리 대시보드 스키마
-- ============================================================

-- 대리점 테이블
CREATE TABLE partners (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  manager_name TEXT NOT NULL,
  phone       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'normal'
                CHECK (status IN ('normal', 'warning')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 상품 테이블
CREATE TABLE products (
  id              BIGSERIAL PRIMARY KEY,
  partner_id      BIGINT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  monthly_revenue BIGINT NOT NULL DEFAULT 0,  -- 월 매출액 (원)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_products_partner_id ON products(partner_id);
CREATE INDEX idx_partners_status ON partners(status);
