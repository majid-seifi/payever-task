test:
	docker exec -it payever-api sh -c "cd /app && yarn test"

test-e2e:
	docker exec -it payever-api sh -c "cd /app && yarn test:e2e"

test-cov:
	docker exec -it payever-api sh -c "cd /app && yarn test:cov"

.PHONY: test
