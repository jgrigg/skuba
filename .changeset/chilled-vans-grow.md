---
"skuba": patch
---

template/lambda-sqs-worker\*: Prime dev ECR cache in Buildkite pipeline

This should result in faster "Deploy Dev" times as the ECR cache will already be warm.