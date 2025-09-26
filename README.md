# Node.js Text Classifier/Summarizer AWS Lambda

AWS Lambda function for classifying and summarizing email content using AI models.

## Features

- **Modularity**: Easy to extend and swap models
- **Modes**: Classify emails into topics or generate summaries
- **Model Abstraction**: Just extend class ModelProvider and implement it's methods
- **Cost Awareness**: Caching (in memory as example, but should be as Lambda Layer on AWS), batch processing, and input truncation
- **Robust Error Handling**: Graceful handling of invalid inputs with detailed logging

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup (.env example)
```bash
  MODEL_TYPE=gemini
  GEMINI_MODEL_VERSION=gemini-2.0-flash
  LOG_LEVEL=info
  GEMINI_API_KEY=your_key
```

### 3. Run Locally
```bash
# Classify emails
node app/run.js --input sample/emails.json --mode classify

# Summarize emails  
node app/run.js --input sample/emails.json --mode summarize
```

## Input Format

```json
[
  {
    "id": 1,
    "subject": "Invoice #1234 overdue",
    "body": "Dear customer, your invoice is overdue. Please pay immediately."
  },
  {
    "id": 2,
    "subject": "Weekly engineering sync",
    "body": "Agenda: API updates, database migration, code review process."
  }
]
```

## Output Examples

### Classification Mode
```json
[
  { "id": 1, "topics": ["finance"] },
  { "id": 2, "topics": ["technical"] }
]
```

### Summarization Mode
```json
[
  { "id": 1, "summary": "Invoice payment reminder for overdue account." },
  { "id": 2, "summary": "Weekly engineering meeting covering API updates and migrations." }
]
```

## Models

### Gemini Model  
- **Type**: Google's AI model
- **Cost**: Pay-per-use (optimized with caching/batching)
- **Setup**: Requires `GEMINI_API_KEY`

### Local Model
- **Type**: Just a simple example on how you can add new Model by extending ModelProvider class

## Cost Optimization Features

- **Caching**: In-memory cache for repeated content (Lambda Layer cache in real scenario)
- **Batch Processing**: Single API calls for multiple items
- **Input Truncation**: Limits text length to reduce token usage
- **Smart Fallbacks**: Falls back to individual processing if batch processing not available

## Error Handling

- **Input Validation**: Validates mode and email structure
- **Graceful Degradation**: Continues processing valid items when some fail
- **Detailed Logging**: Structured logging with request context
- **Middleware Chain**: Centralized error handling with proper HTTP responses

## Development

### Adding New Models
1. Extend `ModelProvider` class
2. Implement `classify()` and `summarize()` methods
3. Add to model factory in `models/index.js`

### Adding New Operations
1. Add operation function to `utils/operations.js`
2. Update mode validation in `middleware/validateMode.js`

## Lambda Deployment

The function is designed for AWS Lambda with:
- **Runtime**: Node.js
- **Handler**: `app/handler.handler`
- **Environment Variables**: `MODEL_TYPE`, `GEMINI_API_KEY`, `LOG_LEVEL`, `GEMINI_MODEL_VERSION`
- **Middleware**: Input validation, error handling, logging