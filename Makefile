.PHONY: up down logs build server worker restart-worker setup-db setup-opensearch seed-consent scan-events scan-jobs scan-consent scan-vectors wipe-vectors peek-queue test-bedrock test-tools test-recommend test-privacy test-e2e test-rate-limit demo-conflict show-trace list-gemini-models clean ps

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

server:
	docker compose logs -f server

worker:
	docker compose logs -f worker

# Worker has no auto-reload — restart it after worker code changes.
# Uses up --force-recreate so .env changes also get picked up
# (plain `restart` does NOT re-evaluate env vars).
restart-worker:
	docker compose up -d --force-recreate worker

# Phase 2 — DynamoDB tables and queue inspection
setup-db:
	docker compose exec server python /app/scripts/setup_dynamodb.py

# Phase 7 — OpenSearch indexes and vector inspection
setup-opensearch:
	docker compose exec worker python /app/scripts/setup_opensearch.py

# usage: make scan-vectors COLL=customer-facts CUST=cust_1
# CUST is optional; omit it to scan everything in the collection
scan-vectors:
	docker compose exec worker python /app/scripts/scan_vectors.py $(COLL) $(CUST)

# Clear all docs from the 3 vector collections (indexes stay)
# Useful when switching LLM backends — vectors from Mock and Gemini aren't comparable
wipe-vectors:
	docker compose exec worker python /app/scripts/wipe_vectors.py

scan-events:
	docker compose exec server python /app/scripts/scan.py customer_events

scan-jobs:
	docker compose exec server python /app/scripts/scan.py jobs

scan-consent:
	docker compose exec server python /app/scripts/scan.py customer_consent

peek-queue:
	docker exec hyperpersona-redis-1 redis-cli LRANGE jobs:pending 0 -1

# Phase 4 — Bedrock wrapper sanity test (mock or real, depending on BEDROCK_MODE)
test-bedrock:
	docker compose exec worker python /app/scripts/test_bedrock.py

# Debug: list Gemini models the current API key can call
list-gemini-models:
	docker compose exec worker python /app/scripts/list_gemini_models.py

# Phase 5 — Seed test consent records and run all four agent tools
seed-consent:
	docker compose exec worker python /app/scripts/seed_consent.py

test-tools:
	docker compose exec worker python /app/scripts/test_tools.py

# Phase 6 — Show the agent trace for one job: make show-trace JOB=<job_id>
show-trace:
	docker compose exec worker python /app/scripts/show_trace.py $(JOB)

# Phase 8 — Hit GET /recommend: make test-recommend CUST=cust_1 CTX="outdoor gear"
test-recommend:
	curl -s -H "X-API-Key: test-key" \
	  --data-urlencode "customer_id=$(CUST)" \
	  --data-urlencode "context=$(CTX)" \
	  -G "http://localhost:8000/recommend"

# Phase 11 — End-to-end privacy + GDPR delete verification
test-privacy:
	docker compose exec server python /app/scripts/test_privacy.py

# Phase 12 — Full happy-path demo + ACE conflict-detection demo
test-e2e:
	docker compose exec server python /app/scripts/test_e2e.py

demo-conflict:
	docker compose exec worker python /app/scripts/conflict_demo.py

# Phase 16 — verify rate limit kicks in. Override count: N=300 make test-rate-limit
test-rate-limit:
	docker compose exec -e N=$(or $(N),150) server python /app/scripts/test_rate_limit.py

ps:
	docker compose ps

clean:
	docker compose down -v
