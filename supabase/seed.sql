-- ============================================================
-- 시드 데이터 — 서울 대리점 10개 + 취급 상품
-- ============================================================

-- 1. 대리점
INSERT INTO partners (name, address, lat, lng, manager_name, phone, status) VALUES
  ('강남 전자유통',     '서울특별시 강남구 테헤란로 152',        37.5000, 127.0365, '김민준', '02-1234-5678', 'normal'),
  ('서초 종합상사',     '서울특별시 서초구 반포대로 58',          37.5037, 127.0050, '이서연', '02-9876-5432', 'normal'),
  ('중구 물류센터',     '서울특별시 중구 을지로 30',              37.5660, 126.9954, '박지훈', '02-3456-7890', 'warning'),
  ('마포 테크파트너',   '서울특별시 마포구 월드컵북로 396',       37.5822, 126.8890, '최수아', '02-7654-3210', 'normal'),
  ('강동 유통망',       '서울특별시 강동구 천호대로 1077',        37.5484, 127.1478, '정도현', '02-2345-6789', 'warning'),
  ('영등포 비즈허브',   '서울특별시 영등포구 여의대로 128',       37.5219, 126.9247, '한예진', '02-5678-9012', 'normal'),
  ('용산 테크센터',     '서울특별시 용산구 한강대로 23길 55',     37.5293, 126.9642, '오재원', '02-8901-2345', 'normal'),
  ('노원 대리점',       '서울특별시 노원구 동일로 1410',          37.6554, 127.0632, '신미래', '02-3456-7891', 'warning'),
  ('성동 솔루션',       '서울특별시 성동구 왕십리로 83',          37.5613, 127.0374, '임태양', '02-9012-3456', 'normal'),
  ('강서 파트너스',     '서울특별시 강서구 공항대로 247',         37.5597, 126.8356, '강하늘', '02-1234-5670', 'warning');

-- 2. 취급 상품 (대리점별 2~5개)

-- 강남 전자유통 (4개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['LED 디스플레이 패널','산업용 카메라 모듈','스마트 센서 키트','전력 변환 장치']),
       unnest(ARRAY[12000000, 8500000, 11000000, 10500000])
FROM partners WHERE name = '강남 전자유통';

-- 서초 종합상사 (3개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['자동차 부품 세트','전기차 충전 모듈','ADAS 센서 패키지']),
       unnest(ARRAY[15000000, 13000000, 10500000])
FROM partners WHERE name = '서초 종합상사';

-- 중구 물류센터 (2개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['냉동 물류 컨테이너','온도 모니터링 장치']),
       unnest(ARRAY[8000000, 7200000])
FROM partners WHERE name = '중구 물류센터';

-- 마포 테크파트너 (5개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['IoT 허브 장치','클라우드 게이트웨이','네트워크 스위치','보안 카메라 시스템','원격 모니터링 솔루션']),
       unnest(ARRAY[6000000, 7500000, 5800000, 6200000, 4300000])
FROM partners WHERE name = '마포 테크파트너';

-- 강동 유통망 (2개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['포장재 자동화 설비','바코드 스캐너 세트']),
       unnest(ARRAY[5000000, 3700000])
FROM partners WHERE name = '강동 유통망';

-- 영등포 비즈허브 (4개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['산업용 로봇 암','PLC 제어 모듈','터치스크린 HMI','비전 검사 시스템']),
       unnest(ARRAY[18000000, 14000000, 12500000, 10600000])
FROM partners WHERE name = '영등포 비즈허브';

-- 용산 테크센터 (5개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['노트북 리퍼 유닛','SSD 스토리지','무선 AP 장치','UPS 전원 공급장치','서버 랙 시스템']),
       unnest(ARRAY[5000000, 4200000, 3800000, 4500000, 4900000])
FROM partners WHERE name = '용산 테크센터';

-- 노원 대리점 (3개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['에어컨 실외기','냉매 충전 키트','전기 히트펌프']),
       unnest(ARRAY[2500000, 1800000, 2000000])
FROM partners WHERE name = '노원 대리점';

-- 성동 솔루션 (4개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['태양광 패널','인버터 시스템','배터리 저장 모듈','스마트 미터']),
       unnest(ARRAY[5500000, 4800000, 5200000, 3400000])
FROM partners WHERE name = '성동 솔루션';

-- 강서 파트너스 (2개)
INSERT INTO products (partner_id, name, monthly_revenue)
SELECT id, unnest(ARRAY['항공화물 추적 장치','RFID 태그 시스템']),
       unnest(ARRAY[2200000, 1900000])
FROM partners WHERE name = '강서 파트너스';
